import { suite, test } from "@testdeck/jest";
import { DIService } from "./di.service";
import "reflect-metadata";
export class someService {}

export class someService2 {
  constructor(private c: someService3) {}
}
export class someService3 {}

export class someController5 {
  constructor(private a: someService, private b: someService2) {}
}
@suite
class diTests {
  @test
  async di() {
    const diService = new DIService();

    const d = await diService.getDependencies(someController5);
    expect(Object.values(d).length).toBe(2);
  }
}
