import { suite, test } from "@testdeck/jest";
import "reflect-metadata";
import { ServerFactory, inject, mock } from "../../../../index";
import { AuthController } from "./auth.controller";
import { UserService } from "../../services/user.service";
import { FastifyInstance } from "fastify";

@suite
class LoginTests {
  app: FastifyInstance;
  async before() {
    this.app = await ServerFactory.create({ controllers: [AuthController] });
  }

  @test("should return mocked user")
  @mock(UserService, "validateAndGetUser", { fName: "lo", lName: "asbaba" })
  async login() {
    const res = await this.app.inject({ method: "POST", url: "/auth/login", body: { email: "a@b.c", password: "password" } } as any);
    expect(res.json()).toStrictEqual({ fName: "lo", lName: "asbaba" });
  }

  @test("should return from mock2")
  @mock(UserService, "validateAndGetUser", { fName: "lo", lName: "asbaba" })
  async login2() {
    const c = await inject<AuthController>(AuthController);
    const result = c.login("asdf", "asdf");
    expect(result).toStrictEqual({ fName: "lo", lName: "asbaba" });
  }

  @test("should return from mock3")
  @mock(UserService, "validateAndGetUser", () => {
    return { fName: "a", lName: "c" };
  })
  async login3() {
    const c = await inject<AuthController>(AuthController);
    const result = c.login("asdf", "asdfs");
    expect(result).toStrictEqual({ fName: "a", lName: "c" });
  }

  @test
  async notEmptyString() {
    const res = await this.app.inject({ method: "POST", url: "/auth/not-empty-string", body: { str: "    " } } as any);
    expect(res.statusCode).toBe(400);
  }

  @test
  async validNotEmptyString() {
    const res = await this.app.inject({ method: "POST", url: "/auth/not-empty-string", body: { str: "   2 " } } as any);
    expect(res.json()).toStrictEqual({ str: "2" });
  }

  @test
  async validNotEmptyString2() {
    const res = await this.app.inject({ method: "POST", url: "/auth/not-empty-string", body: { str: 2 } } as any);
    expect(res.json()).toStrictEqual({ str: "2" });
  }

  @test
  async validNotEmptyString3() {
    const res = await this.app.inject({ method: "POST", url: "/auth/not-empty-string", body: {} } as any);
    expect(res.json()).toStrictEqual({});
  }

  @test
  async queryParams() {
    const res = await this.app.inject({ method: "GET", url: "/auth/query-params", query: { a: 1, b: "a" } } as any);
    expect(res.json().r).toEqual("1a");
  }

  @test
  async setPasswordValid() {
    const res = await this.app.inject({
      method: "POST",
      url: "/auth/set-password",
      body: { email: "a@b.caaaa", password: "123456", rePassword: "123456" },
    } as any);
    expect(res.statusCode).toStrictEqual(200);
  }

  @test
  async setPasswordUnValid() {
    const res = await this.app.inject({
      method: "POST",
      url: "/auth/set-password",
      body: { email: "a@b.caaaa", password: "123456", rePassword: "1234562" },
    } as any);
    expect(res.statusCode).toStrictEqual(400);
  }
}
