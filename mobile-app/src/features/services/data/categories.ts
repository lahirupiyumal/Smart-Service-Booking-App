import type { ServiceCategory } from '../types/category';
import { serviceImages } from './serviceImages';

export const serviceCategories: ServiceCategory[] = [
  {
    image: serviceImages['home-services'], id: 'home', name: 'Home Services', icon: 'home',
    subcategories: [
      { name: 'Cleaning', services: ['House Cleaning', 'Deep Cleaning'], icon: 'clean', image: serviceImages['cleaning'] },
      { name: 'AC Repair', services: ['AC Installation', 'AC Repair'], icon: 'ac', image: serviceImages['ac-repair'] },
      { name: 'Electrical', services: ['Wiring', 'Electrical Repairs'], icon: 'bolt', image: serviceImages['electrical'] },
      { name: 'Plumbing', services: ['Pipe Repair', 'Tap Repair'], icon: 'plumbing', image: serviceImages['plumbing'] },
      { name: 'Painting', services: ['Interior Painting', 'Exterior Painting'], icon: 'paint', image: serviceImages['painting'] },
      { name: 'Gardening', services: ['Home Gardening', 'Lawn Maintenance'], icon: 'garden', image: serviceImages['gardening'] },
      { name: 'Carpentry', services: ['Furniture Repair', 'Woodwork'], icon: 'home', image: serviceImages['carpentry'] },
      { name: 'Construction', services: ['Masonry', 'Roof Repair'], icon: 'home', image: serviceImages['construction'] },
    ],
  },
  {
    image: serviceImages['agricultural-services'], id: 'agricultural', name: 'Agricultural Services', icon: 'garden',
    subcategories: [
      { name: 'Land Preparation', services: ['Ploughing', 'Land Clearing'], icon: 'garden', image: serviceImages['land-preparation'] },
      { name: 'Harvesting', services: ['Crop Harvesting', 'Fruit Picking'], icon: 'garden', image: serviceImages['harvesting'] },
    ],
  },
  {
    image: serviceImages['vehicle-services'], id: 'vehicle', name: 'Vehicle Services', icon: 'car',
    subcategories: [
      { name: 'Vehicle Repair', services: ['Engine Repair', 'General Repairs'], icon: 'car', image: serviceImages['vehicle-repair'] },
      { name: 'Vehicle Servicing', services: ['Oil Change', 'Full Service'], icon: 'car', image: serviceImages['vehicle-servicing'] },
      { name: 'Vehicle Washing', services: ['Car Wash', 'Interior Cleaning'], icon: 'clean', image: serviceImages['vehicle-washing'] },
      { name: 'Tire Services', services: ['Tire Repair', 'Tire Replacement'], icon: 'car', image: serviceImages['tire-services'] },
      { name: 'Battery Services', services: ['Battery Replacement', 'Jump Start'], icon: 'bolt', image: serviceImages['battery-services'] },
      { name: 'Electrical Repair', services: ['Vehicle Wiring', 'Electrical Repairs'], icon: 'bolt', image: serviceImages['vehicle-electrical'] },
      { name: 'Towing', services: ['Emergency Towing', 'Breakdown Assistance'], icon: 'car', image: serviceImages['towing'] },
    ],
  },
];
