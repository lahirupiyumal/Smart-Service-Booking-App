import { useRef, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/features/auth/context/AuthContext';
import { seedServiceCategories } from '@/scripts/seedCategories';
import { theme } from '@/theme';

function notify(title: string, message: string) {
  if (Platform.OS === 'web') globalThis.alert(`${title}\n\n${message}`);
  else Alert.alert(title, message);
}

export function SeedCategoriesButton() {
  const { user, profile, loading } = useAuth();
  const running = useRef(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);

  async function seed() {
    if (running.current) return;
    running.current = true;
    setBusy(true);
    setMessage('');
    setFailed(false);
    try {
      const results = await seedServiceCategories();
      const detail = `All ${results.length} service category documents are verified in Firestore:\n${results.map(result => `service_categories/${result.id} — ${result.status === 'created' ? 'created' : 'already exists'}`).join('\n')}`;
      setMessage(detail);
      notify('Success', detail);
    } catch (error) {
      const failure = error as { code?: unknown; message?: unknown } | null;
      const code = typeof failure?.code === 'string' ? failure.code : undefined;
      const actualMessage = typeof failure?.message === 'string' ? failure.message : String(error);
      const detail = `${code ? `${code}: ` : ''}${actualMessage}`;
      setFailed(true);
      setMessage(detail);
      console.warn('Category initialization failed', { code: code ?? 'unknown', message: actualMessage });
      notify('Category initialization failed', detail);
    } finally {
      running.current = false;
      setBusy(false);
    }
  }

  return <View style={styles.container}>
    <Text style={styles.heading}>Temporary category setup</Text>
    <Text style={styles.message}>{loading ? 'Checking authentication…' : user ? `Signed in as ${user.email ?? user.uid}\nUID: ${user.uid}\nRole: ${profile?.role ?? 'profile unavailable'}` : 'Sign in to initialize service categories.'}</Text>
    <Text style={styles.message}>Creates missing defaults and preserves existing category documents. Firestore rules must allow this account to read and create categories.</Text>
    <Button title={busy ? 'Initializing Service Categories…' : 'Initialize Service Categories'} loading={busy} disabled={loading || !user} onPress={() => { void seed(); }} />
    {!!message && <Text accessibilityLiveRegion="polite" style={[styles.message, failed && styles.error]}>{message}</Text>}
  </View>;
}

const styles = StyleSheet.create({
  container: { marginTop: 24, gap: 12 },
  heading: { fontSize: 15, fontWeight: '700', color: theme.colors.text },
  message: { fontSize: 13, lineHeight: 20, color: theme.colors.text },
  error: { color: theme.colors.danger },
});
