function getMinmaxDecorator(keyword) {
  // const ajvMap = {
  //   number: "imum",
  //   string: "Length",
  //   array: "Items",
  //   object: "Properties",
  // };
  const decorator = value => {
    return function(target: () => any, key: string) {
      // const schema = Reflect.getMetadata(symbols.validations, target) || {};
      // const t = Reflect.getMetadata("design:type", target, key);
      // set(schema, key + "." + keyword + ajvMap[t.name.toLowerCase()], value);
      // Reflect.defineMetadata(symbols.validations, schema, target);
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
  constructor() {
    ["min", "max"].forEach(keyword => {
      this[keyword] = getMinmaxDecorator(keyword);
    });
  }
}

const Routes = new MinMaxKeyword();

export = Routes;
