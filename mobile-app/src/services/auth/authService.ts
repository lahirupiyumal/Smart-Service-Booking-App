import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth } from '@/config/firebase';
export async function login(email: string, password: string) {
  if (!auth) throw new Error('Add Firebase configuration to mobile-app/.env first.');
  return signInWithEmailAndPassword(auth, email.trim(), password);
}
export async function logout() {
  if (auth) await signOut(auth);
}

// Roles remain provisioned by trusted server code. Signup creates only an Auth account.
export async function register(name: string, email: string, password: string) {
  if (!auth) throw new Error('Authentication is unavailable.');
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  let nameSaved = true;
  try { await updateProfile(credential.user, { displayName: name.trim() }); }
  catch { nameSaved = false; }
  return { credential, nameSaved };
}
export async function resetPassword(email: string) {
  if (!auth) throw new Error('Authentication is unavailable.');
  try { await sendPasswordResetEmail(auth, email.trim()); }
  catch (error) {
    if ((error as { code?: string }).code !== 'auth/user-not-found') throw error;
  }
}
