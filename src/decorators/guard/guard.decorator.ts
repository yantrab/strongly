import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Forbidden, Unauthorized } from "http-errors";
import { addClassHook, addMethodHook } from "../../utils/schema";

export const guard = (isUserPermitted) => (target: any, propertyKey?: string) => {
  const action = (app: FastifyInstance, request: FastifyRequest, reply: FastifyReply, next: (...args) => any) => {
    const user = (request as any).user;
    if (!user) {
      next(new Unauthorized());
    }
    if (isUserPermitted((request as any).user)) {
      next();
    } else {
      next(new Forbidden());
    }
  };
  if (propertyKey) addMethodHook(target, propertyKey, "preHandler", action);
  else addClassHook(target, "preHandler", action);
};
