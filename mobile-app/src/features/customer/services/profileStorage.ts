import AsyncStorage from '@react-native-async-storage/async-storage';
import { avatarColors, emptyProfile, type CustomerProfile } from '../types/profile';

const keyFor = (userId?: string) => `smartserve.customer-profile.v1:${userId ?? 'guest'}`;

export async function loadCustomerProfile(userId?: string): Promise<CustomerProfile> {
  const stored = await AsyncStorage.getItem(keyFor(userId));
  if (!stored) return { ...emptyProfile };
  const data: unknown = JSON.parse(stored);
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid saved profile');
  const fields = data as Record<string, unknown>;
  const profile = { ...emptyProfile };
  for (const key of ['fullName', 'email', 'phone', 'city', 'address'] as const) {
    if (typeof fields[key] !== 'string') throw new Error('Invalid saved profile');
    profile[key] = fields[key];
  }
  if (avatarColors.some(color => color === fields.avatarColor)) profile.avatarColor = fields.avatarColor as string;
  return profile;
}

export async function saveCustomerProfile(profile: CustomerProfile, userId?: string) {
  await AsyncStorage.setItem(keyFor(userId), JSON.stringify(profile));
}
