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
};
