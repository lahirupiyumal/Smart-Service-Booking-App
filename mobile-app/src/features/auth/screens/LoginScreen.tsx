import { useRef, useState } from 'react';
import { AuthLink } from '../components/AuthLink';
import { Text, View } from 'react-native';
import { Button } from '@/components/common/Button';
import { AuthField } from '../components/AuthField';
import { AuthScaffold } from '../components/AuthScaffold';
import { SessionNotice } from '../components/SessionNotice';
import { useAuth } from '../context/AuthContext';
import { authErrorMessage } from '../utils/errors';
import { validateEmail } from '../utils/validation';
import { styles } from '../styles/Auth.styles';

export default function LoginScreen() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  async function submit() {
    if (submitting.current || user) return;
    const next = { email: validateEmail(email), password: password ? undefined : 'Enter your password.' };
    setErrors(next); setError('');
    if (next.email || next.password) return;
    submitting.current = true; setBusy(true);
    try { await login(email, password); }
    catch (failure) { setError(authErrorMessage(failure)); }
    finally { submitting.current = false; setBusy(false); }
  }
  return <AuthScaffold eyebrow="GOOD TO SEE YOU AGAIN" title="Welcome back" subtitle="Sign in to your SmartServe account. Let’s take care of your day.">
    <SessionNotice busy={busy} />
    {!!error && <View style={styles.notice}><Text accessibilityRole="alert" style={styles.errorText}>{error}</Text></View>}
    <View style={styles.form}>
      <AuthField label="Email address" placeholder="you@example.com" value={email} onChangeText={value => { setEmail(value); setErrors(previous => ({ ...previous, email: undefined })); setError(''); }} error={errors.email} keyboardType="email-address" autoComplete="email" textContentType="emailAddress" autoCapitalize="none" autoCorrect={false} maxLength={254} editable={!busy && !user} />
      <AuthField label="Password" placeholder="Enter your password" value={password} onChangeText={value => { setPassword(value); setErrors(previous => ({ ...previous, password: undefined })); setError(''); }} error={errors.password} password autoComplete="current-password" textContentType="password" autoCapitalize="none" autoCorrect={false} editable={!busy && !user} returnKeyType="go" onSubmitEditing={() => { void submit(); }} />
      <AuthLink href="/(auth)/forgot-password" disabled={busy} alignRight>Forgot password?</AuthLink>
      <Button title={busy ? 'Signing you in…' : 'Sign in'} loading={busy} disabled={!!user} onPress={() => { void submit(); }} />
    </View>
    <View style={styles.divider} />
    <View style={styles.footer}><Text style={styles.footerText}>New to SmartServe?</Text><AuthLink href="/(auth)/register" disabled={busy}>Create an account</AuthLink></View>
  </AuthScaffold>;
}
