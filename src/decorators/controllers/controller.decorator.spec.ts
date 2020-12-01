import { Controller } from "./controller.decorator";
import { get } from "../routes/route.decorators";
import { suite, test } from "@testdeck/jest";
import "reflect-metadata";
import { ServerFactory } from "../../server/server";

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
}
