import { guard, get, body, post } from "../../../../index";
import { User } from "./user";

export class AdminController {
  @guard(user => user.role === "admin")
  @get
  users() {
    return [{ fName: "saba" }, { fName: "baba" }];
  }

  @post
  async addUser(@body user: User) {}
}
