import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/features/auth/context/AuthContext';

export default function EntryRedirect() {
  const { user, profile, loading, authenticating, error } = useAuth();
  if (loading || authenticating) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator accessibilityLabel="Preparing your account" color="#2563EB" /></View>;
  if (!user || !profile?.isActive || error) return <Redirect href="/(auth)/login" />;
  return <Redirect href={profile.role === 'provider' ? '/(provider)' : '/(customer)'} />;
}
