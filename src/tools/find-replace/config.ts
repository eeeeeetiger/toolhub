import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'find-replace',
  name: 'Find & Replace',
  description: 'Find and replace text with plain or regex search.',
  longDescription: 'Replace words or patterns across a block of text. Supports regular expressions and case-sensitive matching, all processed in your browser.',
  category: 'text',
  keywords: ['find replace', 'regex replace', 'search and replace', 'text replace'],
  icon: 'Replace',
  isClientOnly: true,
  features: ['Plain or regex', 'Case options', 'Local'],
  relatedTools: ['text-sorter', 'whitespace-cleaner', 'html-entity-converter'],
};
