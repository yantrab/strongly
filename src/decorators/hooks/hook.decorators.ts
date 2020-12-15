import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { addClassHook, addMethodHook } from "../../utils/schema";

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
