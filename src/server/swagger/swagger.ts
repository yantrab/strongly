import { symbols } from "../../utils/consts";
import { toSnack } from "../../utils/util";
import { method } from "../../utils/interfaces";
import { getDefinitions, getMethodSchema } from "../../utils/typescript-service";
import { readFileSync } from "fs";
import { resolve } from "path";
import serveStatic from "fastify-static";
import { getAbsoluteFSPath } from "swagger-ui-dist";
import { ControllerOptions } from "../../decorators";
import { OpenAPIV2 } from "openapi-types";
import converter from "swagger2openapi";
const pk = JSON.parse(readFileSync(resolve("./package.json"), { encoding: "utf-8" }));

export const addSwagger = (controllers, app) => {
  const swaggerSchema: OpenAPIV2.Document = {
    swagger: "2.0",
    info: { title: pk.name, version: pk.version, description: pk.description },
    paths: {},
    definitions: {},
    tags: []
  };
  for (const controller of controllers) {
    const basePath = Reflect.getMetadata(symbols.basePath, controller) || toSnack(controller.name.replace("Controller", ""));
    const options: ControllerOptions = Reflect.getMetadata(symbols.controller, controller);
    swaggerSchema.tags?.push({ name: basePath, description: options?.description });
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
        ...getMethodSchema(controller, key),
        operationId: key,
        produces: ["application/json"]
      };
      Object.keys(schema.params?.properties || []).forEach(prop => {
        const param = schema.params.properties[prop];
        swaggerSchema.paths[url][method.routeType].parameters.push({
          name: prop,
          in: "path",
          required: schema.params.required.includes(prop),
          ...param
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

      Object.keys(schema.query?.properties || []).forEach(prop => {
        const param = schema.query.properties[prop];
        const toAdd: any = { name: prop, in: "query", required: schema.query.required.includes(prop) };
        if (param.type === "object") {
          toAdd.type = "object";
          toAdd.schema = param;
        } else {
          Object.assign(toAdd, param);
        }
        swaggerSchema.paths[url][method.routeType].parameters.push(toAdd);
      });

      if (schema.query?.$ref) {
        swaggerSchema.paths[url][method.routeType].parameters.push({ name: "query", in: "query", ...schema.query });
      }
    });
  }
  const definitions = getDefinitions() || {};

  Object.keys(definitions).forEach(key => {
    if (swaggerSchema.definitions) swaggerSchema.definitions[key] = definitions[key];
  });
  const swaggerUIPath = getAbsoluteFSPath();

  app.register(serveStatic, {
    root: swaggerUIPath
  });

  app.get("/api-doc/json", {}, _ => {
    return new Promise(res => converter.convertObj(swaggerSchema, { patch: true }, (err, options) => res(options.openapi)));
  });

  app.get("/api-doc", {}, async (request, reply) => {
    const file = readFileSync(swaggerUIPath + "/index.html", { encoding: "utf-8" }).replace(
      "https://petstore.swagger.io/v2/swagger.json",
      "api-doc/json"
    );
    reply.type("text/html").send(file);
  });
};
