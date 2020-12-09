import { body, post, email, min, onSend, app, reply } from "strongly";
import { UserService } from "../../services/user.service";

export class AuthController {
  constructor(private userService: UserService) {}

  @post login(@body("email") @email email: string, @body("password") @min(6) password: string, @app app, @reply reply) {
    const user = this.userService.validateAndGetUser(email, password);
    const token = app.jwt.sign(user);
    reply.setCookie("token", token, {
      path: "/",
      secure: false,
      httpOnly: true,
      sameSite: false
    });
    return user;
  }

  user(id: number) {
    return { name: "asd" };
  }
}
