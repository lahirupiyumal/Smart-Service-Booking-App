import { AuthField } from '../components/AuthField';
import { getAuthErrorMessage } from '../services/authErrors';
import { styles } from '../styles/AuthScreen.styles';
import { useState } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ServiceIcon } from '@/components/common/ServiceIcon';
import { isFirebaseConfigured } from '@/config/env';
import { login, register, resetPassword } from '@/features/auth/services/authService';

type Mode = 'login' | 'register' | 'reset';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function AuthScreen({ mode }: { mode: Mode }) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const signingUp = mode === 'register';
  const resetting = mode === 'reset';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  async function submit() {
    if (busy) return;
    setError(''); setSuccess('');
    if (signingUp && name.trim().length < 2) { setError('Please enter your full name.'); return; }
    if (!emailPattern.test(email.trim())) { setError('Please enter a valid email address.'); return; }
    if (!resetting && !password) { setError('Please enter your password.'); return; }
    if (signingUp && password.length < 8) { setError('Use at least 8 characters for your password.'); return; }
    if (signingUp && password !== confirm) { setError('Your passwords don’t match.'); return; }
    if (!isFirebaseConfigured) { setError('Account services are not available yet. Please try again later.'); return; }
    setBusy(true);
    try {
      if (resetting) { await resetPassword(email); setSuccess('If an account exists for this email, you’ll receive a password reset link. Check your inbox and spam folder.'); }
      else if (signingUp) { const result = await register(name, email, password); setSuccess(result.nameSaved ? 'Your account is ready. You can now explore home services.' : 'Your account was created. Your name couldn’t be saved, but you can continue.'); }
      else { await login(email, password); }
    } catch (err) { setError(getAuthErrorMessage(err)); }
    finally { setBusy(false); }
  }
  const title = resetting ? 'Let’s get you back in.' : signingUp ? 'Your home, in good hands.' : 'Welcome home.';
  const passwordToggle = <Pressable accessibilityRole="button" accessibilityLabel={visible ? 'Hide passwords' : 'Show passwords'} accessibilityState={{ selected: visible }} onPress={() => setVisible(!visible)} style={styles.visibility}><Text style={styles.visibilityText}>{visible ? 'Hide' : 'Show'}</Text></Pressable>;
  return <SafeAreaView style={styles.safe}>
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.scroll, wide && styles.scrollWide]}>
        <View style={[styles.page, wide && styles.pageWide]}>
          <View style={[styles.formPanel, wide && styles.formPanelWide]}>
            <View style={styles.card}>
              {resetting ? <Pressable accessibilityRole="link" disabled={busy} onPress={() => router.replace('/(auth)/login')} style={styles.back}><Text style={styles.backText}>←  Back to sign in</Text></Pressable> : <View style={styles.tabs}>
                {(['login', 'register'] as const).map(tab => <Pressable key={tab} accessibilityRole="tab" accessibilityState={{ selected: mode === tab }} disabled={busy} onPress={() => { if (mode !== tab) router.replace(tab === 'login' ? '/(auth)/login' : '/(auth)/register'); }} style={[styles.tab, mode === tab && styles.tabActive]}><Text style={[styles.tabText, mode === tab && styles.tabTextActive]}>{tab === 'login' ? 'Sign in' : 'Create account'}</Text></Pressable>)}
              </View>}
              <View style={styles.heading}>
                <Text style={styles.eyebrow}>{resetting ? 'A FRESH START' : signingUp ? 'JOIN SMARTSERVE' : 'YOUR EVERYDAY, MADE EASIER'}</Text>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{resetting ? 'Enter your email address and we’ll send you a link to reset your password.' : signingUp ? 'Create your account. Make room for a little less hassle.' : 'Sign in to find great services and take care of what matters.'}</Text>
              </View>
              <View style={styles.form}>
                {signingUp && <AuthField label="Full name" placeholder="e.g. Nimal Perera" value={name} onChangeText={setName} autoCapitalize="words" autoComplete="name" editable={!busy && !success} maxLength={100} />}
                <AuthField label="Email address" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" editable={!busy && !success} />
                {!resetting && <AuthField label="Password" icon="check" placeholder={signingUp ? 'Create a strong password' : 'Enter your password'} value={password} onChangeText={setPassword} secureTextEntry={!visible} autoCapitalize="none" autoCorrect={false} autoComplete={signingUp ? 'new-password' : 'current-password'} editable={!busy && !success} trailing={passwordToggle} onSubmitEditing={() => { if (!signingUp) void submit(); }} returnKeyType={signingUp ? 'next' : 'go'} />}
                {signingUp && <><Text style={styles.hint}>Use at least 8 characters for your password.</Text><AuthField label="Confirm password" icon="check" placeholder="Enter your password again" value={confirm} onChangeText={setConfirm} secureTextEntry={!visible} autoCapitalize="none" autoCorrect={false} autoComplete="new-password" editable={!busy && !success} onSubmitEditing={() => { void submit(); }} returnKeyType="go" /></>}
                {!signingUp && !resetting && <Pressable accessibilityRole="link" disabled={busy} onPress={() => router.push('/(auth)/forgot-password')} style={styles.forgot}><Text style={styles.link}>Forgot password?</Text></Pressable>}
                {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
                {!!success && <Text accessibilityLiveRegion="polite" style={styles.success}>{success}</Text>}
                <Pressable accessibilityRole="button" accessibilityState={{ busy, disabled: busy || (!!success && resetting) }} disabled={busy || (!!success && resetting)} onPress={() => { void submit(); }} style={({ pressed }) => [styles.submit, (busy || (!!success && resetting)) && styles.disabled, pressed && styles.pressed]}>
                  {busy ? <ActivityIndicator color="#FFFFFF" /> : <><Text style={styles.submitText}>{resetting ? 'Send reset link' : signingUp ? 'Create my account' : 'Sign in to SmartServe'}</Text><ServiceIcon name="arrow" color="#FFFFFF" size={20} /></>}
                </Pressable>
                {!signingUp && !resetting && <Pressable accessibilityRole="button" accessibilityLabel="Continue to home as a guest" disabled={busy} onPress={() => router.push('/(customer)')} style={({ pressed }) => [styles.guestButton, busy && styles.disabled, pressed && styles.pressed]}>
                  <ServiceIcon name="home" color="#16796B" size={20} /><Text style={styles.guestButtonText}>Continue as guest</Text>
                </Pressable>}
              </View>
              <View style={styles.switchRow}><Text style={styles.smallText}>{resetting ? 'Remember your password?' : signingUp ? 'Already part of SmartServe?' : 'New around here?'}</Text><Pressable accessibilityRole="link" disabled={busy} onPress={() => router.replace(signingUp || resetting ? '/(auth)/login' : '/(auth)/register')} style={styles.inlineLink}><Text style={styles.link}>{signingUp || resetting ? 'Sign in' : 'Create an account'}</Text></Pressable></View>
              <View style={styles.security}><View style={styles.securityIcon}><ServiceIcon name="check" size={13} color="#16796B" /></View><Text style={styles.securityText}>A little less hassle. A little more home.</Text></View>
            </View>
            <Text style={styles.footer}>SMARTSERVE  /  HOME STARTS HERE</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
