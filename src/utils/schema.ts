import { symbols } from "./consts";

export function addMethodHook(target, key: string, hookKey: string, hookAction: (...args) => any) {
  const allRoutes = Reflect.getMetadata(symbols.route, target) || {};
  const route = allRoutes[key] || {};
  route.hooks = route.hooks || {};
  route.hooks[hookKey] = (route.hooks[hookKey] || []).concat([hookAction]);
  allRoutes[key] = route;
  Reflect.defineMetadata(symbols.route, allRoutes, target);
}

export function addClassHook(target, hookKey: string, hookAction: (...args) => any) {
  const allRoutes = Reflect.getMetadata(symbols.route, target.prototype) || {};
  Object.keys(allRoutes).forEach((key) => {
    const route = allRoutes[key];
    route.hooks = route.hooks || {};
    route.hooks[hookKey] = (route.hooks[hookKey] || []).concat([hookAction]);
  });
  Reflect.defineMetadata(symbols.route, allRoutes, target);
}
