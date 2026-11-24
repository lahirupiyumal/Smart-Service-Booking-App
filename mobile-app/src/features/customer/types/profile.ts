export const avatarColors = ['#2563EB', '#16796B', '#7C3AED', '#C25B26'] as const;
export interface CustomerProfile {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  avatarColor: string;
}
export const emptyProfile: CustomerProfile = {
  fullName: '', email: '', phone: '', city: '', address: '', avatarColor: avatarColors[0],
};
