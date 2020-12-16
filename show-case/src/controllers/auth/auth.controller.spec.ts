import { suite, test } from "@testdeck/jest";
import "reflect-metadata";
import { ServerFactory, mock } from "strongly";
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

  @test("should add token to cookies")
  @mock<UserService>(UserService, "validateAndGetUser", { fName: "lo", lName: "asbaba" })
  async login() {
    const res = await this.app.inject({ method: "POST", url: "/auth/login", body: { email: "a@b.c", password: "password" } } as any);
    expect((res.cookies[0] as any).name).toBe("token");
    expect(res.json()).toStrictEqual({ fName: "lo", lName: "asbaba" });
    return res.cookies;
  }

  @test("wrong user or password")
  @mock<UserService>(UserService, "validateAndGetUser", undefined as any)
  async invalidLogin() {
    const res = await this.app.inject({ method: "POST", url: "/auth/login", body: { email: "a@b.c", password: "password" } } as any);
    expect(res.statusCode).toBe(401);
  }

  @test
  async getUserAuthenticated() {
    const res = await this.app.inject({ method: "GET", url: "/auth/get-user-authenticated", cookies: (await this.login()) as any });
    expect(res.json()).toStrictEqual({ fName: "saba", lName: "baba" });
  }
}
