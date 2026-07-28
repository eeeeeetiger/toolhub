import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'text-cleaner',
  name: 'Text Cleaner',
  description:
    'Tidy up messy copy: trim spaces, remove extra blank lines, normalize quotes and dashes — free and instant.',
  longDescription:
    'Paste messy text and clean it in one click. Text Cleaner trims leading/trailing whitespace on every line, collapses repeated blank lines, converts smart quotes and fancy dashes to plain ASCII, and optionally strips all line breaks into a single paragraph. Everything runs locally — your text never leaves the browser.',
  category: 'text',
  keywords: ['clean text online', 'remove extra spaces', 'normalize quotes', 'strip blank lines', 'text formatter'],
  icon: 'Type',
  isClientOnly: true,
  features: ['Trim spaces', 'Strip blank lines', 'ASCII quotes', 'Live preview'],
  relatedTools: ['case-converter', 'word-counter'],
};
