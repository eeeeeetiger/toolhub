import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'length-converter',
  name: 'Length Converter',
  description: 'Convert meters, feet, inches, kilometers, miles and more — instantly, in your browser.',
  longDescription:
    'Switch between length units in a click. The Length Converter handles meters, kilometers, centimeters, millimeters, miles, yards, feet and inches with live results. No upload, no waiting — the math runs locally.',
  category: 'converters',
  keywords: ['length converter', 'meters to feet', 'cm to inches', 'km to miles'],
  icon: 'Ruler',
  isClientOnly: true,
  features: ['8 units', 'Instant', 'Local only'],
  relatedTools: ['weight-converter', 'area-converter'],
};
