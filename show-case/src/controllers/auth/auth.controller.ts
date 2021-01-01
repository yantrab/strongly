import { body, post, email, min, get, app, reply, user, request } from "strongly";
import { UserService } from "../../services/user/user.service";
import { User } from "../../domain/user";
import { Unauthorized } from "http-errors";
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

const a = {
  swagger: "2.0",
  info: { title: "show-case", version: "1.0.0", description: "some examples of using Strongly framework." },
  paths: {
    "/auth/login": {
      post: {
        parameters: [
          {
            name: "body",
            in: "body",
            required: true,
            schema: {
              properties: {
                password: { type: "string", notEmptyString: true, minLength: 6 },
                email: { format: "email", type: "string", notEmptyString: true }
              },
              type: "object",
              required: ["password", "email"]
            }
          }
        ],
        tags: ["auth"],
        responses: { "201": { schema: { $ref: "#/definitions/User" } } }
      }
    },
    "/auth/logout": { post: { parameters: [], tags: ["auth"] } },
    "/auth/get-user-authenticated": {
      get: { parameters: [], tags: ["auth"], responses: { "201": { schema: { $ref: "#/definitions/User" } } } }
    }
  },
  definitions: {
    User: {
      type: "object",
      properties: {
        phone: { type: "string", notEmptyString: true },
        email: { type: "string", notEmptyString: true },
        fName: { type: "string", notEmptyString: true },
        lName: { type: "string", notEmptyString: true },
        role: { type: "string", enum: ["admin", "user"] },
        _id: { type: "string", notEmptyString: true }
      },
      required: ["phone", "email", "fName", "lName", "role"]
    }
  }
};
