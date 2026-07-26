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
};
