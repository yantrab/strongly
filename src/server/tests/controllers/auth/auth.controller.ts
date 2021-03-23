import { body, post, email, min, get, user, reply, Controller, params, headers } from "../../../../index";
import { UserService } from "../../services/user.service";
import { query } from "../../../../decorators/route-params/route-param.decorators";

@Controller("auth", { description: "User authentication stuff" })
export class AuthController {
  constructor(private userService: UserService) {}

  @post login(@body("email") @email email: string, @body("password") @min(6) password: string) {
    return this.userService.validateAndGetUser(email, password);
  }

  @get getUserAuthenticated(@user user, @reply reply) {
    if (!user) {
      reply.code(401).send();
      return;
    }
    return user;
  }

  @post notEmptyString(@body("str") str?: string) {
    return { str };
  }

  @get queryParams(@query arg: { a: number; b: string }) {
    return { r: arg.a + arg.b };
  }

  @get manyTypes(@params("x") x: number | string): Promise<number | string> {
    if (x === 1) {
      return Promise.resolve("a");
    } else return Promise.resolve(1);
  }

  @post manyString(@body("x") x: number | string): "a" | "b" {
    return "a";
  }

  @get queryParams2(@query arg: { a: { c: number }; b: string }) {
    return { r: arg.a + arg.b };
  }

  @post someHeader(@headers("a") a: string) {
    return { a };
  }
  @post async setPassword(
    @body("email") email: string,
    @body("password") @min(6) password: string,
    @body("rePassword", { const: { $data: "1/password" } }) @min(6) rePassword: string
  ) {
    return {};
  }
}
