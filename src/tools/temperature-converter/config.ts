import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'temperature-converter',
  name: 'Temperature Converter',
  description: 'Convert Celsius, Fahrenheit and Kelvin — instantly, in your browser.',
  longDescription:
    'Convert temperatures between Celsius, Fahrenheit and Kelvin with live results. The Temperature Converter runs entirely in your browser, so your values never leave the device.',
  category: 'converters',
  keywords: ['temperature converter', 'celsius to fahrenheit', 'fahrenheit to celsius', 'celsius to kelvin'],
  icon: 'Ruler',
  isClientOnly: true,
  features: ['°C / °F / K', 'Instant', 'Local only'],
  relatedTools: ['length-converter'],
};
