import { onRequest, onResponse, onSend, preHandler, preParsing, preSerialization, preValidation } from "../index";
import { suite, test } from "@testdeck/jest";
import "reflect-metadata";
import { symbols } from "../../utils/consts";

@suite
class HookDecoratorsTests {
  @test
  test() {
    @preValidation((app, request, reply, done) => {})
    class User {
      @onRequest((app, request, reply, done) => {})
      @onRequest((app, request, reply, done) => {})
      getUsers1() {}

      @onResponse((app, request, reply, done) => {})
      @onSend((app, request, reply, done) => {})
      @preHandler((app, request, reply, done) => {})
      @preParsing((app, request, reply, done) => {})
      @preSerialization((app, request, reply, done) => {})
      @preValidation((app, request, reply, done) => {})
      getUsers2() {}
    }
    const routes = Reflect.getMetadata(symbols.route, User.prototype);
    expect(routes.getUsers1.hooks.onRequest.length).toBe(2);
    expect(routes.getUsers1.hooks.preValidation.length).toBe(1);
  }
}
