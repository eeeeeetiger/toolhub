import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'text-reverser',
  name: 'Text Reverser',
  description: 'Reverse characters, words or lines of text.',
  longDescription: 'Flip a string backwards by characters, reverse the order of words, or invert the sequence of lines. Runs locally in your browser.',
  category: 'text',
  keywords: ['reverse text', 'backwards text', 'reverse words', 'reverse lines'],
  icon: 'FlipHorizontal2',
  isClientOnly: true,
  features: ['Chars / words / lines', 'Instant', 'Private'],
  relatedTools: ['text-sorter', 'morse-code-converter', 'find-replace'],
};
