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

  howTo: [
    'Open Emoji & Symbol Picker in your browser.',
    'Add your input or file.',
    'Get the result instantly — processed locally, nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is Emoji & Symbol Picker free?', a: 'Yes, Offline ToolHub tools are free and private.' },
    { q: 'Is my data uploaded?', a: 'No. Processing happens locally in your browser.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work offline?', a: 'Once loaded, Emoji & Symbol Picker runs entirely on your device.' },
  ],
};