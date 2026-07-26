import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'text-sorter',
  name: 'Sort Text Lines',
  description: 'Sort lines alphabetically and remove duplicates in your browser.',
  longDescription: 'Sort a list of lines A→Z or Z→A, optionally de-duplicate and drop blank lines. Runs locally — your text never leaves the page.',
  category: 'text',
  keywords: ['sort text', 'sort lines', 'alphabetize list', 'remove duplicate lines'],
  icon: 'ListOrdered',
  isClientOnly: true,
  features: ['A→Z / Z→A', 'De-duplicate', 'Drop blanks'],
  relatedTools: ['whitespace-cleaner', 'find-replace', 'text-reverser'],
};
