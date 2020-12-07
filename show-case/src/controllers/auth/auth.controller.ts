import { body, post, email, min } from "strongly";
export class AuthController {
  @post login(@body("email") @email email: string, @body("password") @min(6) password: string) {}
}
