export interface User {
  _id?: string;
  email: string;
  fName: string;
  lName: string;
  phone: string;
  role: 'admin' | 'user';
}

export const UserSchema = {
  type: 'object',
  properties: {
    phone: { type: 'string' },
    email: { type: 'string' },
    fName: { type: 'string' },
    lName: { type: 'string' },
    role: { type: 'string', enum: ['admin', 'user'] },
    _id: { type: 'string' }
  },
  required: ['phone', 'email', 'fName', 'lName', 'role']
};
