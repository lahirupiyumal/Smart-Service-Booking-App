import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'customer' | 'provider' | 'admin';
export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Timestamp | null;
}
