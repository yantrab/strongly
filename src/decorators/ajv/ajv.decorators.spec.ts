import { suite, test } from "@testdeck/jest";
import { min, max, date } from "./ajv.decorators";
import "reflect-metadata";
import { getClass, getDefinitions, getParamSchema } from "../../utils/typescript-service";

export interface SomeInterface {
  filter?: {
    someArray: number[];
  };
}
const a = 4;
export class c123 {
  someInterface?: SomeInterface;

  @date
  date: string;

  @min(a)
  number1: number;

  @min(4)
  @max(8)
  number2: number;

  @max(8)
  number3: number;

  @min(4)
  string1: string;

  @min(4)
  @max(8)
  string2: string;

  @max(8)
  string3: string;

  @min(4)
  array1: string[];

  @min(4)
  @max(8)
  array2: string[];

  @max(8)
  array3: string[];

  @min(4)
  object1: { a: number };

  @min(4)
  @max(8)
  object2: { a: number };

  @max(8)
  object3: { a: number };
}

@suite
class ajvDecoratorsTests {
  @test
  minmax() {
    const schema = getParamSchema(getClass(c123.name).getType());
    expect(schema).toStrictEqual({ optional: false, $ref: "#/definitions/c123" });
    const definitions: any = getDefinitions();
    expect(definitions.c123.properties).toStrictEqual({
      someInterface: {
        $ref: "#/definitions/SomeInterface"
      },
      date: {
        format: "date",
        allOf: [{ transform: ["trim"] }, { minLength: 1 }],
        type: "string"
      },
      array1: {
        items: {
          allOf: [{ transform: ["trim"] }, { minLength: 1 }],
          type: "string"
        },
        minItems: 4,
        type: "array"
      },
      array2: {
        items: {
          allOf: [{ transform: ["trim"] }, { minLength: 1 }],
          type: "string"
        },
        maxItems: 8,
        minItems: 4,
        type: "array"
      },
      array3: {
        items: {
          allOf: [{ transform: ["trim"] }, { minLength: 1 }],
          type: "string"
        },
        maxItems: 8,
        type: "array"
      },
      number1: {
        minimum: 4,
        type: "number"
      },
      number2: {
        maximum: 8,
        minimum: 4,
        type: "number"
      },
      number3: {
        maximum: 8,
        type: "number"
      },
      object1: {
        minProperties: 4,
        properties: {
          a: {
            type: "number"
          }
        },
        required: ["a"],
        type: "object"
      },
      object2: {
        maxProperties: 8,
        minProperties: 4,
        properties: {
          a: {
            type: "number"
          }
        },
        required: ["a"],
        type: "object"
      },
      object3: {
        maxProperties: 8,
        properties: {
          a: {
            type: "number"
          }
        },
        required: ["a"],
        type: "object"
      },
      string1: {
        minLength: 4,
        allOf: [{ transform: ["trim"] }, { minLength: 1 }],
        type: "string"
      },
      string2: {
        maxLength: 8,
        minLength: 4,
        allOf: [{ transform: ["trim"] }, { minLength: 1 }],
        type: "string"
      },
      string3: {
        maxLength: 8,
        allOf: [{ transform: ["trim"] }, { minLength: 1 }],
        type: "string"
      }
    });
  }
}
