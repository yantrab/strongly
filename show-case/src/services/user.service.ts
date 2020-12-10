export class UserService {
  async validateAndGetUser(email: string, password: string) {
    return { fName: "saba", lName: "baba" };
  }

  getUser(id: number) {
    return { fName: "saba", lName: "baba" };
  }
}
