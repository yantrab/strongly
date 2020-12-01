import { body } from "./route-param.decorators";
import { suite, test } from "@testdeck/jest";
import "reflect-metadata";
import { symbols } from "../../utils/consts";
import { get, post } from "../routes/route.decorators";

@suite
class RouteDecoratorsTests {
  @test
  body1() {
    class User {
      @get getUsers(@body body) {}
    }
    const routes = Reflect.getMetadata(symbols.route, User.prototype);
    expect(routes["getUsers"].params).toStrictEqual([{ path: "body" }]);
  }

  @test
  body2() {
    class User {
      @get getUsers(@body() body) {}
    }
    const routes = Reflect.getMetadata(symbols.route, User.prototype);
    expect(routes["getUsers"].params).toStrictEqual([{ path: "body" }]);
  }

  @test
  body3() {
    class User {
      @get getUsers(@body("id") id) {}
    }
    const routes = Reflect.getMetadata(symbols.route, User.prototype);
    expect(routes["getUsers"].params).toStrictEqual([{ path: "body.id" }]);
  }
}
