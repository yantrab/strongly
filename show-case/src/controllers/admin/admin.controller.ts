import { guard, get } from "strongly";
import { UserService } from "../../services/user/user.service";

@guard(user => user.role === "admin")
export class AdminController {
  // constructor(private userService: UserService, private mailer: MailerService) {
  //   this.userService.userRepo.collection.countDocuments().then(async usersCount => {
  //     if (usersCount) {
  //       return;
  //     }
  //     const user = new User({
  //       email: "admin@admin.com",
  //       phone: "0555555",
  //       fName: "Admin",
  //       lName: "",
  //       roles: [{ app: App.admin, permission: Permission.user }]
  //     });
  //     user.password = await cryptPassword("123456");
  //     this.addUser(user).then();
  //   });
  // }
  @get users() {
    return [{ fName: "saba" }, { fName: "baba" }];
  }
}
