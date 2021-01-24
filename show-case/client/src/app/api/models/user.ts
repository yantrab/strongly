export interface User {
  '_id'?: string;
  '_isDeleted'?: boolean;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'admin' | 'user';
}

export const UserSchema  = {"type":"object","properties":{"phone":{"type":"string"},"email":{"type":"string","format":"email"},"firstName":{"type":"string"},"lastName":{"type":"string"},"role":{"type":"string","enum":["admin","user"]},"_id":{"type":"string"},"_isDeleted":{"type":"boolean"}},"required":["phone","email","firstName","lastName","role"]}
