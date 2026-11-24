export type UserRole = 'customer' | 'provider' | 'admin';
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
}
