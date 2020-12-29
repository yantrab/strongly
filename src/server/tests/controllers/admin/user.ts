export enum Role {
  admin = "admin",
  user = "user"
}

export class User {
  phone: string;
  email: string;
  fName: string;
  lName: string;
  role: Role;
}
