import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'unit-converter',
  name: 'Unit Converter',
  description:
    'Convert length, weight, temperature, area, volume, speed and data units instantly — free online converter.',
  longDescription:
    'A fast, all-in-one unit converter for everyday and technical needs. Switch between metric and imperial units for length, weight, temperature, area, volume, speed, time and digital storage. Just pick a category, enter a value and read the result in every related unit at once — all calculated instantly in your browser.',
  category: 'utility',
  keywords: ['unit converter', 'metric to imperial', 'length converter', 'weight converter', 'temperature converter'],
  icon: 'Ruler',
  isClientOnly: true,
  features: ['8 categories', 'Metric & imperial', 'Instant results', 'No signup'],
  relatedTools: ['calculator', 'timestamp-converter'],

  howTo: [
    'Open Unit Converter in your browser.',
    'Add your input or file.',
    'Get the result instantly — processed locally, nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is Unit Converter free?', a: 'Yes, Offline ToolHub tools are free and private.' },
    { q: 'Is my data uploaded?', a: 'No. Processing happens locally in your browser.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work offline?', a: 'Once loaded, Unit Converter runs entirely on your device.' },
  ],
};