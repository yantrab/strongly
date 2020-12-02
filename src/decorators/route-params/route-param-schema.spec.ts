import { post } from "../routes/route.decorators";
import { body, params, reply, request } from "..";
import { suite, test } from "@testdeck/jest";
import { symbols } from "../../utils/consts";
import "reflect-metadata";

class Contact {
  address?: string;
  id: number;
}
class UserDetails {
  name: string;
  somePrimitiveArray?: string[];
  contacts: Contact[];
}

class SomeController {
  @post getUsers(@body("id") id: number) {}
  @post getUsers2(@body("id") id?: number) {}
  @post getUsers3(@body id?: number) {}
  @post getUsers4(@body user: { id?: number }) {}
  @post getUsers5(@body user: number[]) {}
  @post getUsers6(@body user: { id?: number; name: string }) {}
  @post getUsers7(@body user: UserDetails) {}
  @post getUsers8(@body user: { id?: number; name: string }[]) {}
  @post getUsers9(@params<number>("id", { minimum: 5 }) id?: number) {}
  @post getUsers10(@body<Contact>({ properties: { address: { maxLength: 10 } } }) contact: Contact) {
    return 5;
  }
}

@suite
class RouteSchemaTests {
  routes = Reflect.getMetadata(symbols.route, SomeController.prototype);

  @test
  primitiveTypeNumber() {
    expect(this.routes["getUsers"].schema.request).toStrictEqual({
      body: {
        properties: {
          id: {
            type: "number"
          }
        },
        required: ["id"],
        type: "object"
      }
    });
  }

  @test
  primitiveOptionalTypeNumber() {
    expect(this.routes["getUsers2"].schema.request).toStrictEqual({
      body: {
        properties: {
          id: {
            type: "number"
          }
        },
        type: "object"
      }
    });
  }

  @test
  primitiveBody() {
    expect(this.routes["getUsers3"].schema.request).toStrictEqual({
      body: {
        type: "number"
      }
    });
  }

  @test
  objectBody() {
    expect(this.routes["getUsers4"].schema.request).toStrictEqual({
      body: {
        properties: {
          id: {
            type: "number"
          }
        },
        type: "object"
      }
    });
  }

  @test
  arrayOfNumber() {
    expect(this.routes["getUsers5"].schema.request).toStrictEqual({
      body: {
        items: {
          type: "number"
        },
        type: "array"
      }
    });
  }

  @test
  object() {
    expect(this.routes["getUsers6"].schema.request).toStrictEqual({
      body: {
        properties: {
          id: {
            type: "number"
          },
          name: {
            type: "string"
          }
        },
        required: ["name"],
        type: "object"
      }
    });
  }

  @test
  classInBody() {
    expect(this.routes["getUsers7"].schema.request).toStrictEqual({
      body: {
        properties: {
          contacts: {
            items: {
              properties: {
                address: {
                  type: "string"
                },
                id: {
                  type: "number"
                }
              },
              required: ["id"],
              type: "object"
            },
            type: "array"
          },
          name: {
            type: "string"
          },
          somePrimitiveArray: {
            items: {
              type: "string"
            },
            type: "array"
          }
        },
        required: ["name", "contacts"],
        type: "object"
      }
    });
  }

  @test
  arrayOfObject() {
    expect(this.routes["getUsers8"].schema.request).toStrictEqual({
      body: {
        items: {
          properties: {
            id: {
              type: "number"
            },
            name: {
              type: "string"
            }
          },
          required: ["name"],
          type: "object"
        },
        type: "array"
      }
    });
  }

  @test
  schemaWithNumberValidation() {
    expect(this.routes["getUsers9"].schema.request).toStrictEqual({
      params: {
        properties: {
          id: {
            minimum: 5,
            type: "number"
          }
        },
        type: "object"
      }
    });
  }

  @test
  schemaWithNestedNumberValidation() {
    expect(this.routes["getUsers10"].schema.request).toStrictEqual({
      body: {
        properties: {
          address: {
            maxLength: 10,
            type: "string"
          },
          id: {
            type: "number"
          }
        },
        required: ["id"],
        type: "object"
      }
    });
  }
}
