import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { db } from '@/config/firebase';

import {
  avatarColors,
  emptyProfile,
  type CustomerProfile,
} from '../types/profile';

export async function loadCustomerProfile(
  userId?: string
): Promise<CustomerProfile> {
  if (!userId) {
    throw new Error('User is not authenticated.');
  }

  if (!db) {
    throw new Error('Firestore is not configured.');
  }

  const profileRef = doc(db, 'users', userId);
  const snapshot = await getDoc(profileRef);

  if (!snapshot.exists()) {
    throw new Error('User profile does not exist in Firestore.');
  }

  const data = snapshot.data();

  if (data.uid !== userId) {
    throw new Error('Invalid user profile.');
  }

  const profile: CustomerProfile = {
    ...emptyProfile,
    fullName: typeof data.fullName === 'string' ? data.fullName : '',
    email: typeof data.email === 'string' ? data.email : '',
    phone: typeof data.phone === 'string' ? data.phone : '',
    city: typeof data.city === 'string' ? data.city : '',
    address: typeof data.address === 'string' ? data.address : '',
    avatarColor: avatarColors.includes(data.avatarColor)
      ? data.avatarColor
      : emptyProfile.avatarColor,
  };

  return profile;
}

export async function saveCustomerProfile(
  profile: CustomerProfile,
  userId?: string
): Promise<void> {
  if (!userId) {
    throw new Error('User is not authenticated.');
  }

  if (!db) {
    throw new Error('Firestore is not configured.');
  }

  const profileRef = doc(db, 'users', userId);

  // Update only editable profile fields.
  // Email, UID and account role remain unchanged.
  await updateDoc(profileRef, {
    fullName: profile.fullName.trim(),
    phone: profile.phone.trim(),
    city: profile.city.trim(),
    address: profile.address.trim(),
    avatarColor: profile.avatarColor,
  });
}
