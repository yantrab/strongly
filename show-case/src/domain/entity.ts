import { EntityWithoutGetters } from "../utils/typescript.util";

export abstract class Entity<T> {
  constructor(data?: EntityWithoutGetters<T>) {
    if (data) {
      Object.assign(this, data);
    }
  }
  _id?: string;
  get isNew() {
    return !this._id;
  }
}
