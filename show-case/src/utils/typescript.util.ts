import { WritableKeys } from "ts-essentials";

export type EntityWithoutGetters<T> = Pick<T, WritableKeys<T>>;
