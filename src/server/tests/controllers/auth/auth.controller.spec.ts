import { suite, test } from "@testdeck/jest";
import "reflect-metadata";
import { ServerFactory, inject, mock } from "../../../server";
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
  @mock<UserService>(UserService, "validateAndGetUser", { fName: "lo", lName: "asbaba" })
  async login() {
    const res = await this.app.inject({ method: "POST", url: "/auth/login", body: { email: "a@b.c", password: "password" } } as any);
    expect(res.json()).toStrictEqual({ fName: "lo", lName: "asbaba" });
  }

  @test("should return from mock2")
  @mock<UserService>(UserService, "validateAndGetUser", { fName: "lo", lName: "asbaba" })
  async login2() {
    const c = await inject<AuthController>(AuthController);
    const result = c.login("asdf", "asdf");
    expect(result).toStrictEqual({ fName: "lo", lName: "asbaba" });
  }

  @test("should return from mock3")
  @mock<UserService>(UserService, "validateAndGetUser", (email, password) => {
    return { email, password };
  })
  async login3() {
    const c = await inject<AuthController>(AuthController);
    const result = c.login("asdf", "asdfs");
    expect(result).toStrictEqual({ email: "asdf", password: "asdfs" });
  }
}
