import { suite, test } from "@testdeck/jest";
import "reflect-metadata";
import { ServerFactory, inject, mock } from "strongly";
import { AuthController } from "./auth.controller";
import { UserService } from "../../services/user.service";
import { FastifyInstance } from "fastify";
import fastifyJwt from "fastify-jwt";
import fastifyCookie from "fastify-cookie";

@suite
class LoginTests {
  app: FastifyInstance;
  async before() {
    this.app = await ServerFactory.create({ controllers: [AuthController] });
    this.app.register(fastifyJwt, {
      secret: "supersecret",
      cookie: {
        cookieName: "token"
      }
    });
    this.app.register(fastifyCookie);
  }

  @test("should return mocked user")
  @mock<UserService>(UserService, "validateAndGetUser", { fName: "lo", lName: "asbaba" })
  async login() {
    const res = await this.app.inject({ method: "POST", url: "/auth/login", body: { email: "a@b.c", password: "password" } } as any);
    expect(res.json()).toStrictEqual({ fName: "lo", lName: "asbaba" });
  }

  @test("should return from mock2")
  @mock<UserService>(UserService, "getUser", { fName: "lo", lName: "asbaba" })
  async login2() {
    const c = await inject<AuthController>(AuthController);
    const result = c.getUser(1);
    expect(result).toStrictEqual({ fName: "lo", lName: "asbaba" });
  }
}
