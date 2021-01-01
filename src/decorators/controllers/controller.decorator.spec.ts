import { Controller, ControllerOptions } from "./controller.decorator";
import { get } from "../routes/route.decorators";
import { suite, test } from "@testdeck/jest";
import "reflect-metadata";
import { ServerFactory } from "../../server/server";
import { symbols } from "../../utils/consts";

@suite
class ControllerDecoratorTests {
  @test("should create class name as base route")
  async withoutBasePath() {
    @Controller
    class UserController1 {
      @get
      user() {
        return { hello: "world" };
      }
    }
    const res: any = await (await ServerFactory.create({ controllers: [UserController1] })).inject({ method: "GET", path: "/user1/user" });
    expect(res.json().hello).toBe("world");
  }

  @test("should create base route")
  async withBasePath() {
    @Controller("base-path")
    class UserController {
      @get
      user() {
        return { hello: "world" };
      }
    }
    const res: any = await (await ServerFactory.create({ controllers: [UserController] })).inject({
      method: "GET",
      path: "/base-path/user"
    });
    expect(res.json().hello).toBe("world");
  }

  @test("should add description")
  async withDescription() {
    @Controller("base-path", { description: "some description" })
    class UserController {}
    const meta = Reflect.getMetadata(symbols.controller, UserController);
    expect(meta).toStrictEqual({ description: "some description" } as ControllerOptions);
  }
}
