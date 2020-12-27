declare type res = { fName: "saba"; lName: "baba" };

export class UserService {
  async validateAndGetUser(email: string, password: string) {
    return { fName: "saba", lName: "baba" };
  }
}
