import { get } from "./route.decorators";
import { suite, test } from "@testdeck/jest";
import "reflect-metadata";
import { symbols } from "../../utils/consts";

@suite
class RouteDecoratorsTests {
  @test
  test() {
    class User {
      @get
      getUsers1() {}

      @get()
      getUsers2() {}

      @get("")
      getUsers3() {}

      @get("users")
      getUsers4() {}
    }
    const routes = Reflect.getMetadata(symbols.route, User.prototype);
    expect(routes).toStrictEqual({
      getUsers1: {
        routeType: "get",
        path: undefined
      },
      getUsers2: {
        routeType: "get",
        path: undefined
      },
      getUsers3: {
        routeType: "get",
        path: ""
      },
      getUsers4: {
        routeType: "get",
        path: "users"
      }
    });
  }
}
