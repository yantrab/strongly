/* tslint:disable */
/* eslint-disable */
export interface Contact {
  address?: string;
  id: number;
}

export const ContactSchema  = {"type":"object","properties":{"address":{"type":"string","transform":["trim"]},"id":{"type":"number"}},"required":["id"]}
