import { Entity } from "./entity";

export enum Role {
  admin = "admin",
  user = "user"
}

export class User extends Entity<User> {
  constructor(props) {
    super(props);
    delete this["password"];
  }

  phone: string;
  email: string;
  fName: string;
  lName: string;
  role: Role;
}
