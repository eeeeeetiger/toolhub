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
};
