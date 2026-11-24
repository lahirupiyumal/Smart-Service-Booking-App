import { useLocalSearchParams } from 'expo-router';
import { PlaceholderScreen } from '@/components/common/PlaceholderScreen';
export default function Screen() { const { id } = useLocalSearchParams<{ id: string }>(); return <PlaceholderScreen title="Booking details" description={`Preview reference: ${id}`} />; }
