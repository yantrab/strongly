import { symbols } from "../../utils/consts";

export function Controller(path?: string, options?: any): <T>(target: T) => T;
export function Controller<T>(target: T): T;
export function Controller<T>(value: string | T): T | ((target: T) => T) {
  if (typeof value === "string") {
    return (target: T): T => {
      Reflect.defineMetadata(symbols.basePath, value, target);
      return target;
    };
  }
  return value;
}
