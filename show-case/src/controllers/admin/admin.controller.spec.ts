import { suite, test } from "@testdeck/jest";
import "reflect-metadata";
import { ServerFactory, mock } from "strongly";
import { AdminController } from "./admin.controller";
import { AuthController } from "../auth/auth.controller";
import { FastifyInstance } from "fastify";
import fastifyJwt from "fastify-jwt";
import fastifyCookie from "fastify-cookie";

@suite
class AdminTests {
  app: FastifyInstance;

  async before() {
    this.app = await ServerFactory.create({ controllers: [AdminController, AuthController] });
    this.app.register(fastifyJwt, {
      secret: "supersecret",
      cookie: {
        cookieName: "token"
      }
    });
    this.app.register(fastifyCookie);
    this.app.addHook("onRequest", async request => {
      try {
        // just add user to the request
        await request.jwtVerify();
      } catch (err) {}
    });
  }
}
