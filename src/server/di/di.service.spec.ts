import { suite, test } from "@testdeck/jest";
import { DIService } from "./di.service";
import "reflect-metadata";
import { ServerFactory } from "../server";
let counter = 0;
export class someService {
  constructor() {
    counter++;
  }
  someFunction() {}
}

export class someService2 {
  constructor(private c: someService3) {}
}
export class someService3 {}

export class someController5 {
  constructor(private a: someService, private b: someService2) {}
}

export class someController6 {
  constructor(private a: someService) {}
}
@suite
class diTests {
  @test("should create only one someService service") async di2() {
    await ServerFactory.create({ controllers: [someController5, someController6] });
    expect(counter).toEqual(1);
  }

  @test
  async di() {
    const diService = new DIService();

    const d = await diService.getDependencies(someController5);
    expect(Object.values(d).length).toBe(2);
  }
}
