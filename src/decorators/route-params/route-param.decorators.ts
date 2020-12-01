import { symbols } from "../../utils/consts";
import { set, get as getByPath, merge } from "lodash";
import { getClass, getParamSchema } from "../../utils/typescript-service";
import { JSONSchemaType } from "../../utils/util";

function getControllerSchema(target, key: string, paramIndex: number) {
  const controller = getClass(target.constructor.name);
  if (controller) {
    const param = controller.getMethodOrThrow(key).getParameters()[paramIndex];
    return getParamSchema(param.getType(), param.getDecorators());
  }
}

function addRouteParam(target, key: string, paramIndex: number, routeParamType: string, path?: string, options?: JSONSchemaType<any>) {
  const allRoutes = Reflect.getMetadata(symbols.route, target) || {};
  const route = (allRoutes[key] = allRoutes[key] || { params: [], schema: {} });
  const fullPath = routeParamType + (path ? "." + path : "");
  route.params.push({ path: fullPath });
  const schema = getControllerSchema(target, key, paramIndex);
  if (schema) {
    const schemaPath = routeParamType + (path ? ".properties." + path : "");
    set(route.schema, schemaPath, schema);
    const routeSchema = route.schema[routeParamType];
    routeSchema.type = routeSchema.type || "object";
    if (routeSchema.properties && path) {
      routeSchema.required = routeSchema.required || [];
      Object.keys(routeSchema.properties).forEach(key => {
        if (routeSchema.properties[key].optional !== true) {
          routeSchema.required.push(key);
        }
        delete routeSchema.properties[key].optional;
      });
    }
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
      addRouteParam(args[0], args[1], args[2], route);
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
      addRouteParam(target, methodName, paramIndex, route, path, options);
    };
  };

  return decorator;
}

class RouteParam {
  readonly body: IRouteParam;
  readonly query: IRouteParam;
  readonly params: IRouteParam;
  readonly headers: IRouteParam;
  constructor() {
    ["body", "query", "params", "headers"].forEach(routeParam => {
      this[routeParam] = getDecorator(routeParam);
    });
  }
}

const Routes = new RouteParam();

export = Routes;
