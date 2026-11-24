import { useState } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ServiceIcon } from '@/components/common/ServiceIcon';
import { isFirebaseConfigured } from '@/config/env';
import { login, register, resetPassword } from '@/services/auth/authService';

type Mode = 'login' | 'register' | 'reset';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function Field({ label, ...props }: TextInputProps & { label: string }) {
  const [focused, setFocused] = useState(false);
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput {...props} accessibilityLabel={label} placeholderTextColor="#9AA6B8" onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={[styles.input, focused && styles.inputFocused]} /></View>;
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
      else { await login(email, password); router.replace('/(customer)'); }
    } catch (err) { setError(errorMessage(err)); }
    finally { setBusy(false); }
  }
  const title = resetting ? 'Forgot your password?' : signingUp ? 'Make yourself at home.' : 'Good to see you again.';
  return <SafeAreaView style={styles.safe}>
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
        <View style={styles.page}>
          <View style={styles.top}><Pressable accessibilityRole="button" accessibilityLabel="Back to home" onPress={() => router.replace('/(customer)')} style={styles.back}><Text style={styles.backText}>←</Text></Pressable><View style={styles.brandRow}><View style={styles.logo}><ServiceIcon name="home" color="#FFFFFF" size={21} /></View><Text style={styles.brand}>SmartServe<Text style={styles.blue}>.</Text></Text></View><View style={styles.spacer} /></View>
          <View style={styles.card}>
            <View style={styles.badge}><ServiceIcon name={resetting ? 'check' : 'user'} size={25} /></View>
            <Text style={styles.eyebrow}>{resetting ? 'LET’S GET YOU BACK IN' : signingUp ? 'YOUR NEXT CHAPTER STARTS HERE' : 'WELCOME BACK'}</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{resetting ? 'Enter your email and we’ll send you a reset link.' : signingUp ? 'Create an account for a simpler way to care for your home.' : 'Sign in to keep your home services in one place.'}</Text>
            <View style={styles.form}>
              {signingUp && <Field label="Full name" placeholder="Enter your full name" value={name} onChangeText={setName} autoCapitalize="words" autoComplete="name" editable={!busy && !success} maxLength={100} />}
              <Field label="Email address" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" editable={!busy && !success} />
              {!resetting && <><Field label="Password" placeholder={signingUp ? 'At least 8 characters' : 'Enter your password'} value={password} onChangeText={setPassword} secureTextEntry={!visible} autoCapitalize="none" autoCorrect={false} autoComplete={signingUp ? 'new-password' : 'current-password'} editable={!busy && !success} /><View style={styles.passwordOptions}><Pressable accessibilityRole="checkbox" accessibilityState={{ checked: visible }} accessibilityLabel="Show password" onPress={() => setVisible(!visible)} style={styles.showPassword}><View style={[styles.checkbox, visible && styles.checkboxChecked]}>{visible && <ServiceIcon name="check" size={12} color="#FFFFFF" />}</View><Text style={styles.smallText}>Show password</Text></Pressable>{!signingUp && <Pressable accessibilityRole="link" disabled={busy} onPress={() => router.push('/(auth)/forgot-password')} style={styles.inlineLink}><Text style={styles.link}>Forgot password?</Text></Pressable>}</View></>}
              {signingUp && <Field label="Confirm password" placeholder="Re-enter your password" value={confirm} onChangeText={setConfirm} secureTextEntry={!visible} autoCapitalize="none" autoCorrect={false} autoComplete="new-password" editable={!busy && !success} />}
              {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
              {!!success && <Text accessibilityLiveRegion="polite" style={styles.success}>{success}</Text>}
              {success && signingUp ? <Pressable accessibilityRole="button" onPress={() => router.replace('/(customer)')} style={styles.submit}><Text style={styles.submitText}>Explore services</Text><ServiceIcon name="arrow" color="#FFFFFF" size={19} /></Pressable> : <Pressable accessibilityRole="button" disabled={busy || (!!success && resetting)} onPress={() => { void submit(); }} style={({ pressed }) => [styles.submit, (busy || (!!success && resetting)) && styles.disabled, pressed && styles.pressed]}>{busy ? <ActivityIndicator color="#FFFFFF" /> : <><Text style={styles.submitText}>{resetting ? 'Send reset link' : signingUp ? 'Create account' : 'Sign in'}</Text><ServiceIcon name="arrow" color="#FFFFFF" size={19} /></>}</Pressable>}
            </View>
            <View style={styles.divider} />
            <View style={styles.switchRow}><Text style={styles.smallText}>{resetting ? 'Remember your password?' : signingUp ? 'Already have an account?' : 'New to SmartServe?'}</Text><Pressable accessibilityRole="link" disabled={busy} onPress={() => router.replace(signingUp || resetting ? '/(auth)/login' : '/(auth)/register')} style={styles.inlineLink}><Text style={styles.link}>{signingUp || resetting ? 'Sign in' : 'Create an account'}</Text></Pressable></View>
          </View>
          <Text style={styles.footer}>A little less hassle. A little more home.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F8FD' }, flex: { flex: 1 }, scroll: { flexGrow: 1, paddingHorizontal: 22, paddingVertical: 25, justifyContent: 'center' }, page: { width: '100%', maxWidth: 480, alignSelf: 'center', gap: 25 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, back: { width: 44, height: 44, borderRadius: 13, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E3EAF5', alignItems: 'center', justifyContent: 'center' }, backText: { color: '#425672', fontSize: 23 }, spacer: { width: 44 }, brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9 }, logo: { height: 35, width: 35, backgroundColor: '#2563EB', borderRadius: 11, alignItems: 'center', justifyContent: 'center' }, brand: { fontSize: 22, color: '#14243D', fontWeight: '800', letterSpacing: -0.8 }, blue: { color: '#2563EB' },
  card: { padding: 25, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E3EAF5', shadowColor: '#1A3C70', shadowOpacity: 0.04, shadowRadius: 25, shadowOffset: { width: 0, height: 8 } }, badge: { width: 54, height: 54, borderRadius: 17, backgroundColor: '#EDF3FF', alignItems: 'center', justifyContent: 'center', marginBottom: 23 }, eyebrow: { color: '#7D8DA5', fontSize: 8, fontWeight: '700', letterSpacing: 1.5, marginBottom: 10 }, title: { fontSize: 27, lineHeight: 34, fontWeight: '700', letterSpacing: -0.9, color: '#14243D' }, subtitle: { fontSize: 13, lineHeight: 21, color: '#7B8AA1', marginTop: 10 }, form: { gap: 17, marginTop: 27 }, field: { gap: 8 }, label: { fontSize: 12, fontWeight: '600', color: '#334763' }, input: { minHeight: 53, paddingHorizontal: 15, paddingVertical: 15, fontSize: 13, color: '#14243D', backgroundColor: '#FBFCFE', borderRadius: 11, borderWidth: 1, borderColor: '#E1E8F3' }, inputFocused: { borderColor: '#2563EB', backgroundColor: '#FFFFFF' },
  passwordOptions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4, marginTop: -10 }, showPassword: { flexDirection: 'row', gap: 7, alignItems: 'center', minHeight: 44 }, checkbox: { width: 16, height: 16, borderRadius: 4, borderWidth: 1, borderColor: '#CCD6E5', alignItems: 'center', justifyContent: 'center' }, checkboxChecked: { backgroundColor: '#2563EB', borderColor: '#2563EB' }, smallText: { fontSize: 11, color: '#7B8AA1', lineHeight: 18 }, inlineLink: { minHeight: 44, justifyContent: 'center' }, link: { color: '#2563EB', fontSize: 11, fontWeight: '600' }, submit: { backgroundColor: '#2563EB', minHeight: 53, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 }, submitText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' }, disabled: { opacity: 0.5 }, pressed: { opacity: 0.8 }, divider: { height: 1, backgroundColor: '#EEF2F8', marginTop: 25, marginBottom: 9 }, switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 5 }, error: { color: '#B42318', backgroundColor: '#FFF1F0', padding: 12, borderRadius: 9, fontSize: 12, lineHeight: 19 }, success: { color: '#24664A', backgroundColor: '#EDF8F2', padding: 12, borderRadius: 9, fontSize: 12, lineHeight: 19 }, footer: { color: '#95A2B6', fontSize: 10, textAlign: 'center' },
});
