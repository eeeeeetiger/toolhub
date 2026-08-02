import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'area-converter',
  name: 'Area Converter',
  description: 'Convert square meters, feet, kilometers, acres and more — instantly, in your browser.',
  longDescription:
    'Convert area units including square meters, square kilometers, square centimeters, hectares, acres, square feet, square yards and square miles. Live results, fully local.',
  category: 'converters',
  keywords: ['area converter', 'square meters to square feet', 'hectares to acres', 'm2 to ft2'],
  icon: 'Ruler',
  isClientOnly: true,
  features: ['8 units', 'Instant', 'Local only'],
  relatedTools: ['length-converter', 'volume-converter'],

  howTo: [
    'Open Area Converter in your browser.',
    'Enter the value you want to convert.',
    'Pick the units and read the result — calculated instantly on your device.',
  ],
  faqs: [
    { q: 'Is Area Converter free?', a: 'Yes, it is free and runs in your browser.' },
    { q: 'Are my values uploaded?', a: 'No. Conversions are computed locally on your device.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
    { q: 'Can I convert many values at once?', a: 'Enter your values and Area Converter computes the result instantly, all on your device.' },
  ],
};