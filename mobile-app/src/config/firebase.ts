import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, type Persistence } from 'firebase/auth';
import * as FirebaseAuth from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};
const isFirebaseConfigured = Object.values(firebaseConfig).every(value => Boolean(value?.trim()));

// A single app survives Fast Refresh. No SDK initialization with missing credentials.
export const firebaseApp = isFirebaseConfigured
  ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : null;
function createAuth() {
  if (!firebaseApp) return null;
  if (Platform.OS === 'web') return getAuth(firebaseApp);
  // Metro exposes this native-only API; Firebase's browser declarations omit it.
  const { getReactNativePersistence } = FirebaseAuth as typeof FirebaseAuth & {
    getReactNativePersistence(storage: typeof AsyncStorage): Persistence;
  };
  try {
    return initializeAuth(firebaseApp, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch (error) {
    if ((error as { code?: string }).code === 'auth/already-initialized') return getAuth(firebaseApp);
    throw error;
  }
}
export const auth = createAuth();
function createDatabase() {
  if (!firebaseApp) return null;
  if (Platform.OS !== 'web') return getFirestore(firebaseApp);
  try {
    // Avoid buffered streaming connections on web networks that interrupt WebChannel.
    return initializeFirestore(firebaseApp, { experimentalForceLongPolling: true });
  } catch (error) {
    // Fast Refresh can retain an instance created with the previous settings.
    // A full browser reload applies the new transport settings in that case.
    if ((error as { code?: string }).code === 'failed-precondition') return getFirestore(firebaseApp);
    throw error;
  }
}
export const db = createDatabase();
export const storage = firebaseApp ? getStorage(firebaseApp) : null;
