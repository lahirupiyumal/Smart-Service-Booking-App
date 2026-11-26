import { useState } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';
import { styles } from '../styles/Auth.styles';

export function SessionNotice({ busy = false }: { busy?: boolean }) {
  const { user, loading, error, authenticating, retryProfile } = useAuth();
  const [signOutError, setSignOutError] = useState('');
  const [signingOut, setSigningOut] = useState(false);
  if (busy || authenticating) return null;
  if (user && loading) return <View style={styles.pending}><ActivityIndicator color="#2563EB" /><Text style={styles.pendingText}>Preparing your SmartServe profile…</Text></View>;
  if (!error) return null;
  return <View style={styles.notice}>
    <Text accessibilityRole="alert" style={styles.errorText}>{error}</Text>
    {!!signOutError && <Text accessibilityRole="alert" style={styles.errorText}>{signOutError}</Text>}
    {user && <><Pressable accessibilityRole="button" disabled={signingOut} onPress={retryProfile} style={styles.linkButton}><Text style={styles.link}>Retry profile</Text></Pressable>
      <Pressable accessibilityRole="button" disabled={signingOut} style={styles.linkButton} onPress={async () => { setSigningOut(true); setSignOutError(''); try { await logout(); router.replace('/(auth)/login'); } catch { setSignOutError('Couldn’t sign out. Please try again.'); } finally { setSigningOut(false); } }}><Text style={styles.link}>{signingOut ? 'Signing out…' : 'Sign out & use another account'}</Text></Pressable></>}
  </View>;
}
