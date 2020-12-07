import { symbols } from "../../utils/consts";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

function addMethodHook(target, key: string, hookKey: string, hookAction: () => any) {
  const allRoutes = Reflect.getMetadata(symbols.route, target) || {};
  const route = allRoutes[key] || {};
  route.hooks = route.hooks || {};
  route.hooks[hookKey] = (route.hooks[hookKey] || []).concat([hookAction]);
  allRoutes[key] = route;
  Reflect.defineMetadata(symbols.route, allRoutes, target);
}

function addClassHook(target, hookKey: string, hookAction: () => any) {
  const allRoutes = Reflect.getMetadata(symbols.route, target.prototype) || {};
  Object.keys(allRoutes).forEach(key => {
    const route = allRoutes[key];
    route.hooks = route.hooks || {};
    route.hooks[hookKey] = (route.hooks[hookKey] || []).concat([hookAction]);
  });
  Reflect.defineMetadata(symbols.route, allRoutes, target);
}

interface IAction {
  (action: (app: FastifyInstance, request: FastifyRequest, reply: FastifyReply, next: () => any) => void);
}

interface IActionWithPayload {
  (action: (app: FastifyInstance, request: FastifyRequest, reply: FastifyReply, payload: any, next: (err, payload) => any) => void);
}

class Hook {
  readonly onRequest: IAction;
  readonly preParsing: IAction;
  readonly preValidation: IAction;
  readonly preHandler: IAction;
  readonly preSerialization: IActionWithPayload;
  readonly onSend: IActionWithPayload;
  readonly onResponse: IAction;
  constructor() {
    ["onRequest", "preParsing", "preValidation", "preHandler", "preSerialization", "onSend", "onResponse"].forEach(hook => {
      this[hook] = action => (target: any, propertyKey?: string) => {
        if (propertyKey) addMethodHook(target, propertyKey, hook, action);
        else addClassHook(target, hook, action);
      };
    });
  }
}

const Hooks = new Hook();

export = Hooks;
