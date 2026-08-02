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

  howTo: [
    'Open Length Converter in your browser.',
    'Enter the value you want to convert.',
    'Pick the units and read the result — calculated instantly on your device.',
  ],
  faqs: [
    { q: 'Is Length Converter free?', a: 'Yes, it is free and runs in your browser.' },
    { q: 'Are my values uploaded?', a: 'No. Conversions are computed locally on your device.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
    { q: 'Can I convert many values at once?', a: 'Enter your values and Length Converter computes the result instantly, all on your device.' },
  ],
};