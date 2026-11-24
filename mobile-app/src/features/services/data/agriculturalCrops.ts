import { serviceImages } from './serviceImages';

export const agriculturalCrops = [
  { id: 'vee', name: 'Vee', image: serviceImages.vee },
  { id: 'tea', name: 'Tea', image: serviceImages.tea },
] as const;

export type AgriculturalCropId = typeof agriculturalCrops[number]['id'];
