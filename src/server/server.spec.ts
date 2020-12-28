import { suite, test } from "@testdeck/jest";
import "reflect-metadata";
import { inject, ServerFactory } from "./server";
import { min, max } from "../decorators/ajv/ajv.decorators";
import { body, Controller, get, params, post, reply, request, email, onRequest, preHandler, onSend } from "..";
import { FastifyRequest, FastifyReply } from "fastify";

class someNestedClass {
  @min(4)
  someNumber: number;
}

class shokoController {
  @get somePromise(): Promise<someNestedClass> {
    return Promise.resolve({ someNumber: 1 });
  }
  @post getUsers11(@request request: FastifyRequest, @reply reply: FastifyReply) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send(request.body);
  }
  @post getUsers5(@body user: { id: number; a: someNestedClass }) {
    return user.id;
  }
  @get("getUsers6/:value") getUsers6(@params("value") @max(10) value: number) {
    return value * value;
  }
  @post getUsers4(@body user: { id: number }) {
    return user.id;
  }
  @post
  login(@body<string>("email") @email email: string, @body("password") @min(5) password: string) {
    return { a: 1 };
  }

  @onSend((app, request, reply, payload, next) => {
    next(null, payload.replace("a", "b"));
  })
  @get
  changePayload() {
    return { a: 1 };
  }
}
export class someService {
  v() {
    return { x: 1 };
  }
}

class diController {
  constructor(private s: someService) {}

  @get("v")
  getFromService() {
    return this.s.v();
  }
}

@suite
class ServerTests {
  async inject(controller, options, providers?) {
    return (await ServerFactory.create({ controllers: [controller], providers })).inject(options);
  }
  @test("should return body")
  async body() {
    @Controller
    class UserController {
      @post
      bodyWithoutPath(@body body) {
        return body;
      }
    }

    const res = await this.inject(UserController, { method: "POST", body: { id: 1 }, url: "/user/body-without-path" });
    expect(res.json()).toStrictEqual({ id: 1 });
  }

  @test("should return body parameter - id")
  async body2() {
    @Controller
    class UserController {
      @post
      bodyWithPath(@body("id") id) {
        return id;
      }
    }
    const res = await this.inject(UserController, { method: "POST", body: { id: 1 }, url: "/user/body-with-path" });
    expect(res.json()).toBe(1);
  }

  @test("should return bad request  - id type")
  async badRequest1() {
    const res = await this.inject(shokoController, { method: "POST", body: { id: "saba" }, url: "/shoko/get-users4" });
    expect(res.statusCode).toBe(400);
  }

  @test("should return bad request  - missing body")
  async badRequest2() {
    const res = await this.inject(shokoController, { method: "POST", url: "/shoko/get-users4" });
    expect(res.statusCode).toBe(400);
  }

  @test("should return bad request  - missing id parameters")
  async badRequest3() {
    const res = await this.inject(shokoController, { method: "POST", body: {}, url: "/shoko/get-users4" } as any);
    expect(res.statusCode).toBe(400);
  }

  @test("should return bad request  - min value")
  async badRequest4() {
    const res = await this.inject(shokoController, { method: "POST", body: { id: 1, a: { someNumber: 1 } }, url: "/shoko/get-users5" });
    expect(res.json()).toStrictEqual({ statusCode: 400, error: "Bad Request", message: "body.a.someNumber should be >= 4" });
  }

  @test("should return bad request  - max value")
  async badRequest5() {
    const res = await this.inject(shokoController, { method: "GET", url: "/shoko/getUsers6/11" });
    expect(res.json()).toStrictEqual({ statusCode: 400, error: "Bad Request", message: "params.value should be <= 10" });
  }

  @test("should reject error when controller are no provided")
  async noControllers() {
    try {
      await ServerFactory.create({ controllers: [] });
    } catch (e) {
      expect(e.message).toBe("There is no controllers!");
    }
  }

  @test
  async requestAndReply() {
    const res = await this.inject(shokoController, { method: "POST", body: { id: 1, a: { someNumber: 1 } }, url: "/shoko/get-users11" });
    expect(res.json()).toStrictEqual({ a: { someNumber: 1 }, id: 1 });
  }

  @test
  async invalidEmail() {
    const res = await this.inject(shokoController, { method: "post", url: "/shoko/login", body: { email: "a", password: "123456" } });
    expect(res.json()).toStrictEqual({ statusCode: 400, error: "Bad Request", message: 'body.email should match format "email"' });
  }

  @test
  async onSendTest() {
    const res = await this.inject(shokoController, { method: "get", url: "/shoko/change-payload" });
    expect(res.json()).toStrictEqual({ b: 1 });
  }

  @test
  async diTest() {
    const res = await this.inject(diController, { method: "get", url: "/di/v" });
    expect(res.json()).toStrictEqual({ x: 1 });
  }

  @test
  async diTest3() {
    const c = await inject<diController>(diController);
    expect(c.getFromService()).toStrictEqual({ x: 1 });
  }

  @test
  async diTest2() {
    class someService {
      v() {
        return { x: 3 };
      }
    }
    const res = await this.inject(diController, { method: "get", url: "/di/v" }, [someService]);
    expect(res.json()).toStrictEqual({ x: 3 });
  }
}
