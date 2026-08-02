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

  howTo: [
    'Open Volume Converter in your browser.',
    'Enter the value you want to convert.',
    'Pick the units and read the result — calculated instantly on your device.',
  ],
  faqs: [
    { q: 'Is Volume Converter free?', a: 'Yes, it is free and runs in your browser.' },
    { q: 'Are my values uploaded?', a: 'No. Conversions are computed locally on your device.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
    { q: 'Can I convert many values at once?', a: 'Enter your values and Volume Converter computes the result instantly, all on your device.' },
  ],
};