import { EntityWithoutGetters } from "../utils/typescript.util";

export abstract class Entity<T> {
  protected constructor(data?) {
    if (data) {
      Object.assign(this, data);
    }
  }
  _id?: string;
  get isNew() {
    return !this._id;
  }
}
