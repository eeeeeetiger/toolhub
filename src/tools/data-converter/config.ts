import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'data-converter',
  name: 'Data Converter',
  description: 'Convert bytes, KB, MB, GB, TB and more — instantly, in your browser.',
  longDescription:
    'Convert data sizes between bits, bytes, kilobytes, megabytes, gigabytes, terabytes and petabytes. Great for checking file sizes and storage. Live results, fully local.',
  category: 'converters',
  keywords: ['data converter', 'mb to gb', 'bytes to mb', 'kb to mb', 'gb to tb'],
  icon: 'Ruler',
  isClientOnly: true,
  features: ['7 units', 'Instant', 'Local only'],
  relatedTools: ['volume-converter', 'weight-converter'],

  howTo: [
    'Open Data Converter in your browser.',
    'Enter the value you want to convert.',
    'Pick the units and read the result — calculated instantly on your device.',
  ],
  faqs: [
    { q: 'Is Data Converter free?', a: 'Yes, it is free and runs in your browser.' },
    { q: 'Are my values uploaded?', a: 'No. Conversions are computed locally on your device.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
    { q: 'Can I convert many values at once?', a: 'Enter your values and Data Converter computes the result instantly, all on your device.' },
  ],
};