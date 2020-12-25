import { suite, test } from "@testdeck/jest";
import "reflect-metadata";
import { ServerFactory, mock } from "strongly";
import { AdminController } from "./admin.controller";
import { AuthController } from "../auth/auth.controller";
import { FastifyInstance } from "fastify";
import fastifyJwt from "fastify-jwt";
import fastifyCookie from "fastify-cookie";
import { UserService } from "../../services/user.service";

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

  @test
  async unauthorized() {
    const res = await this.app.inject({ method: "GET", url: "/admin/users" });
    expect(res.statusCode).toBe(401);
  }

  async login() {
    const res = await this.app.inject({ method: "POST", url: "/auth/login", body: { email: "a@b.c", password: "password" } } as any);
    return res.cookies;
  }

  @test
  @mock(UserService, "validateAndGetUser", { fName: "lo", lName: "asbaba" })
  async forbidden() {
    const loginReq = await this.app.inject({ method: "POST", url: "/auth/login", body: { email: "a@b.c", password: "password" } } as any);
    const res = await this.app.inject({ method: "GET", url: "/admin/users", cookies: { token: (loginReq.cookies[0] as any).value } });
    expect(res.statusCode).toBe(403);
  }

  @test
  @mock(UserService, "validateAndGetUser", { fName: "lo", lName: "asbaba", role: "admin" })
  async getUsers() {
    const loginReq = await this.app.inject({ method: "POST", url: "/auth/login", body: { email: "a@b.c", password: "password" } } as any);
    const res = await this.app.inject({ method: "GET", url: "/admin/users", cookies: { token: (loginReq.cookies[0] as any).value } });
    expect(res.json()).toStrictEqual([{ fName: "saba" }, { fName: "baba" }]);
  }
}
