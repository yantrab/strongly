import { guard, get, body, request, post } from "strongly";
import { UserService } from "../../services/user/user.service";
import { MailerService } from "../../services/mailer/mailer.service";
import { User } from "../../domain/user";
import { randomBytes } from "crypto";

@guard(user => user.role === "admin")
export class AdminController {
  constructor(private userService: UserService, private mailer: MailerService) {}
  @get users() {
    return this.userService.getUsers();
  }

  private async addUser(user: User) {
    const existUser = await this.userService.userRepo.findOne({ email: user.email });
    if (existUser) throw new Error("The user already exist");
    const result = await this.userService.saveOrUpdateUser(new User(user));
    const token = (await randomBytes(48)).toString();
    this.userService.saveUserToken(user.email, token);
    this.mailer.sendPermission(user.email, token);
    return result;
  }

  @post saveOrUpdateUser(@body user: User): Promise<User> {
    user = new User(user);
    if (user.isNew) {
      return this.addUser(user);
    }

    return this.userService.saveOrUpdateUser(user);
  }
}
