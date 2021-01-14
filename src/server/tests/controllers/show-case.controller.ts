import { body, post, get, params, min, email, uuid, query } from "../../../index";
import { GetDataArgsI } from "./interface";

class Contact {
  address?: string;
  id: number;
}
class UserDetails {
  @min(10)
  name: string;
  somePrimitiveArray?: string[];
  contacts: Contact[];
}

export class ShowCaseController {
  /**
   * id is required in the param and should by number
   */
  @get("getUser/:id") getUser(@params params: { id: number }) {
    return { name: "saba" };
  }

  /**
   * this is the same as previous one, with convenient way
   */
  @get("getUsers2/:id") getUsers2(@params("id") id: number) {
    return { name: "saba" };
  }

  /**
   * you can add validation as you want
   */
  @post login(@body("email") @email email: string, @body("password") @min(6) password: string) {
    return { name: "saba" };
  }

  /**
   * you can add validation on the class,  name should be ta least 10 letters
   */
  @post saveUser(@body user: UserDetails) {
    return user;
  }

  /**
   *  or send your schema validation
   */
  @post saveContact(@body<Contact>({ properties: { address: { maxLength: 10 } } }) contact: { address?: string; id: number }) {
    return contact;
  }

  @get async getData(
    @query({
      example: {
        filter: {
          categoryIds: [1112]
        },
        exclude: {
          categoryIds: [0]
        },
        page: {
          limit: 0,
          offset: 0
        },
        configurationType: "string",
        timestamp: 0,
        uuid: "string",
        count: 0
      }
    })
    query: GetDataArgsI
  ) {
    return Promise.resolve({});
  }
}
