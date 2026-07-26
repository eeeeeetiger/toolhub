import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'weight-converter',
  name: 'Weight Converter',
  description: 'Convert kilograms, pounds, ounces, grams and more — instantly, in your browser.',
  longDescription:
    'Convert weights between kilograms, grams, milligrams, metric tons, pounds, ounces and stones with live results. The Weight Converter runs entirely in your browser, no upload required.',
  category: 'converters',
  keywords: ['weight converter', 'kg to lbs', 'pounds to kg', 'ounces to grams'],
  icon: 'Ruler',
  isClientOnly: true,
  features: ['7 units', 'Instant', 'Local only'],
  relatedTools: ['length-converter', 'data-converter'],
};
