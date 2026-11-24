import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View, useWindowDimensions, type TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ServiceIcon } from '@/components/common/ServiceIcon';
import { useAuth } from '@/features/auth/context/AuthContext';
import { logout } from '@/features/auth/services/authService';
import { loadCustomerProfile, saveCustomerProfile } from '../services/profileStorage';
import { avatarColors, emptyProfile, type CustomerProfile } from '../types/profile';
import { styles } from '../styles/ProfileScreen.styles';

function ProfileField({ label, editing, ...props }: TextInputProps & { label: string; editing: boolean }) {
  return <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}</Text>
    {editing ? <TextInput {...props} accessibilityLabel={label} placeholderTextColor="#8997AB" style={[styles.input, props.multiline && styles.multiline]} />
      : <Text selectable style={[styles.fieldValue, !props.value && styles.emptyValue]}>{props.value || 'Not added yet'}</Text>}
  </View>;
}

export default function ProfileScreen() {
  const { width } = useWindowDimensions();
  const { user } = useAuth();
  const [saved, setSaved] = useState<CustomerProfile>({ ...emptyProfile });
  const [draft, setDraft] = useState<CustomerProfile>({ ...emptyProfile });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true); setLoadError(false); setEditing(false); setMessage(''); setError('');
    loadCustomerProfile(user?.uid).then(profile => {
      if (active) { setSaved(profile); setDraft(profile); }
    }).catch(() => { if (active) setLoadError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user?.uid, retry]);

  function update(key: keyof CustomerProfile, value: string) {
    setDraft(previous => ({ ...previous, [key]: value })); setError(''); setMessage('');
  }
  async function save() {
    if (busy) return;
    const profile: CustomerProfile = {
      fullName: draft.fullName.trim(), email: draft.email.trim(), phone: draft.phone.trim(),
      city: draft.city.trim(), address: draft.address.trim(), avatarColor: draft.avatarColor,
    };
    if (profile.fullName.length < 2) { setError('Please enter your full name (at least 2 characters).'); return; }
    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) { setError('Please enter a valid email address.'); return; }
    if (profile.phone && !/^\+?\d{9,15}$/.test(profile.phone.replace(/[\s()-]/g, ''))) { setError('Please enter a valid phone number, such as 077 123 4567.'); return; }
    setBusy(true); setError(''); setMessage('');
    try {
      await saveCustomerProfile(profile, user?.uid);
      setSaved(profile); setDraft(profile); setEditing(false); setMessage('Your profile has been updated.');
    } catch { setError('Couldn’t save your profile. Please try again.'); }
    finally { setBusy(false); }
  }
  async function signOut() {
    setBusy(true); setError('');
    try { await logout(); router.replace('/'); }
    catch { setError('Couldn’t sign out. Please try again.'); }
    finally { setBusy(false); }
  }
  const initials = (draft.fullName.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('') || 'S').toUpperCase();
  const filled = [saved.fullName, saved.email, saved.phone, saved.city, saved.address].filter(Boolean).length;

  return <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
        <View style={styles.page}>
          <View style={styles.header}>
            <View style={styles.headingCopy}><Text style={styles.eyebrow}>YOUR SMARTSERVE SPACE</Text><Text style={styles.title}>My profile</Text><Text style={styles.subtitle}>A few details for a more personal experience.</Text></View>
            <Pressable accessibilityRole="button" accessibilityLabel="Back to home" onPress={() => router.replace('/(customer)')} style={styles.homeButton}><ServiceIcon name="home" size={21} /></Pressable>
          </View>
          {loading ? <View style={styles.loading}><ActivityIndicator color="#2563EB" accessibilityLabel="Loading profile" /></View>
            : loadError ? <View style={styles.card}><Text accessibilityRole="alert" style={styles.error}>We couldn’t load your saved profile. Try again to keep your details safe.</Text><Pressable accessibilityRole="button" onPress={() => setRetry(value => value + 1)} style={styles.primaryButton}><Text style={styles.primaryText}>Try again</Text></Pressable></View>
            : <View style={[styles.content, width >= 800 && styles.wideContent]}>
              <View style={[styles.sidebar, width >= 800 && styles.wideSidebar]}>
                <View style={styles.identityCard}>
                  <View style={styles.identityAccent} />
                  <View style={[styles.avatar, { backgroundColor: draft.avatarColor }]}><Text style={styles.initials}>{initials}</Text></View>
                  <Text style={styles.name}>{(editing ? draft.fullName : saved.fullName) || 'Make it yours'}</Text>
                  <Text style={styles.identitySubtitle}>{saved.city || 'Your everyday service companion'}</Text>
                  <View style={styles.badge}><View style={styles.badgeDot} /><Text style={styles.badgeText}>Personal profile</Text></View>
                  {editing && <View style={styles.colors}>{avatarColors.map(color => <Pressable key={color} accessibilityRole="radio" accessibilityLabel={`Avatar color ${color}`} accessibilityState={{ selected: draft.avatarColor === color }} disabled={busy} onPress={() => update('avatarColor', color)} style={[styles.color, { backgroundColor: color }, draft.avatarColor === color && styles.selectedColor]}>{draft.avatarColor === color && <ServiceIcon name="check" color="#FFFFFF" size={16} />}</Pressable>)}</View>}
                  <View style={styles.completionRow}><Text style={styles.completionLabel}>Profile details</Text><Text style={styles.completionValue}>{filled}/5 added</Text></View>
                  <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${filled * 20}%` }]} /></View>
                </View>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Your activity</Text>
                  <Pressable accessibilityRole="button" onPress={() => router.push('/(customer)/bookings')} style={styles.activityRow}><View style={styles.activityIcon}><ServiceIcon name="calendar" size={20} /></View><Text style={styles.activityText}>My bookings</Text><ServiceIcon name="arrow" size={17} /></Pressable>
                  <Pressable accessibilityRole="button" onPress={() => router.push('/(customer)/favorites')} style={styles.activityRow}><View style={styles.activityIcon}><ServiceIcon name="heart" size={20} /></View><Text style={styles.activityText}>Saved favorites</Text><ServiceIcon name="arrow" size={17} /></Pressable>
                </View>
              </View>
              <View style={styles.details}>
                <View style={styles.card}>
                  <View style={styles.cardHeading}><View style={styles.headingCopy}><Text style={styles.cardTitle}>Personal information</Text><Text style={styles.cardSubtitle}>Keep your contact details up to date.</Text></View>{!editing && <Pressable accessibilityRole="button" onPress={() => { setDraft({ ...saved }); setEditing(true); setError(''); setMessage(''); }} style={styles.editButton}><Text style={styles.editText}>Edit profile</Text></Pressable>}</View>
                  <View style={styles.form}>
                    <ProfileField label="Full name" editing={editing} value={draft.fullName} onChangeText={value => update('fullName', value)} placeholder="Enter your full name" autoComplete="name" autoCapitalize="words" maxLength={100} editable={!busy} />
                    <ProfileField label="Email address" editing={editing} value={draft.email} onChangeText={value => update('email', value)} placeholder="you@example.com" autoComplete="email" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} maxLength={254} editable={!busy} />
                    <ProfileField label="Phone number" editing={editing} value={draft.phone} onChangeText={value => update('phone', value)} placeholder="077 123 4567" keyboardType="phone-pad" autoComplete="tel" maxLength={24} editable={!busy} />
                    <ProfileField label="City / town" editing={editing} value={draft.city} onChangeText={value => update('city', value)} placeholder="e.g. Colombo" autoCapitalize="words" maxLength={100} editable={!busy} />
                    <ProfileField label="Service address" editing={editing} value={draft.address} onChangeText={value => update('address', value)} placeholder="House number, street and area" autoComplete="street-address" multiline maxLength={300} editable={!busy} />
                  </View>
                  {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
                  {!!message && <Text accessibilityLiveRegion="polite" style={styles.success}>{message}</Text>}
                  {editing && <View style={styles.buttons}><Pressable accessibilityRole="button" disabled={busy} onPress={() => { setDraft({ ...saved }); setEditing(false); setError(''); }} style={[styles.cancelButton, busy && styles.disabled]}><Text style={styles.cancelText}>Cancel</Text></Pressable><Pressable accessibilityRole="button" accessibilityState={{ busy }} disabled={busy} onPress={() => { void save(); }} style={[styles.primaryButton, styles.saveButton, busy && styles.disabled]}>{busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryText}>Save changes</Text>}</Pressable></View>}
                </View>
                <View style={styles.deviceNote}><ServiceIcon name="check" size={19} color="#16796B" /><View style={styles.headingCopy}><Text style={styles.noteTitle}>Saved on this device</Text><Text style={styles.noteText}>Your profile stays here when you reopen the app. It won’t sync to other devices or change a Firebase account.</Text></View></View>
                {user && <Pressable accessibilityRole="button" disabled={busy} onPress={() => { void signOut(); }} style={styles.signOutButton}><Text style={styles.signOutText}>Sign out</Text></Pressable>}
              </View>
            </View>}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
