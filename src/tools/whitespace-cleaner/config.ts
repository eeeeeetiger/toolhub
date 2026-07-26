import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'whitespace-cleaner',
  name: 'Whitespace Cleaner',
  description: 'Trim, collapse and normalize whitespace in text.',
  longDescription: 'Clean up messy pasted text: trim each line, collapse repeated spaces, drop blank lines and normalize line endings. Runs locally.',
  category: 'text',
  keywords: ['whitespace cleaner', 'trim text', 'clean spaces', 'normalize lines'],
  icon: 'Spacer',
  isClientOnly: true,
  features: ['Trim & collapse', 'Drop blanks', 'CRLF option'],
  relatedTools: ['text-sorter', 'find-replace', 'word-frequency'],
};
