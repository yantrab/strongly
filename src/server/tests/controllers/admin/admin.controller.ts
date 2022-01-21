import { guard, get, body, post } from "../../../../index";
import { User } from "./user";

export class AdminController {
  @guard((user) => user.role === "admin")
  @get
  async users(): Promise<User[]> {
    return [{ fName: "saba" } as any, { fName: "baba" }];
  }

  @post
  async addUser(@body user: User[]) {}
}
