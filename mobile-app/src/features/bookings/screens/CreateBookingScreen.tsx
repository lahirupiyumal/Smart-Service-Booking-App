import { useLocalSearchParams } from 'expo-router';
import { PlaceholderScreen } from '@/components/common/PlaceholderScreen';
import { serviceCategories } from '@/features/services/data/categories';

export default function CreateBookingScreen() {
  const { mainCategory, category } = useLocalSearchParams<{ mainCategory?: string; category?: string }>();
  const group = serviceCategories.find(item => item.name === mainCategory);
  const subcategory = group?.subcategories.find(item => item.name === category);

  return <PlaceholderScreen
    title={subcategory?.name ?? 'Service details'}
    description={subcategory && group
      ? `${group.name} · ${subcategory.name}. Scheduling and booking confirmation are not available yet.`
      : 'Choose a service from Home. Scheduling and booking confirmation are not available yet.'}
  />;
}
