import { symbols } from "../../utils/consts";
import { toSnack } from "../../utils/util";
import { method } from "../../utils/interfaces";
import { getDefinitions, getMethodSchema } from "../../utils/typescript-service";
import { readFileSync } from "fs";
import { resolve } from "path";
import serveStatic from "fastify-static";
import { getAbsoluteFSPath } from "swagger-ui-dist";
import { ControllerOptions } from "../../decorators";

const pk = JSON.parse(readFileSync(resolve("./package.json"), { encoding: "utf-8" }));

export const addSwagger = (controllers, app) => {
  const swaggerSchema: any = {
    swagger: "2.0",
    info: { title: pk.name, version: pk.version, description: pk.description },
    paths: {},
    definitions: {},
    tags: []
  };
  for (const controller of controllers) {
    const basePath = Reflect.getMetadata(symbols.basePath, controller) || toSnack(controller.name.replace("Controller", ""));
    const options: ControllerOptions = Reflect.getMetadata(symbols.controller, controller);
    swaggerSchema.tags.push({ name: basePath, description: options?.description });
    const routes: method = Reflect.getMetadata(symbols.route, controller.prototype);
    Object.keys(routes || {}).forEach(key => {
      const method = routes[key];
      const path = method.path || toSnack(key);
      const url = `/${basePath}/${path}`;
      const schema = { ...method.schema?.request, tags: [basePath] };
      swaggerSchema.paths[url] = {};
      swaggerSchema.paths[url][method.routeType] = {
        parameters: [],
        tags: schema.tags,
        ...getMethodSchema(controller, key)
      };
      Object.keys(schema.params?.properties || []).forEach(prop => {
        const param = schema.params.properties[prop];
        swaggerSchema.paths[url][method.routeType].parameters.push({
          name: prop,
          in: "path",
          description: param.description,
          required: schema.params.required.includes(prop)
        });
      });

      if (schema.body) {
        swaggerSchema.paths[url][method.routeType].parameters.push({
          name: "body",
          in: "body",
          required: true,
          schema: schema.body
        });
      }
    });
  }
  const definitions = getDefinitions() || {};

  Object.keys(definitions).forEach(key => {
    swaggerSchema.definitions[key] = definitions[key];
  });
  const swaggerUIPath = getAbsoluteFSPath();

  app.register(serveStatic, {
    root: swaggerUIPath
  });

  app.get("/api-doc/json", {}, _ => {
    return swaggerSchema;
  });
  app.get("/api-doc", {}, async (request, reply) => {
    const file = readFileSync(swaggerUIPath + "/index.html", { encoding: "utf-8" }).replace(
      "https://petstore.swagger.io/v2/swagger.json",
      "api-doc/json"
    );
    reply.type("text/html").send(file);
  });
};
