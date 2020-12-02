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
async function getControllers(controllers): Promise<any[]> {
  if (!controllers || typeof controllers === "string") {
    const folderPath = dirname(require.main?.filename as string);
    const paths = glob.sync([folderPath + (controllers ? "/" + controllers : "/controllers/**"), "!.**spec.ts"]);
    return Promise.all(
      paths.map(async p => {
        const m = await import(p);
        return Object.values(m)[0];
      })
    );
  }
  return controllers;
}

export class ServerFactory {
  static async create(opts?: FastifyServerOptions & { controllers?: { new () }[] | string }) {
    const controllers = await getControllers(opts?.controllers);
    if (!controllers.length) {
      throw new Error("There is no controllers!");
    }
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

    controllers?.forEach(controller => {
      const instance = new controller();
      const basePath = Reflect.getMetadata(symbols.basePath, controller) || toSnack(controller.name.replace("Controller", ""));
      const routes: method = Reflect.getMetadata(symbols.route, controller.prototype);
      Object.keys(routes).forEach(key => {
        const method = routes[key];
        const path = method.path || toSnack(key);
        const url = `/${basePath}/${path}`;

        const handler = async (request, reply) => instance[key](...(method.params || []).map(p => get({ request, reply }, p.path)));
        const schema = { ...method.schema?.request, tags: [basePath], ...getMethodSchema(controller, key) };
        app[method.routeType](url, { schema }, handler);
      });
    });

    app.get("/is-alive", async (request, reply) => {
      return { hello: "world" };
    });
    app.ready(err => {
      if (err) throw err;
      app.swagger();
    });
    return app;
  }
}
