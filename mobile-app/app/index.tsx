import { router } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/common/Button';
import { InfoCard } from '@/components/cards/InfoCard';
import { isFirebaseConfigured } from '@/config/env';
export default function Welcome() {
  return <Screen title="Local experts. Less hassle." subtitle="Your home services, together in one place. Built for Sri Lanka.">
    <InfoCard title="Welcome to Smart Service Booking" description="Explore the customer and provider previews while we prepare your marketplace." />
    {!isFirebaseConfigured && <InfoCard title="Firebase setup pending" description="Screen previews work now. Add your Firebase environment variables to enable authentication." />}
    <Button title="Explore customer preview" onPress={() => router.push('/(customer)')} />
    <Button title="Explore provider preview" secondary onPress={() => router.push('/(provider)')} />
    <Button title="Sign in" secondary onPress={() => router.push('/(auth)/login')} />
  </Screen>;
}
