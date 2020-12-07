import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export declare type method = {
  [key: string]: {
    routeType: string;
    schema: any;
    path: string;
    params: { path: string }[];
    hooks: (app: FastifyInstance, request: FastifyRequest, reply: FastifyReply, done: () => any) => void;
  };
};
