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
export const serviceCategories: ServiceCategory[] = [
  {
    image: require('../../assets/services/home-services.png'), id: 'home', name: 'Home Services', icon: 'home',
    subcategories: [
      { name: 'Cleaning', services: ['House Cleaning', 'Deep Cleaning'], icon: 'clean', image: require('../../assets/services/cleaning.png') },
      { name: 'AC Repair', services: ['AC Installation', 'AC Repair'], icon: 'ac', image: require('../../assets/services/ac-repair.png') },
      { name: 'Electrical', services: ['Wiring', 'Electrical Repairs'], icon: 'bolt', image: require('../../assets/services/electrical.png') },
      { name: 'Plumbing', services: ['Pipe Repair', 'Tap Repair'], icon: 'plumbing', image: require('../../assets/services/plumbing.png') },
      { name: 'Painting', services: ['Interior Painting', 'Exterior Painting'], icon: 'paint', image: require('../../assets/services/painting.png') },
      { name: 'Gardening', services: ['Home Gardening', 'Lawn Maintenance'], icon: 'garden', image: require('../../assets/services/gardening.png') },
      { name: 'Carpentry', services: ['Furniture Repair', 'Woodwork'], icon: 'home', image: require('../../assets/services/carpentry.png') },
      { name: 'Construction', services: ['Masonry', 'Roof Repair'], icon: 'home', image: require('../../assets/services/construction.png') },
    ],
  },
  {
    image: require('../../assets/services/agricultural-services.png'), id: 'agricultural', name: 'Agricultural Services', icon: 'garden',
    subcategories: [
      { name: 'Land Preparation', services: ['Ploughing', 'Land Clearing'], icon: 'garden', image: require('../../assets/services/land-preparation.png') },
      { name: 'Irrigation', services: ['Water Pump', 'Irrigation Systems'], icon: 'plumbing', image: require('../../assets/services/irrigation.png') },
      { name: 'Crop Management', services: ['Fertilizer Application', 'Weed Control'], icon: 'garden', image: require('../../assets/services/crop-management.png') },
      { name: 'Spraying', services: ['Pesticide Spraying', 'Crop Protection'], icon: 'clean', image: require('../../assets/services/spraying.png') },
      { name: 'Harvesting', services: ['Crop Harvesting', 'Fruit Picking'], icon: 'garden', image: require('../../assets/services/harvesting.png') },
      { name: 'Machinery Repair', services: ['Tractor Repair', 'Agricultural Equipment Repair'], icon: 'bolt', image: require('../../assets/services/machinery-repair.png') },
      { name: 'Gardening & Landscaping', services: ['Planting', 'Garden Maintenance'], icon: 'garden', image: require('../../assets/services/landscaping.png') },
    ],
  },
  {
    image: require('../../assets/services/vehicle-services.png'), id: 'vehicle', name: 'Vehicle Services', icon: 'car',
    subcategories: [
      { name: 'Vehicle Repair', services: ['Engine Repair', 'General Repairs'], icon: 'car', image: require('../../assets/services/vehicle-repair.png') },
      { name: 'Vehicle Servicing', services: ['Oil Change', 'Full Service'], icon: 'car', image: require('../../assets/services/vehicle-servicing.png') },
      { name: 'Vehicle Washing', services: ['Car Wash', 'Interior Cleaning'], icon: 'clean', image: require('../../assets/services/vehicle-washing.png') },
      { name: 'Tire Services', services: ['Tire Repair', 'Tire Replacement'], icon: 'car', image: require('../../assets/services/tire-services.png') },
      { name: 'Battery Services', services: ['Battery Replacement', 'Jump Start'], icon: 'bolt', image: require('../../assets/services/battery-services.png') },
      { name: 'Electrical Repair', services: ['Vehicle Wiring', 'Electrical Repairs'], icon: 'bolt', image: require('../../assets/services/vehicle-electrical.png') },
      { name: 'Towing', services: ['Emergency Towing', 'Breakdown Assistance'], icon: 'car', image: require('../../assets/services/towing.png') },
    ],
  },
];
export const categories = serviceCategories.map(category => category.name);
