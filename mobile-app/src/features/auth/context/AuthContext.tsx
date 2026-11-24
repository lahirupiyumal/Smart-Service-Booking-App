import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import type { UserProfile, UserRole } from '@/features/auth/types/user';
interface AuthState { user: User | null; profile: UserProfile | null; loading: boolean; error: string | null }
const AuthContext = createContext<AuthState | undefined>(undefined);
export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>({ user: null, profile: null, loading: !!auth, error: null });
  useEffect(() => {
    if (!auth || !db) return;
    const database = db;
    let stopProfile: (() => void) | undefined;
    const stopAuth = onAuthStateChanged(auth, user => {
      stopProfile?.();
      setState({ user, profile: null, loading: !!user, error: null });
      if (!user) return;
      stopProfile = onSnapshot(doc(database, 'users', user.uid), snapshot => {
        const data = snapshot.data();
        const role: UserRole | null = data && ['customer', 'provider', 'admin'].includes(data.role) ? data.role : null;
        setState({ user, loading: false, error: role ? null : 'Your account profile has not been provisioned.',
          profile: role ? { uid: user.uid, email: user.email ?? '', displayName: typeof data?.displayName === 'string' ? data.displayName : '', role } : null });
      }, () => setState({ user, profile: null, loading: false, error: 'Unable to load your account profile.' }));
    }, () => setState({ user: null, profile: null, loading: false, error: 'Unable to restore your session.' }));
    return () => { stopAuth(); stopProfile?.(); };
  }, []);
  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
