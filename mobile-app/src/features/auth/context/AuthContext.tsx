import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import type { UserProfile } from '../types/user';
import { loginAccount, registerAccount } from '../services/authService';
import type { RegistrationInput } from '../utils/validation';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}
interface AuthContextValue extends AuthState {
  initializing: boolean;
  authenticating: boolean;
  register: (input: RegistrationInput) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  retryProfile: () => void;
}
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>({ user: null, profile: null, loading: !!auth, error: null });
  const [initializing, setInitializing] = useState(!!auth);
  const [authenticating, setAuthenticating] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!auth || !db) return;
    const database = db;
    let stopProfile: (() => void) | undefined;
    let active = true;
    let session = 0;
    const stopAuth = onAuthStateChanged(auth, user => {
      const currentSession = ++session;
      stopProfile?.();
      setInitializing(false);
      setState({ user, profile: null, loading: !!user, error: null });
      if (!user) return;
      stopProfile = onSnapshot(doc(database, 'users', user.uid), { includeMetadataChanges: true }, snapshot => {
        if (!active || currentSession !== session) return;
        // Registration must finish committing its profile before protected routes open.
        if (snapshot.metadata.hasPendingWrites) return;
        const data = snapshot.data();
        if (!data || data.uid !== user.uid || typeof data.fullName !== 'string' ||
            typeof data.email !== 'string' || typeof data.phone !== 'string' ||
            typeof data.isActive !== 'boolean' || !['customer', 'provider', 'admin'].includes(data.role)) {
          setState({ user, profile: null, loading: false, error: 'Your account profile is missing or incomplete. Retry, or contact support if this continues.' });
          return;
        }
        const profile: UserProfile = {
          uid: user.uid, fullName: data.fullName, email: data.email, phone: data.phone,
          role: data.role, isActive: data.isActive, createdAt: data.createdAt ?? null,
        };
        setState({ user, profile, loading: false, error: profile.isActive ? null : 'This account is inactive. Please contact support.' });
      }, () => {
        if (active && currentSession === session) setState({ user, profile: null, loading: false, error: 'Unable to load your account profile. Check your connection and try again.' });
      });
    }, () => {
      if (!active) return;
      setInitializing(false);
      setState({ user: null, profile: null, loading: false, error: 'Unable to restore your session. Please sign in again.' });
    });
    return () => { active = false; stopAuth(); stopProfile?.(); };
  }, [retry]);

  async function register(input: RegistrationInput) {
    setAuthenticating(true);
    try { await registerAccount(input); }
    finally { setAuthenticating(false); }
  }
  async function login(email: string, password: string) {
    setAuthenticating(true);
    try { await loginAccount(email, password); }
    finally { setAuthenticating(false); }
  }
  return <AuthContext.Provider value={{ ...state, initializing, authenticating, register, login, retryProfile: () => setRetry(value => value + 1) }}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
