import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'timezone-converter',
  name: 'Time Zone Converter',
  description: 'See any date and time across major world time zones.',
  longDescription: 'Enter a date and time and instantly see how it maps to New York, London, Tokyo, Sydney and more. Uses your browser’s built-in Intl — fully local.',
  category: 'utility',
  keywords: ['time zone converter', 'world clock', 'convert time zones', 'timezone'],
  icon: 'Globe',
  isClientOnly: true,
  features: ['9 major zones', 'Current time', 'Local'],
  relatedTools: ['timestamp-converter', 'hash-generator', 'lorem-ipsum'],

  howTo: [
    'Open Time Zone Converter in your browser.',
    'Add your input or file.',
    'Get the result instantly — processed locally, nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is Time Zone Converter free?', a: 'Yes, Offline ToolHub tools are free and private.' },
    { q: 'Is my data uploaded?', a: 'No. Processing happens locally in your browser.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work offline?', a: 'Once loaded, Time Zone Converter runs entirely on your device.' },
  ],
};