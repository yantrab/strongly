import { body, post, email, min, onSend, app, reply } from "../../../../index";
import { UserService } from "../../services/user.service";

export class AuthController {
  constructor(private userService: UserService) {}

  @post login(@body("email") @email email: string, @body("password") @min(6) password: string) {
    return this.userService.validateAndGetUser(email, password);
  }
}
