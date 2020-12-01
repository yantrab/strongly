import { symbols } from "../../utils/consts";

function addRoute(target, key: string, routeType: string, path?: string) {
  const allRoutes = Reflect.getMetadata(symbols.route, target) || {};
  allRoutes[key] = Object.assign(allRoutes[key] || {}, { routeType, path });
  Reflect.defineMetadata(symbols.route, allRoutes, target);
}

interface IRoute extends MethodDecorator {
  (path?: string): MethodDecorator;
}
function getDecorator(route) {
  const decorator = (...args) => {
    if (args.length === 0) {
      return decorator;
    }

    if (typeof args[0] === "string") {
      return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        addRoute(target, propertyKey, route, args[0]);
      };
    }
    addRoute(args[0], args[1], route);
  };

  return decorator;
}

class Route {
  readonly delete: IRoute;
  readonly get: IRoute;
  readonly head: IRoute;
  readonly patch: IRoute;
  readonly post: IRoute;
  readonly put: IRoute;
  readonly options: IRoute;
  constructor() {
    ["delete", "get", "head", "patch", "post", "put", "options"].forEach(route => {
      this[route] = getDecorator(route);
    });
  }
}

const Routes = new Route();

export = Routes;
