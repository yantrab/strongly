import { get } from "../../../../decorators/routes/route.decorators";
import { Controller } from "../../../../decorators";
import { UserService } from "../../services/user.service";

@Controller("a")
export class UserController2 {
  constructor(private userService: UserService) {}
  @get("b") getUsers() {
    return this.userService.hi();
  }
}
