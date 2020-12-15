import { user } from "strongly";

export class AdminController {
  getUsers(@user user) {
    return user;
  }
}
