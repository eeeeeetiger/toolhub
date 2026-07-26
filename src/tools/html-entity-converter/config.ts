import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'html-entity-converter',
  name: 'HTML Entity Converter',
  description: 'Encode or decode HTML entities (&, <, >, " …).',
  longDescription: 'Turn special characters into safe HTML entities for the web, or decode entities back into readable text. Runs entirely in your browser.',
  category: 'text',
  keywords: ['html entity encoder', 'html entity decoder', 'encode html', 'decode entities'],
  icon: 'Code2',
  isClientOnly: true,
  features: ['Encode & decode', 'Safe for web', 'Instant'],
  relatedTools: ['find-replace', 'base-converter', 'text-reverser'],
};
