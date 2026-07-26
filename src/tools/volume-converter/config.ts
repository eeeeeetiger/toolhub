import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'volume-converter',
  name: 'Volume Converter',
  description: 'Convert liters, gallons, milliliters, cups and more — instantly, in your browser.',
  longDescription:
    'Convert volume between liters, milliliters, cubic meters, US gallons, quarts, pints, cups, fluid ounces and cubic feet. Live results, fully local.',
  category: 'converters',
  keywords: ['volume converter', 'liters to gallons', 'ml to oz', 'cups to liters'],
  icon: 'Ruler',
  isClientOnly: true,
  features: ['9 units', 'Instant', 'Local only'],
  relatedTools: ['area-converter', 'data-converter'],
};
