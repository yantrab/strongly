import { body, post, email, min, onSend } from "strongly";

export class AuthController {
  @onSend((app, request, reply, payload, next) => {
    const token = app.jwt.sign(JSON.parse(payload));
    reply.setCookie("token", token, {
      path: "/",
      secure: false,
      httpOnly: true,
      sameSite: false
    });
    next(null, payload);
  })
  @post
  login(@body("email") @email email: string, @body("password") @min(6) password: string) {
    return { name: "yaniv" };
  }
}
