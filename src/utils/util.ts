import { JSONSchemaType as _JSONSchemaType } from "ajv";

export const toSnack = key => key.replace(/([A-Z])/g, $1 => "-" + $1.toLowerCase()).replace(/^-/, "");

type NestedPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer R> ? Array<NestedPartial<R>> : T[K] extends unknown ? unknown : NestedPartial<T[K]>;
};

export declare type JSONSchemaType<T> = NestedPartial<_JSONSchemaType<T>>;
