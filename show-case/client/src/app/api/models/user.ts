/* tslint:disable */
/* eslint-disable */
export interface User {
  '_id'?: any & any;
  email: any & any;
  fName: any & any;
  lName: any & any;
  phone: any & any;
  role: 'admin' | 'user';
}

export const UserSchema  = {"type":"object","properties":{"phone":{"type":"string","allOf":[{"transform":["trim"]},{"minLength":1}]},"email":{"type":"string","allOf":[{"transform":["trim"]},{"minLength":1}]},"fName":{"type":"string","allOf":[{"transform":["trim"]},{"minLength":1}]},"lName":{"type":"string","allOf":[{"transform":["trim"]},{"minLength":1}]},"role":{"type":"string","enum":["admin","user"]},"_id":{"type":"string","allOf":[{"transform":["trim"]},{"minLength":1}]}},"required":["phone","email","fName","lName","role"]}
