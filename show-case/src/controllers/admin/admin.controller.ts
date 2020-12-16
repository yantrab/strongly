import { guard, get } from "strongly";

export class AdminController {
  @guard(user => user.role === "admin")
  @get
  users() {
    return [{ fName: "saba" }, { fName: "baba" }];
  }
}
