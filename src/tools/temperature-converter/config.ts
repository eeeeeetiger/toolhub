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

  howTo: [
    'Open Temperature Converter in your browser.',
    'Enter the value you want to convert.',
    'Pick the units and read the result — calculated instantly on your device.',
  ],
  faqs: [
    { q: 'Is Temperature Converter free?', a: 'Yes, it is free and runs in your browser.' },
    { q: 'Are my values uploaded?', a: 'No. Conversions are computed locally on your device.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
    { q: 'Can I convert many values at once?', a: 'Enter your values and Temperature Converter computes the result instantly, all on your device.' },
  ],
};