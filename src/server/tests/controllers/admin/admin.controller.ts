import { guard, get } from "../../../../index";

export class AdminController {
  @guard(user => user.role === "admin")
  @get
  users() {
    return [{ fName: "saba" }, { fName: "baba" }];
  }
}
