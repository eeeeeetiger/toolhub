import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'roman-numeral-converter',
  name: 'Roman Numeral Converter',
  description: 'Convert numbers to Roman numerals, Roman to numbers, and between number bases — in your browser.',
  longDescription:
    'A handy converter for Roman numerals and number bases. Turn a number (1–3999) into a Roman numeral, convert Roman back to a number, or switch between binary, octal, decimal and hexadecimal. Fully in your browser, no upload.',
  category: 'converters',
  keywords: ['roman numeral converter', 'roman to number', 'number to roman', 'base converter'],
  icon: 'Ruler',
  isClientOnly: true,
  features: ['Roman ⇄ number', 'Base 2/8/10/16', 'Local only'],
  relatedTools: ['data-converter'],

  howTo: [
    'Open Roman Numeral Converter in your browser.',
    'Enter the value you want to convert.',
    'Pick the units and read the result — calculated instantly on your device.',
  ],
  faqs: [
    { q: 'Is Roman Numeral Converter free?', a: 'Yes, it is free and runs in your browser.' },
    { q: 'Are my values uploaded?', a: 'No. Conversions are computed locally on your device.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
    { q: 'Can I convert many values at once?', a: 'Enter your values and Roman Numeral Converter computes the result instantly, all on your device.' },
  ],
};