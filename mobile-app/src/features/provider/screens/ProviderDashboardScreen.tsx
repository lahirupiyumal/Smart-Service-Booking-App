import { router } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { InfoCard } from '@/components/cards/InfoCard';
import { Button } from '@/components/common/Button';
export default function Overview() { return <Screen title="Your business, organized" subtitle="Provider preview · Manage your services and schedule.">
  <InfoCard title="Ready for your first request" description="Bookings and earnings will appear here once live features are implemented." />
  <Button title="Preview public profile" onPress={() => router.push('/provider/preview')} />
  <Button title="Back to welcome" secondary onPress={() => router.replace('/')} />
</Screen>; }
