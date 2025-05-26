// src/types/userTypes.ts
export interface User {
  id: string | number;
  name: string;
  email?: string;
  role: 'admin' | 'cashier' | 'kitchen' | 'display';
  // Add any other user properties you need
  [key: string]: any; // This allows for additional properties if needed
}