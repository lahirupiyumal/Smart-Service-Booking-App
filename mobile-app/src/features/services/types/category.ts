import type { ImageSourcePropType } from 'react-native';
import type { IconName } from '@/components/common/ServiceIcon';

export interface ServiceSubcategory {
  name: string;
  services: string[];
  icon: IconName;
  image?: ImageSourcePropType;
}
export interface ServiceCategory {
  image: ImageSourcePropType;
  id: string;
  name: string;
  icon: IconName;
  subcategories: ServiceSubcategory[];
}
