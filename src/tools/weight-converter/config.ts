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

  howTo: [
    'Open Weight Converter in your browser.',
    'Enter the value you want to convert.',
    'Pick the units and read the result — calculated instantly on your device.',
  ],
  faqs: [
    { q: 'Is Weight Converter free?', a: 'Yes, it is free and runs in your browser.' },
    { q: 'Are my values uploaded?', a: 'No. Conversions are computed locally on your device.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
    { q: 'Can I convert many values at once?', a: 'Enter your values and Weight Converter computes the result instantly, all on your device.' },
  ],
};