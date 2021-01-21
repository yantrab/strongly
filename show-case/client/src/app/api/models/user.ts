export interface User {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'admin' | 'user';
}

export const UserSchema = {
  type: 'object',
  properties: {
    phone: { type: 'string' },
    email: { type: 'string', format: 'email' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    role: { type: 'string', enum: ['admin', 'user'] },
    _id: { type: 'string' }
  },
  required: ['phone', 'email', 'firstName', 'lastName', 'role']
};
