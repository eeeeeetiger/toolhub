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
};
