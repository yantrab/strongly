import { DbService, Repository } from "../db/db.service";
import { User } from "../../domain/user";
import { genSalt, hash, compare } from "bcryptjs";
import NodeCache from "node-cache";

type t0 = ReturnType<UserService["getUsers"]>;
export class UserService {
  userRepo: Repository<User>;
  private cache = new NodeCache({ stdTTL: 60 * 60 * 12 });

  async validateAndGetUser(email: string, password: string): Promise<User | undefined> {
    const userDb = await this.userRepo.collection.findOne({ email });
    if (!userDb?.password) return;
    const user = new User(userDb as User);
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) return;
    delete user.password;
    return user;
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
    await this.userRepo.collection.updateOne({ email: email }, { $set: { password } });
    return true;
  }
}
