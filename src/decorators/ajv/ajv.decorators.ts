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

class MinMaxKeyword {
  readonly min: IMinMaxKeyword;
  readonly max: IMinMaxKeyword;
  readonly date: PropertyDecorator & ParameterDecorator;
  readonly time: PropertyDecorator & ParameterDecorator;
  readonly dateTime: PropertyDecorator & ParameterDecorator;
  readonly duration: PropertyDecorator & ParameterDecorator;
  readonly uri: PropertyDecorator & ParameterDecorator;
  readonly uriReference: PropertyDecorator & ParameterDecorator;
  readonly uriTemplate: PropertyDecorator & ParameterDecorator;
  readonly email: PropertyDecorator & ParameterDecorator;
  readonly hostname: PropertyDecorator & ParameterDecorator;
  readonly ipv4: PropertyDecorator & ParameterDecorator;
  readonly ipv6: PropertyDecorator & ParameterDecorator;
  readonly regex: PropertyDecorator & ParameterDecorator;
  readonly uuid: PropertyDecorator & ParameterDecorator;
  readonly jsonPointer: PropertyDecorator & ParameterDecorator;
  readonly relativeJsonPointer: PropertyDecorator & ParameterDecorator;
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
  }
}

const Routes = new MinMaxKeyword();

export = Routes;
