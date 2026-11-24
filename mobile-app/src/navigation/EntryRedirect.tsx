import { Redirect } from 'expo-router';
import { useAuth } from '@/features/auth/context/AuthContext';

export default function Index() {
  const { user } = useAuth();
  return <Redirect href={user ? '/(customer)' : '/(auth)/login'} />;
}
