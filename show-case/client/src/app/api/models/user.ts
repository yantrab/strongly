/* tslint:disable */
/* eslint-disable */
export interface User {
  '_id'?: string;
  email: string;
  fName: string;
  lName: string;
  phone: string;
  role: 'admin' | 'user';
}

export const UserSchema  = {"type":"object","properties":{"phone":{"type":"string","notEmptyString":true},"email":{"type":"string","notEmptyString":true},"fName":{"type":"string","notEmptyString":true},"lName":{"type":"string","notEmptyString":true},"role":{"type":"string","enum":["admin","user"]},"_id":{"type":"string","notEmptyString":true}},"required":["phone","email","fName","lName","role"]}
