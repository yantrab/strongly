import { get, put, Delete, head, patch, options } from "../index";
import { suite, test } from "@testdeck/jest";
import "reflect-metadata";
import { symbols } from "../../utils/consts";

@suite
class RouteDecoratorsTests {
  @test
  test() {
    class User {
      @get("users")
      getUsers1() {}

      @put("users")
      getUsers2() {}

      @Delete("")
      getUsers3() {}

      @head("users")
      getUsers4() {}

      @patch
      getUsers5() {}

      @options
      getUsers6() {}
    }
    const routes = Reflect.getMetadata(symbols.route, User.prototype);
    expect(routes).toStrictEqual({
      getUsers1: {
        routeType: "get",
        path: "users",
      },
      getUsers2: {
        routeType: "put",
        path: "users",
      },
      getUsers3: {
        routeType: "delete",
        path: "",
      },
      getUsers4: {
        routeType: "head",
        path: "users",
      },
      getUsers5: {
        routeType: "patch",
        path: undefined,
      },
      getUsers6: {
        routeType: "options",
        path: undefined,
      },
    });
  }
}
