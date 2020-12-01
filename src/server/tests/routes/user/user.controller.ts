import { get } from "../../../../decorators/routes/route.decorators";
import { Controller } from "../../../../decorators";

@Controller("a")
export class UserController3 {
  @get("b") getUsers() {
    return "Hi";
  }
}
