import { suite, test } from "@testdeck/jest";
import "reflect-metadata";
import { ServerFactory, get, guard } from "../../index";

@guard((user) => user.role === "editor")
class a {
  @guard((user) => user.isAdmin)
  @get
  b() {
    return 1;
  }

  @get c() {
    return 2;
  }
}

@suite
class GuardDecoratorSpec {
  @test("should return unauthorized")
  async test1() {
    const res = await (await ServerFactory.create({ controllers: [a] })).inject({ method: "GET", url: "/a/c" });
    expect(res.statusCode).toBe(401);
  }

  @test("should return forbidden class guard")
  async test2() {
    const app = await ServerFactory.create({ controllers: [a] });
    app.addHook("preHandler", (request, reply, done) => {
      (request as any).user = { role: "viewer" };
      done();
    });
    const res = await app.inject({ method: "GET", url: "/a/c" });
    expect(res.statusCode).toBe(403);
  }

  @test("should return result class guard")
  async test3() {
    const app = await ServerFactory.create({ controllers: [a] });
    app.addHook("preHandler", (request, reply, done) => {
      (request as any).user = { role: "editor" };
      done();
    });
    const res = await app.inject({ method: "GET", url: "/a/c" });
    expect(res.body).toBe("2");
  }

  @test("should return forbidden method guard")
  async test4() {
    const app = await ServerFactory.create({ controllers: [a] });
    app.addHook("preHandler", (request, reply, done) => {
      (request as any).user = { role: "editor" };
      done();
    });
    const res = await app.inject({ method: "GET", url: "/a/b" });
    expect(res.statusCode).toBe(403);
  }

  @test("should return result method guard")
  async test5() {
    const app = await ServerFactory.create({ controllers: [a] });
    app.addHook("preHandler", (request, reply, done) => {
      (request as any).user = { role: "editor", isAdmin: true };
      done();
    });
    const res = await app.inject({ method: "GET", url: "/a/b" });
    expect(res.body).toBe("1");
  }
}
