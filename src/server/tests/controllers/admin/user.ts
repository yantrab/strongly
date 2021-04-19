export enum Role {
  admin,
  user
}

export class User {
  phone: string;
  email: string;
  fName: string;
  lName: string;
  role: Role;
}
