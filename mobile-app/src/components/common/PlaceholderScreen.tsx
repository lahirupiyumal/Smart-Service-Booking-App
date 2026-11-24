import { Screen } from '@/components/layout/Screen';
import { InfoCard } from '@/components/cards/InfoCard';
export function PlaceholderScreen({ title, description }: { title: string; description: string }) {
  return <Screen title={title} subtitle={description}><InfoCard title="Coming next" description="This screen is ready for the next development phase. No live records are shown yet." /></Screen>;
}
