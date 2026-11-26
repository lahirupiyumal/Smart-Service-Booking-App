import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '@/features/auth/context/AuthContext';

function Navigation() {
  const { user, profile, loading, initializing, authenticating, error } = useAuth();
  const signedIn = !!user && !!profile?.isActive && !loading && !error && !authenticating;
  if (initializing) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F8FD' }}><ActivityIndicator accessibilityLabel="Loading your account" size="large" color="#2563EB" /></View>;
  }
  return <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="index" />
    <Stack.Protected guard={!signedIn}>
      <Stack.Screen name="(auth)" />
    </Stack.Protected>
    <Stack.Protected guard={signedIn}>
      <Stack.Screen name="(customer)" />
      <Stack.Screen name="booking/create" options={{ headerShown: true, title: 'Service details' }} />
      <Stack.Screen name="booking/[id]" options={{ headerShown: true, title: 'Booking details' }} />
      <Stack.Screen name="provider/[id]" options={{ headerShown: true, title: 'Provider profile' }} />
      <Stack.Screen name="notifications" options={{ headerShown: true, title: 'Notifications' }} />
    </Stack.Protected>
    <Stack.Protected guard={signedIn && profile?.role === 'provider'}>
      <Stack.Screen name="(provider)" />
    </Stack.Protected>
  </Stack>;
}

export default function RootLayout() {
  return <AuthProvider><StatusBar style="dark" /><Navigation /></AuthProvider>;
}
