import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'speed-converter',
  name: 'Speed Converter',
  description: 'Convert km/h, mph, m/s, ft/s and knots — instantly, in your browser.',
  longDescription:
    'Convert speed between meters per second, kilometers per hour, miles per hour, feet per second and knots. Live results, fully local.',
  category: 'converters',
  keywords: ['speed converter', 'km/h to mph', 'm/s to mph', 'knots to km/h'],
  icon: 'Ruler',
  isClientOnly: true,
  features: ['5 units', 'Instant', 'Local only'],
  relatedTools: ['length-converter'],

  howTo: [
    'Open Speed Converter in your browser.',
    'Enter the value you want to convert.',
    'Pick the units and read the result — calculated instantly on your device.',
  ],
  faqs: [
    { q: 'Is Speed Converter free?', a: 'Yes, it is free and runs in your browser.' },
    { q: 'Are my values uploaded?', a: 'No. Conversions are computed locally on your device.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
    { q: 'Can I convert many values at once?', a: 'Enter your values and Speed Converter computes the result instantly, all on your device.' },
  ],
};