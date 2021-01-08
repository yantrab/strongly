/* tslint:disable */
/* eslint-disable */
import { Contact } from './contact';
export interface UserDetails {
  contacts: Array<Contact>;
  name: string;
  somePrimitiveArray?: Array<string>;
}

export const UserDetailsSchema  = {"type":"object","properties":{"name":{"type":"string","transform":["trim"],"minLength":10},"somePrimitiveArray":{"type":"array","items":{"type":"string","transform":["trim"]}},"contacts":{"type":"array","items":{"$ref":"#/components/schemas/Contact"}}},"required":["name","contacts"]}
