import { Entity } from "./entity";

export enum Role {
  admin,
  user
}

export class User extends Entity<User> {
  password?: string;
  phone: string;
  email: string;
  fName: string;
  lName: string;
  get fullName() {
    return this.fName + " " + this.lName;
  }
}
