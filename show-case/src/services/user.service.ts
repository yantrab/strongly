export class UserService {
  async validateAndGetUser(email: string, password: string): Promise<{ fName: string; lName: string; role?: string }> {
    return { fName: "saba", lName: "baba" };
  }

  getUser(id: number) {
    return { fName: "saba", lName: "baba" };
  }
}
