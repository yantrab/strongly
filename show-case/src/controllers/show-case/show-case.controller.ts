import { body, post } from "strongly";

class Contact {
  address?: string;
  id: number;
}
class UserDetails {
  name: string;
  somePrimitiveArray?: string[];
  contacts: Contact[];
}

export class ShowCaseController {
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
