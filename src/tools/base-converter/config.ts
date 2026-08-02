import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'base-converter',
  name: 'Number Base Converter',
  description: 'Convert numbers between binary, octal, decimal, hex and base 36.',
  longDescription: 'Switch any integer between base 2, 8, 10, 16 and 36 — handy for developers and students. Computed instantly in your browser.',
  category: 'converters',
  keywords: ['base converter', 'binary converter', 'hex converter', 'number base'],
  icon: 'Binary',
  isClientOnly: true,
  features: ['2/8/10/16/36', 'Instant', 'Local'],
  relatedTools: ['html-entity-converter', 'morse-code-converter', 'find-replace'],

  howTo: [
    'Open Number Base Converter in your browser.',
    'Enter the value you want to convert.',
    'Pick the units and read the result — calculated instantly on your device.',
  ],
  faqs: [
    { q: 'Is Number Base Converter free?', a: 'Yes, it is free and runs in your browser.' },
    { q: 'Are my values uploaded?', a: 'No. Conversions are computed locally on your device.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
    { q: 'Can I convert many values at once?', a: 'Enter your values and Number Base Converter computes the result instantly, all on your device.' },
  ],
};