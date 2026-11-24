import { useLocalSearchParams } from 'expo-router';
import { PlaceholderScreen } from '@/components/common/PlaceholderScreen';
import { agriculturalCrops } from '@/features/services/data/agriculturalCrops';
import { serviceCategories } from '@/features/services/data/categories';

export default function CreateBookingScreen() {
  const { mainCategory, category, crop } = useLocalSearchParams<{ mainCategory?: string; category?: string; crop?: string }>();
  const group = serviceCategories.find(item => item.name === mainCategory);
  const subcategory = group?.subcategories.find(item => item.name === category);

  const selectedCrop = group?.id === 'agricultural' ? agriculturalCrops.find(item => item.id === crop) : undefined;

  return <PlaceholderScreen
    title={subcategory?.name ?? 'Service details'}
    description={subcategory && group
      ? `${group.name}${selectedCrop ? ` · ${selectedCrop.name}` : ''} · ${subcategory.name}. Scheduling and booking confirmation are not available yet.`
      : 'Choose a service from Home. Scheduling and booking confirmation are not available yet.'}
  />;
}
