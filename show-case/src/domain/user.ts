import { email } from "strongly";
import { Entity } from "./entity";
import { EntityWithoutGetters } from "../utils/typescript.util";
import { WritableKeys } from "ts-essentials";

export enum Role {
  admin = "admin",
  user = "user"
}

export class User extends Entity<User> {
  constructor(props: EntityWithoutGetters<User>) {
    super(props);
    delete this["password"];
  }

  phone: string;
  @email email: string;
  firstName: string;
  lastName: string;
  role: Role;
}
