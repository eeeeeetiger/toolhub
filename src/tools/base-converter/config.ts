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
};
