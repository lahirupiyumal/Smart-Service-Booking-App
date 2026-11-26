import {
  createUserWithEmailAndPassword, deleteUser, sendPasswordResetEmail,
  signInWithEmailAndPassword, signOut, updateProfile,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { normalizeRegistration, validateRegistration, type RegistrationInput } from '../utils/validation';

function requireAuth() {
  if (!auth) throw Object.assign(new Error('Firebase is not configured.'), { code: 'app/not-configured' });
  return auth;
}

export async function registerAccount(input: RegistrationInput) {
  const firebaseAuth = requireAuth();
  if (!db) throw Object.assign(new Error('Firestore is not configured.'), { code: 'app/not-configured' });
  if (Object.keys(validateRegistration(input)).length) {
    throw Object.assign(new Error('Please check your registration details.'), { code: 'app/invalid-registration' });
  }
  const values = normalizeRegistration(input);
  const { user } = await createUserWithEmailAndPassword(firebaseAuth, values.email, input.password);
  try {
    await updateProfile(user, { displayName: values.fullName });
    // Explicit fields prevent passwords or client-selected roles entering Firestore.
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid, fullName: values.fullName, email: values.email, phone: values.phone,
      role: 'customer', isActive: true, createdAt: serverTimestamp(),
    });
  } catch (error) {
    // Avoid leaving an Auth account without its required Firestore profile.
    try { await deleteUser(user); }
    catch {
      await signOut(firebaseAuth);
      throw Object.assign(new Error('Your account was created, but its profile could not be saved. Contact support before registering again.'), { code: 'app/profile-incomplete' });
    }
    throw error;
  }
}

export async function loginAccount(email: string, password: string) {
  await signInWithEmailAndPassword(requireAuth(), email.trim().toLowerCase(), password);
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(requireAuth(), email.trim().toLowerCase());
}

export async function logout() {
  if (auth) await signOut(auth);
}
