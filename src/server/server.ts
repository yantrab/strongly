import "reflect-metadata";
import fastify, { FastifyServerOptions } from "fastify";
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

    const app = fastify({
      ajv: {
        customOptions: {
          keywords: {
            notEmptyString: {
              validate: (_, data, parentData, path, o, u) => {
                o[u] = data.trim();
                return o[u].length > 0;
              }
            }
          }
        }
      }
    });

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

    app.get("/is-alive", {}, async () => {
      return { hello: "world" };
    });
    app.ready(err => {
      if (err) throw err;
      app.swagger();
    });
    return app;
  }
}

export const inject = async <T>(target, providers?: { new (...args) }[]): Promise<T> => diService.inject(target, providers);
/**
 * If T is a Class, return union string type of class methods
 */
type ClassType<T> = T extends { new (...args: any[]): infer R } ? keyof R : never;

/**
 * Check if property is a function/method
 */
type AnyFunc = (...args: any[]) => any;
type PromiseReturnType<T> = T extends Promise<infer R> ? R : T;
/**
 *
 * @param provider the service that you want to mock
 * @param key function name
 * @param value object or function
 */
export const mock = <T, P = new (...args: any[]) => T, K = ClassType<P>>(
  provider: P,
  key: ClassType<P>,
  value: P extends { new (): infer R }
    ? R[keyof R] extends AnyFunc
      ? PromiseReturnType<ReturnType<R[keyof R]>> | ((...args: any[]) => PromiseReturnType<ReturnType<R[keyof R]>>)
      : never
    : never
) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  target[propertyKey] = async function() {
    const temp = await diService.inject(provider);
    await diService.mock(provider, key, value);
    const result = await originalMethod.apply(this);
    diService.override((provider as any).name, temp);
    return result;
  };
  return target;
};
