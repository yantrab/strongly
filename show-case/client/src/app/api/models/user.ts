/* tslint:disable */
/* eslint-disable */
export interface User {
  email: string;
  fName: string;
  lName: string;
  phone: string;
  role: 'admin' | 'user';
}

export const UserSchema  = {"type":"object","properties":{"phone":{"type":"string","transform":["trim"]},"email":{"type":"string","transform":["trim"]},"fName":{"type":"string","transform":["trim"]},"lName":{"type":"string","transform":["trim"]},"role":{"type":"string","enum":["admin","user"]}},"required":["phone","email","fName","lName","role"]}
