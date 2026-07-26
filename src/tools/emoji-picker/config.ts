import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'emoji-picker',
  name: 'Emoji & Symbol Picker',
  description:
    'Browse and copy emojis and special symbols — arrows, currency, math, punctuation and more.',
  longDescription:
    'A fast, searchable picker for emojis and special characters. Find the perfect arrow, currency sign, math symbol or heart in seconds, then click to copy it to your clipboard. Great for captions, documents and code comments. Runs entirely in your browser.',
  category: 'utility',
  keywords: ['emoji picker', 'copy emoji', 'special characters', 'symbol copy', 'unicode symbols'],
  icon: 'Smile',
  isClientOnly: true,
  features: ['Searchable', '12 categories', 'One-click copy', 'Emoji + symbols'],
  relatedTools: ['fancy-text-generator', 'color-picker'],
};
