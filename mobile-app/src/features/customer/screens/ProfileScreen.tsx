import { useState } from 'react';
import { Text } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { InfoCard } from '@/components/cards/InfoCard';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/features/auth/context/AuthContext';
import { logout } from '@/features/auth/services/authService';
export default function Profile() {
  const { user, profile, loading, error } = useAuth();
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  async function signOut() {
    setBusy(true);
    try { await logout(); router.replace('/'); }
    catch { setMessage('Unable to sign out. Please try again.'); }
    finally { setBusy(false); }
  }
  return <Screen title="Your profile" subtitle="Customer preview">
    <InfoCard title={loading ? 'Loading account…' : profile?.displayName || user?.email || 'Guest preview'} description={profile ? `Account role: ${profile.role}` : 'Browse services directly from the home page.'} />
    {(error || message) && <Text accessibilityRole="alert">{message || error}</Text>}
    {user && <Button title="Sign out" disabled={busy} onPress={() => { void signOut(); }} />}
    <Button title="Back to home" secondary onPress={() => router.replace('/')} />
  </Screen>;
}
