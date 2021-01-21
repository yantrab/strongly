import { suite, test } from "@testdeck/jest";
import "reflect-metadata";
import { DbService } from "./db.service";
import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Role, User } from "../../domain/user";

@suite
class DbServiceSpec {
  service: DbService;
  async before() {
    const url = await new MongoMemoryServer().getUri();
    const mongoClient = await MongoClient.connect(url, { useNewUrlParser: true });
    this.service = new DbService(mongoClient);
  }
  @test async saveOrUpdateOne() {
    const user = new User({ lastName: "saba", firstName: "yo", email: "a@b.c", phone: "555", role: Role.admin });
    const userRepo = this.service.getRepository<User>(User, "db");
    const savedUser = await userRepo.saveOrUpdateOne(user);
    expect(user).toHaveProperty("_id");
    expect(savedUser).toHaveProperty("_id");
    savedUser.lastName = "baba";
    await userRepo.saveOrUpdateOne(savedUser);
    let result = await userRepo.find({ firstName: "yo", lastName: "saba" });
    expect(result.length).toBe(0);

    result = await userRepo.find({ firstName: "yo", lastName: "baba" });
    expect(result.length).toBe(1);
    savedUser._id = savedUser?._id.toHexString() as any;
    savedUser.lastName = "last";
    await userRepo.saveOrUpdateOne(savedUser);

    result = await userRepo.find({});
    expect(result.length).toBe(1);

    result = await userRepo.find({ firstName: "yo", lastName: "baba" });
    ``;
    expect(result.length).toBe(0);

    const userDb = await userRepo.findOne({ firstName: "yo", lastName: "last" });
    expect(userDb).toBeDefined();
  }
}
