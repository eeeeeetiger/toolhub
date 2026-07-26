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
};
