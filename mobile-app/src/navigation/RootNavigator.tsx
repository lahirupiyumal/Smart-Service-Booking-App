import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '@/features/auth/context/AuthContext';

function Navigation() {
  const { user, loading } = useAuth();
  if (loading) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F8FD' }}><ActivityIndicator accessibilityLabel="Loading your account" size="large" color="#2563EB" /></View>;
  }
  return <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="index" />
    <Stack.Protected guard={!user}>
      <Stack.Screen name="(auth)" />
    </Stack.Protected>
    <Stack.Screen name="(customer)" />
    <Stack.Protected guard={!!user}>
      <Stack.Screen name="(provider)" />
      <Stack.Screen name="booking/create" options={{ headerShown: true, title: 'New booking' }} />
      <Stack.Screen name="booking/[id]" options={{ headerShown: true, title: 'Booking details' }} />
      <Stack.Screen name="provider/[id]" options={{ headerShown: true, title: 'Provider profile' }} />
      <Stack.Screen name="notifications" options={{ headerShown: true, title: 'Notifications' }} />
    </Stack.Protected>
  </Stack>;
}

export default function RootLayout() {
  return <AuthProvider><StatusBar style="dark" /><Navigation /></AuthProvider>;
}
