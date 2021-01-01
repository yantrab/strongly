import { body, post, email, min, get, app, reply, user, request } from "strongly";
import { UserService } from "../../services/user/user.service";
import { User } from "../../domain/user";
import { Unauthorized } from "http-errors";
import { Controller } from "strongly";

@Controller("auth", { description: "User authentication stuff" })
export class AuthController {
  constructor(private userService: UserService) {}

  @post async login(@body("email") @email email: string, @body("password") @min(6) password: string, @app app, @reply reply) {
    const user = await this.userService.validateAndGetUser(email, password);
    if (!user) {
      throw new Unauthorized();
    }
    const token = app.jwt.sign({ ...user });
    reply.setCookie("token", token, {
      path: "/",
      secure: false,
      httpOnly: true,
      sameSite: false,
      maxAge: 3600
    });
    return user;
  }

  @post logout(@reply reply, @request req) {
    reply.setCookie("token", req.cookies.token, {
      path: "/",
      secure: false,
      httpOnly: true,
      sameSite: false,
      maxAge: 0
    });
    reply.code(401).send();
  }

  @get
  getUserAuthenticated(@user user, @reply reply): User {
    if (!user) throw new Unauthorized();
    return user;
  }
}
