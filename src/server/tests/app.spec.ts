import { suite, test } from "@testdeck/jest";
import "reflect-metadata";
import { ServerFactory } from "../server";

@suite
class AppTests {
  @test("should get controllers from default path")
  async defaultPath() {
    const res = await (await ServerFactory.create()).inject({ method: "GET", url: "/a/b" });
    expect(res.body).toBe("Hi");
  }

  @test("should get controllers from specific path")
  async specificPath() {
    const res = await (await ServerFactory.create({ controllers: "routes/**" })).inject({ method: "GET", url: "/a/b" });
    expect(res.body).toBe("Hi");
  }
}
