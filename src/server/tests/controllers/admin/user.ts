import { pattern } from "../../../..";

export enum Role {
  admin,
  user
}

export class User {
  @pattern("[1-9]") phone: string;
  email: string;
  fName: string;
  lName: string;
  role: Role;
}
