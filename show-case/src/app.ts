import { ServerFactory } from "strongly";
import { post } from "strongly";
import { body, params } from "strongly";

class Contact {
  address?: string;
  id: number;
}
class UserDetails {
  name: string;
  somePrimitiveArray?: string[];
  contacts: Contact[];
}

class ShowCaseController {
  @post getUsers(@body("id") id: number) {
    return id;
  }
  @post getUsers2(@body("id") id?: number) {
    return id;
  }
  @post getUsers3(@body id?: number) {
    return id;
  }
  @post getUsers4(@body user: { id?: number }) {
    return user;
  }
  @post getUsers5(@body user: number[]) {
    return user;
  }
  @post getUsers6(@body user: { id?: number; name: string }) {
    return user;
  }
  /**
   * some description for the method
   */
  @post getUsers7(@body user: UserDetails) {
    return user;
  }
  @post getUsers8(@body user: { id?: number; name: string }[]) {
    return user[0].name;
  }
  @post getUsers9(@body<number>("id", { minimum: 1 }) id?: number) {
    return 5;
  }
  @post getUsers10(@body<Contact>({ properties: { address: { maxLength: 10 } } }) contact: Contact) {
    return 5;
  }
}

ServerFactory.create({
  controllers: [
    ShowCaseController
  ] /*you can pass your controllers,
// or the path to the controller, or nothing if your controllers located on controllers folder **/
}).then(app =>
  app.listen(3000, (err, address) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  })
);
