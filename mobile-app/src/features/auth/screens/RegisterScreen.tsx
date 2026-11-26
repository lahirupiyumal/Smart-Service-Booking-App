import { useRef, useState } from 'react';
import { AuthLink } from '../components/AuthLink';
import { Text, View } from 'react-native';
import { Button } from '@/components/common/Button';
import { ServiceIcon } from '@/components/common/ServiceIcon';
import { AuthField } from '../components/AuthField';
import { AuthScaffold } from '../components/AuthScaffold';
import { SessionNotice } from '../components/SessionNotice';
import { useAuth } from '../context/AuthContext';
import { authErrorMessage } from '../utils/errors';
import { validateRegistration, type RegistrationErrors, type RegistrationInput } from '../utils/validation';
import { styles } from '../styles/Auth.styles';

export default function RegisterScreen() {
  const { register, user } = useAuth();
  const [values, setValues] = useState<RegistrationInput>({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  function update(key: keyof RegistrationInput, value: string) {
    setValues(previous => ({ ...previous, [key]: value }));
    setErrors(previous => ({ ...previous, [key]: undefined, ...(key === 'password' ? { confirmPassword: undefined } : {}) }));
    setError('');
  }
  async function submit() {
    if (submitting.current || user) return;
    const next = validateRegistration(values);
    setErrors(next); setError('');
    if (Object.keys(next).length) return;
    submitting.current = true; setBusy(true);
    try { await register(values); }
    catch (failure) { setError(authErrorMessage(failure)); }
    finally { submitting.current = false; setBusy(false); }
  }
  const editable = !busy && !user;
  return <AuthScaffold eyebrow="YOUR EVERYDAY, MADE EASIER" title="Create your account" subtitle="Join SmartServe. A helping hand is just a few taps away.">
    <SessionNotice busy={busy} />
    {!!error && <View style={styles.notice}><Text accessibilityRole="alert" style={styles.errorText}>{error}</Text></View>}
    <View style={styles.form}>
      <AuthField label="Full name" placeholder="Enter your full name" value={values.fullName} onChangeText={value => update('fullName', value)} error={errors.fullName} autoComplete="name" textContentType="name" autoCapitalize="words" maxLength={100} editable={editable} />
      <AuthField label="Email address" placeholder="you@example.com" value={values.email} onChangeText={value => update('email', value)} error={errors.email} keyboardType="email-address" autoComplete="email" textContentType="emailAddress" autoCapitalize="none" autoCorrect={false} maxLength={254} editable={editable} />
      <AuthField label="Phone number" placeholder="077 123 4567" value={values.phone} onChangeText={value => update('phone', value)} error={errors.phone} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" maxLength={24} editable={editable} />
      <AuthField label="Password" placeholder="Create a strong password" value={values.password} onChangeText={value => update('password', value)} error={errors.password} hint="Use at least 8 characters." password autoComplete="new-password" textContentType="newPassword" autoCapitalize="none" autoCorrect={false} maxLength={128} editable={editable} />
      <AuthField label="Confirm password" placeholder="Re-enter your password" value={values.confirmPassword} onChangeText={value => update('confirmPassword', value)} error={errors.confirmPassword} password autoComplete="new-password" textContentType="newPassword" autoCapitalize="none" autoCorrect={false} maxLength={128} editable={editable} returnKeyType="done" onSubmitEditing={() => { void submit(); }} />
      <Button title={busy ? 'Creating your account…' : 'Create account'} loading={busy} disabled={!!user} onPress={() => { void submit(); }} />
    </View>
    <View style={styles.securityNote}><ServiceIcon name="check" size={16} color="#16796B" /><Text style={styles.securityText}>One account for your everyday service needs.</Text></View>
    <View style={styles.divider} />
    <View style={styles.footer}><Text style={styles.footerText}>Already have an account?</Text><AuthLink href="/(auth)/login" disabled={busy}>Sign in</AuthLink></View>
  </AuthScaffold>;
}
