import { JSONSchemaType as _JSONSchemaType } from "ajv";

export const toSnack = key => key.replace(/([A-Z])/g, $1 => "-" + $1.toLowerCase()).replace(/^-/, "");

type NestedPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer R> ? Array<NestedPartial<R>> : T[K] extends unknown ? unknown : NestedPartial<T[K]>;
};

export declare type JSONSchemaType<T> = NestedPartial<_JSONSchemaType<T>>;

export declare type ValueProvider = { provide: any; useValue: any };
export declare type Provider = { new (...args) } | ValueProvider;

export declare type Schema = {
  optional?: boolean;
  type?: string;
  items?: any;
  properties?: any;
  required?: string[];
  allOf?: any[];
  enum?: string[];
};
