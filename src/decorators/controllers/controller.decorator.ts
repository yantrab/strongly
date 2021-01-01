import { symbols } from "../../utils/consts";

export declare type ControllerOptions = { description?: string };

export function Controller(path?: string, options?: ControllerOptions): <T>(target: T) => T;
export function Controller<T>(target: T): T;
export function Controller<T>(value: string | T, options?: ControllerOptions): T | ((target: T) => T) {
  if (typeof value === "string") {
    return (target: T): T => {
      Reflect.defineMetadata(symbols.basePath, value, target);
      Reflect.defineMetadata(symbols.controller, options, target);
      return target;
    };
  }
  return value;
}
