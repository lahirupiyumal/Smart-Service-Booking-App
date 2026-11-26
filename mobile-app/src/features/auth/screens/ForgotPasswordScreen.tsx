import { useRef, useState } from 'react';
import { AuthLink } from '../components/AuthLink';
import { Text, View } from 'react-native';
import { Button } from '@/components/common/Button';
import { AuthField } from '../components/AuthField';
import { AuthScaffold } from '../components/AuthScaffold';
import { resetPassword } from '../services/authService';
import { validateEmail } from '../utils/validation';
import { authErrorMessage } from '../utils/errors';
import { styles } from '../styles/Auth.styles';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState<string>();
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  async function submit() {
    if (submitting.current) return;
    const next = validateEmail(email);
    setFieldError(next); setError(''); setSent(false);
    if (next) return;
    submitting.current = true; setBusy(true);
    try { await resetPassword(email); setSent(true); }
    catch (failure) {
      // Keep the same confirmation for unknown email addresses.
      if ((failure as { code?: string }).code === 'auth/user-not-found') setSent(true);
      else setError(authErrorMessage(failure));
    }
    finally { submitting.current = false; setBusy(false); }
  }
  return <AuthScaffold eyebrow="LET’S GET YOU BACK IN" title="Forgot your password?" subtitle="It happens. Enter your email and we’ll help you reset it.">
    {sent && <View style={styles.success}><Text accessibilityLiveRegion="polite" style={styles.successText}>If an account exists for this email, a password reset link has been sent. Check your inbox and spam folder.</Text></View>}
    {!!error && <View style={styles.notice}><Text accessibilityRole="alert" style={styles.errorText}>{error}</Text></View>}
    <View style={styles.form}>
      <AuthField label="Email address" placeholder="you@example.com" value={email} onChangeText={value => { setEmail(value); setFieldError(undefined); setError(''); setSent(false); }} error={fieldError} keyboardType="email-address" autoComplete="email" textContentType="emailAddress" autoCapitalize="none" autoCorrect={false} maxLength={254} editable={!busy} returnKeyType="send" onSubmitEditing={() => { void submit(); }} />
      <Button title={busy ? 'Sending reset link…' : sent ? 'Send link again' : 'Send reset link'} loading={busy} onPress={() => { void submit(); }} />
    </View>
    <View style={styles.footer}><AuthLink href="/(auth)/login" disabled={busy}>← Back to sign in</AuthLink></View>
  </AuthScaffold>;
}
