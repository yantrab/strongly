import { symbols } from "../../utils/consts";
import { set, get as getByPath, merge } from "lodash";
import { getClass, getParamSchema } from "../../utils/typescript-service";
import { JSONSchemaType } from "../../utils/util";

function getControllerSchema(target, key: string, paramIndex: number) {
  const controller = getClass(target.constructor.name);
  if (controller) {
    const param = controller.getMethod(key)?.getParameters()[paramIndex];
    if (
      !param ||
      param
        .getDecorators()
        .map((d) => d.getName())
        .find((n) => ["reply", "request"].includes(n))
    ) {
      return;
    }
    return getParamSchema(param.getType(), param.getDecorators());
  }
}

function addRouteParam(target, key: string, paramIndex: number, routeParamType: string, path?: string, options?: JSONSchemaType<any>) {
  const allRoutes = Reflect.getMetadata(symbols.route, target) || {};
  const route = (allRoutes[key] = allRoutes[key] || { params: [], schema: {} });
  const fullPath = routeParamType + (path ? "." + path : "");
  const schema = Object.assign({}, route.params[paramIndex]?.schema || {}, getControllerSchema(target, key, paramIndex) || {});
  if (!route.schema) {
    route.schema = {};
  }
  route.params[paramIndex] = { path: fullPath };
  if (Object.keys(schema).length) {
    const schemaPath = routeParamType + (path ? ".properties." + path : "");
    set(route.schema, schemaPath, schema);
    const routeSchema = getByPath(route.schema, routeParamType);
    routeSchema.type = routeSchema.type || "object";
    if (routeSchema.properties && path) {
      routeSchema.required = routeSchema.required || [];
      Object.keys(routeSchema.properties).forEach((key) => {
        if (routeSchema.properties[key].optional !== true && !routeSchema.required.includes(key)) {
          routeSchema.required.push(key);
        }
        delete routeSchema.properties[key].optional;
      });
    }
    ``;
    if (!routeSchema.required?.length) {
      delete routeSchema.required;
    }
    delete routeSchema.optional;

    if (options) {
      set(route.schema, schemaPath, merge(getByPath(route.schema, schemaPath), options));
    }
  }

  Reflect.defineMetadata(symbols.route, allRoutes, target);
}

interface IRouteParam extends ParameterDecorator {
  <T>(path?: string, options?: JSONSchemaType<T>): ParameterDecorator;
  <T>(options?: JSONSchemaType<T>): ParameterDecorator;
}

function isClass(object) {
  const propertyNames = Object.getOwnPropertyNames(object);
  return propertyNames.includes("constructor");
}

function getDecorator(route) {
  const decorator = (...args) => {
    if (args.length === 0) {
      return decorator;
    }

    if (isClass(args[0])) {
      addRouteParam(args[0], args[1], args[2], "request." + route);
      return;
    }

    let options, path;
    if (typeof args[0] === "string") {
      path = args[0];
      options = args[1];
    } else {
      options = args[0];
    }

    return (target: any, methodName: string, paramIndex: number) => {
      addRouteParam(target, methodName, paramIndex, "request." + route, path, options);
    };
  };

  return decorator;
}

class RouteParam {
  readonly body: IRouteParam;
  readonly query: IRouteParam;
  readonly params: IRouteParam;
  readonly headers: IRouteParam;
  readonly request: ParameterDecorator;
  readonly reply: ParameterDecorator;
  readonly app: ParameterDecorator;
  readonly user: ParameterDecorator;
  constructor() {
    ["body", "query", "params", "headers", "user"].forEach((routeParam) => {
      this[routeParam] = getDecorator(routeParam);
    });
    ["request", "reply", "app"].forEach((p) => {
      this[p] = (target: any, methodName: string, paramIndex: number) => {
        addRouteParam(target, methodName, paramIndex, p);
      };
    });

    this.user = (target: any, methodName: string, paramIndex: number) => {
      addRouteParam(target, methodName, paramIndex, "request.user");
    };
  }
}

const Routes = new RouteParam();

export = Routes;
