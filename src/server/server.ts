import "reflect-metadata";
import fastify, { FastifyInstance, FastifyReply, FastifyRequest, FastifyServerOptions } from "fastify";
import { symbols } from "../utils/consts";
import { toSnack } from "../utils/util";
import { method } from "../utils/interfaces";
import { get } from "lodash";
import { fastifySwagger } from "fastify-swagger";
import { getMethodSchema } from "../utils/typescript-service";
import glob from "globby";
import { dirname } from "path";
import { DIService } from "./di/di.service";
const diService = new DIService();
async function getControllers(controllers): Promise<any[]> {
  if (!controllers || typeof controllers === "string") {
    const folderPath = dirname(require.main?.filename as string);
    const paths = glob.sync([folderPath + (controllers ? "/" + controllers : "/controllers/**"), "!**.spec.ts"]);
    const result = await Promise.all(
      paths.map(async p => {
        const m = await import(p);
        return Object.values(m)[0] as () => any;
      })
    );
    return result.filter(c => c.prototype);
  }
  return controllers;
}

export class ServerFactory {
  static async create(opts?: FastifyServerOptions & { controllers?: { new (args) }[] | string; providers?: { new (...args) }[] }) {
    const controllers = await getControllers(opts?.controllers);
    if (!controllers.length) {
      throw new Error("There is no controllers!");
    }
    await diService.setDependencies(opts?.providers);

    const app = fastify(opts);
    app.register(fastifySwagger, {
      routePrefix: "/api-doc",
      swagger: {
        info: {
          title: "Api documentation" + "",
          description: "fastify swagger api",
          version: "0.1.0"
        }
      },
      exposeRoute: true
    });
    for (const controller of controllers) {
      const args = await diService.getDependencies(controller);
      const instance = new controller(...args);
      const basePath = Reflect.getMetadata(symbols.basePath, controller) || toSnack(controller.name.replace("Controller", ""));
      const routes: method = Reflect.getMetadata(symbols.route, controller.prototype);
      Object.keys(routes || {}).forEach(key => {
        const method = routes[key];
        const path = method.path || toSnack(key);
        const url = `/${basePath}/${path}`;
        const hooks = {};
        Object.keys(method.hooks || {}).forEach(key => {
          method.hooks[key].forEach(m => {
            hooks[key] = (hooks[key] || []).concat([(...args) => m(app, ...args)]);
          });
        });
        const handler = async (request, reply) => instance[key](...(method.params || []).map(p => get({ request, reply, app }, p.path)));
        const schema = { ...method.schema?.request, tags: [basePath], ...getMethodSchema(controller, key) };
        const options = { schema, ...hooks };
        app[method.routeType](url, options, handler);
      });
    }

    app.get("/is-alive", {}, async (request, reply) => {
      return { hello: "world" };
    });
    app.ready(err => {
      if (err) throw err;
      app.swagger();
    });
    return app;
  }
}

export const inject = async <T>(target): Promise<T> => diService.inject(target);
export const mock = <T>(provide: any, key: keyof T, value: any) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  target[propertyKey] = async function() {
    const temp = await diService.inject(provide);
    await diService.mock(provide, key, value);
    await originalMethod.apply(this);
    diService.override(provide.name, temp);
  };
  return target;
};
