// TODO change after fastify migration
// import { JSONSchemaType as _JSONSchemaType } from "ajv";
// export declare type JSONSchemaType<T> = NestedPartial<_JSONSchemaType<T>>;
export declare type JSONSchemaType<T> = any;

export const toSnack = key => key.replace(/([A-Z])/g, $1 => "-" + $1.toLowerCase()).replace(/^-/, "");

type NestedPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer R> ? Array<NestedPartial<R>> : T[K] extends unknown ? unknown : NestedPartial<T[K]>;
};

export declare type ValueProvider = { provide: any; useValue: any };
export declare type Provider = { new (...args) } | ValueProvider;

export declare type Schema = {
  oneOf?: Schema[];
  optional?: boolean;
  type?: string;
  items?: any;
  properties?: any;
  required?: string[];
  allOf?: any[];
  enum?: any[];
  transform?: string[];
};
