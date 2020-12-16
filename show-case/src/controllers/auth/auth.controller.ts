import { body, post, email, min, get, app, reply, user } from "strongly";
import { UserService } from "../../services/user.service";

export class AuthController {
  constructor(private userService: UserService) {}

  @post async login(@body("email") @email email: string, @body("password") @min(6) password: string, @app app, @reply reply) {
    const user = await this.userService.validateAndGetUser(email, password);
    if (!user) {
      reply.code(401).send();
      return;
    }
    const token = app.jwt.sign(user);
    reply.setCookie("token", token, {
      path: "/",
      secure: false,
      httpOnly: true,
      sameSite: false
    });
    return user;
  }

  @get
  getUserAuthenticated(@user user, @reply reply) {
    if (!user) {
      reply.code(401).send();
      return;
    }
    return user;
  }
}
