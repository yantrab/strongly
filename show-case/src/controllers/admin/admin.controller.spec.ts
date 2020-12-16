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
  @mock<UserService>(UserService, "validateAndGetUser", { fName: "lo", lName: "asbaba" })
  async forbidden() {
    const loginReq = await this.app.inject({ method: "POST", url: "/auth/login", body: { email: "a@b.c", password: "password" } } as any);
    const cookies: any = loginReq.cookies[0];
    const res = await this.app.inject({ method: "GET", url: "/admin/users", cookies });
    expect(res.statusCode).toBe(403);
  }

  // @test
  // async getUsers() {
  //   const res = await this.app.inject({ method: "GET", url: "/admin/users", cookies: (await this.login()) as any });
  //   expect(res.statusCode).toBe(403);
  // }
}
