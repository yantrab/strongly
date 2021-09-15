import { symbols } from "../../utils/consts";
import set = Reflect.set;
import { toSnack } from "../../utils/util";
import { merge } from "lodash";
import { getMinMaxValidation } from "../../utils/ajv.service";
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
const ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
  const fnStr = func.toString().replace(STRIP_COMMENTS, "");
  let result = fnStr.slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")")).match(ARGUMENT_NAMES);
  if (result === null) {
    result = [];
  }
  return result;
}
function getMinmaxDecorator(keyword) {
  const decorator = value => {
    return function(target: () => any, key: string) {
      const schema = Reflect.getMetadata(symbols.validations, target) || {};
      const t = Reflect.getMetadata("design:type", target, key);
      schema[key] = Object.assign(schema[key] || {}, getMinMaxValidation(keyword, t.name, value));
      Reflect.defineMetadata(symbols.validations, schema, target);
    };
  };
  return decorator;
}

interface IMinMaxKeyword {
  (count: number): any;
}

interface IPatternKeyword {
  (pattern: RegExp | string): any;
}

class DecoratorKeyword {
  readonly min: IMinMaxKeyword;
  readonly max: IMinMaxKeyword;
  readonly pattern: IPatternKeyword;
  readonly numberString;
  readonly date;
  readonly time;
  readonly dateTime;
  readonly duration;
  readonly uri;
  readonly uriReference;
  readonly uriTemplate;
  readonly email;
  readonly hostname;
  readonly ipv4;
  readonly ipv6;
  readonly uuid;
  readonly jsonPointer;
  readonly relativeJsonPointer;
  constructor() {
    ["min", "max"].forEach(keyword => {
      this[keyword] = getMinmaxDecorator(keyword);
    });

    [
      "time",
      "date",
      "dateTime",
      "duration",
      "uri",
      "uriReference",
      "uriTemplate",
      "email",
      "hostname",
      "ipv4",
      "ipv6",
      "uuid",
      "jsonPointer",
      "relativeJsonPointer"
    ].forEach(keyword => {
      this[keyword] = (target: () => any, methodName: string, paramIndex: number) => {
        const allRoutes = Reflect.getMetadata(symbols.route, target) || {};
        const route = (allRoutes[methodName] = allRoutes[methodName] || { params: [] });
        route.params[paramIndex] = { schema: { format: toSnack(keyword) } };
        Reflect.defineMetadata(symbols.route, allRoutes, target);
      };
    });
    this.pattern = (value: any) => {
      return function(target: () => any, key: string) {
        const schema = Reflect.getMetadata(symbols.validations, target) || {};
        schema[key] = Object.assign(schema[key] || {}, { pattern: value.source || value });
        Reflect.defineMetadata(symbols.validations, schema, target);
      };
    };
    this.numberString = (target: () => any, key: string) => {
      const schema = Reflect.getMetadata(symbols.validations, target) || {};
      schema[key] = Object.assign(schema[key] || {}, { pattern: "^[0-9]*$" });
      Reflect.defineMetadata(symbols.validations, schema, target);
    };
  }
}

const Routes = new DecoratorKeyword();

export = Routes;
