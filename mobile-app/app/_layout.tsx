import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/contexts/AuthContext';
export default function RootLayout() {
  return <AuthProvider><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="booking/create" options={{ headerShown: true, title: "New booking" }} />
    <Stack.Screen name="booking/[id]" options={{ headerShown: true, title: "Booking details" }} />
    <Stack.Screen name="provider/[id]" options={{ headerShown: true, title: "Provider profile" }} />
    <Stack.Screen name="notifications" options={{ headerShown: true, title: "Notifications" }} />
    <Stack.Screen name="index" /><Stack.Screen name="(auth)" /><Stack.Screen name="(customer)" /><Stack.Screen name="(provider)" />
  </Stack></AuthProvider>;
}
