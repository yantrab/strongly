import { suite, test } from "@testdeck/jest";
import { FastifyInstance } from "fastify";
import { ServerFactory } from "../../../server";
import { AdminController } from "./admin.controller";

@suite
class LoginTests {
  app: FastifyInstance;

  async before() {
    this.app = await ServerFactory.create({ controllers: [AdminController] });
  }
  @test
  async schemaRef() {
    const schema = (await this.app.inject().get("api-doc/json")).json();
    console.log(schema)
  }
}
