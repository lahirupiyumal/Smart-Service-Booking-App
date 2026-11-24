import { useState } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions, type TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ServiceIcon } from '@/components/common/ServiceIcon';
import { isFirebaseConfigured } from '@/config/env';
import { login, register, resetPassword } from '@/services/auth/authService';

type Mode = 'login' | 'register' | 'reset';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function Field({ label, icon = 'user', trailing, ...props }: TextInputProps & { label: string; icon?: 'user' | 'check'; trailing?: React.ReactNode }) {
  const [focused, setFocused] = useState(false);
  return <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputWrap, focused && styles.inputFocused]}>
      <ServiceIcon name={icon} size={19} color={focused ? '#16796B' : '#8995A7'} />
      <TextInput {...props} accessibilityLabel={label} placeholderTextColor="#8A95A5" onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={styles.input} />
      {trailing}
    </View>
  </View>;
}

function errorMessage(error: unknown) {
  const code = (error as { code?: string })?.code;
  switch (code) {
    case 'auth/email-already-in-use': return 'An account already uses this email. Please sign in instead.';
    case 'auth/invalid-email': return 'Please enter a valid email address.';
    case 'auth/weak-password': return 'Choose a stronger password and try again.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password': return 'The email or password is incorrect. Please try again.';
    case 'auth/too-many-requests': return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed': return 'Unable to connect. Check your internet connection.';
    default: return 'We couldn’t complete your request. Please try again later.';
  }
}
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
    } catch (err) { setError(errorMessage(err)); }
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
                {signingUp && <Field label="Full name" placeholder="e.g. Nimal Perera" value={name} onChangeText={setName} autoCapitalize="words" autoComplete="name" editable={!busy && !success} maxLength={100} />}
                <Field label="Email address" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" editable={!busy && !success} />
                {!resetting && <Field label="Password" icon="check" placeholder={signingUp ? 'Create a strong password' : 'Enter your password'} value={password} onChangeText={setPassword} secureTextEntry={!visible} autoCapitalize="none" autoCorrect={false} autoComplete={signingUp ? 'new-password' : 'current-password'} editable={!busy && !success} trailing={passwordToggle} onSubmitEditing={() => { if (!signingUp) void submit(); }} returnKeyType={signingUp ? 'next' : 'go'} />}
                {signingUp && <><Text style={styles.hint}>Use at least 8 characters for your password.</Text><Field label="Confirm password" icon="check" placeholder="Enter your password again" value={confirm} onChangeText={setConfirm} secureTextEntry={!visible} autoCapitalize="none" autoCorrect={false} autoComplete="new-password" editable={!busy && !success} onSubmitEditing={() => { void submit(); }} returnKeyType="go" /></>}
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
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F8F7' }, flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingVertical: 24 }, scrollWide: { padding: 28, justifyContent: 'center' },
  page: { width: '100%', alignSelf: 'center' }, pageWide: { maxWidth: 540, borderRadius: 30, overflow: 'hidden', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E3E9E6' },
  formPanel: { paddingHorizontal: 25, paddingTop: 28, paddingBottom: 24, alignItems: 'center' }, formPanelWide: { paddingHorizontal: 48, paddingVertical: 42, justifyContent: 'center' }, card: { width: '100%', maxWidth: 430 },
  tabs: { flexDirection: 'row', padding: 5, backgroundColor: '#EDF2EF', borderRadius: 14, marginBottom: 30 }, tab: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }, tabActive: { backgroundColor: '#FFFFFF', shadowColor: '#153D30', shadowOpacity: 0.08, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 2 }, tabText: { fontSize: 13, fontWeight: '600', color: '#697C75' }, tabTextActive: { color: '#153D34', fontWeight: '700' },
  heading: { marginBottom: 28 }, eyebrow: { color: '#16796B', fontSize: 9, fontWeight: '800', letterSpacing: 1.6, marginBottom: 11 }, title: { color: '#172F2C', fontSize: 30, lineHeight: 38, fontWeight: '700', letterSpacing: -1.1 }, subtitle: { color: '#6B7D77', fontSize: 14, lineHeight: 23, marginTop: 10 },
  form: { gap: 17 }, field: { gap: 8 }, label: { fontSize: 12, fontWeight: '600', color: '#2D443D' }, inputWrap: { flexDirection: 'row', alignItems: 'center', paddingLeft: 15, paddingRight: 5, minHeight: 55, borderWidth: 1, borderColor: '#DCE5DF', borderRadius: 12, backgroundColor: '#FFFFFF', gap: 12 }, inputFocused: { borderColor: '#16796B', backgroundColor: '#F8FCFA' }, input: { flex: 1, minWidth: 0, paddingVertical: 16, paddingRight: 8, fontSize: 14, color: '#172F2C', ...Platform.select({ web: { outlineStyle: 'none' } as object }) }, visibility: { minHeight: 44, minWidth: 48, alignItems: 'center', justifyContent: 'center' }, visibilityText: { color: '#16796B', fontSize: 11, fontWeight: '700' },
  hint: { color: '#718079', fontSize: 11, lineHeight: 17, marginTop: -10 }, forgot: { alignSelf: 'flex-end', minHeight: 44, justifyContent: 'center', marginTop: -12 }, link: { color: '#16796B', fontSize: 12, fontWeight: '700' }, submit: { backgroundColor: '#16796B', minHeight: 56, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 17, shadowColor: '#16796B', shadowOpacity: 0.18, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 3 }, submitText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' }, disabled: { opacity: 0.5 }, pressed: { opacity: 0.8, transform: [{ scale: 0.99 }] },
  guestButton: { minHeight: 54, borderRadius: 12, borderWidth: 1, borderColor: '#C5DDD4', backgroundColor: '#F0F8F4', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }, guestButtonText: { color: '#16796B', fontSize: 14, fontWeight: '700' },
  switchRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 17 }, smallText: { fontSize: 12, lineHeight: 20, color: '#6B7D77' }, inlineLink: { minHeight: 44, justifyContent: 'center' }, security: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7, borderTopWidth: 1, borderColor: '#E7EDE9', paddingTop: 22, marginTop: 13 }, securityIcon: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5F3EB' }, securityText: { color: '#718079', fontSize: 11 }, footer: { fontSize: 9, color: '#85948C', letterSpacing: 1.5, marginTop: 30, textAlign: 'center' }, back: { minHeight: 44, justifyContent: 'center', marginBottom: 22 }, backText: { color: '#16796B', fontSize: 13, fontWeight: '600' }, error: { color: '#A32D26', backgroundColor: '#FFF0ED', padding: 13, borderRadius: 10, fontSize: 12, lineHeight: 19 }, success: { color: '#236346', backgroundColor: '#EAF6EF', padding: 13, borderRadius: 10, fontSize: 12, lineHeight: 19 },
});
