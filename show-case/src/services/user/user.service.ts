import { DbService, Repository } from "../db/db.service";
import { Role, User } from "../../domain/user";
import { compare, genSalt, hash } from "bcryptjs";
import NodeCache from "node-cache";
const cryptPassword = async password => {
  const salt = await genSalt(10);
  return hash(password, salt);
};

export class UserService {
  userRepo: Repository<User>;
  private cache = new NodeCache({ stdTTL: 60 * 60 * 12 });
  constructor(private dbService: DbService) {
    this.userRepo = this.dbService.getRepository(User, "users");

    this.userRepo.collection.countDocuments().then(async usersCount => {
      if (usersCount) {
        return;
      }
      const user = new User({
        email: "admin@admin.com",
        phone: "0555555",
        fName: "Admin",
        lName: "",
        role: Role.admin
      });
      user["password"] = await cryptPassword("123456");
      await this.saveUser(user);
    });
  }

  async validateAndGetUser(email: string, password: string): Promise<User | undefined> {
    const userDb: User & { password: string } = (await this.userRepo.collection.findOne({ email })) as any;
    if (!userDb?.password || !(await compare(password, userDb.password))) return;
    return new User(userDb as User);
  }

  saveUser(user: User) {
    return this.userRepo.saveOrUpdateOne(user);
  }
  getUsers(query?: Partial<User>) {
    return this.userRepo.collection
      .find<User>(query || {})
      .project({ password: 0 })
      .toArray();
  }

  saveUserToken(email: string, token: string) {
    this.cache.set(email, token);
  }

  async changePassword(email: string, token: string, password: string): Promise<boolean> {
    const cacheToken = this.cache.get(email);
    if (!cacheToken || cacheToken !== token) return false;
    const salt = await genSalt(10);
    const hashPassword = hash(password, salt);
    await this.userRepo.collection.updateOne({ email: email }, { $set: { password: hashPassword } });
    return true;
  }
}
