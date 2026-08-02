import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'word-frequency',
  name: 'Word Frequency Counter',
  description: 'Count how often each word appears in your text.',
  longDescription: 'Paste a paragraph and see the most common words ranked by frequency — useful for SEO, essays and analysis. Computed in your browser.',
  category: 'text',
  keywords: ['word frequency', 'word count', 'most common words', 'text analysis'],
  icon: 'BarChart3',
  isClientOnly: true,
  features: ['Top-N ranking', 'Case-insensitive', 'Local'],
  relatedTools: ['text-sorter', 'find-replace'],

  howTo: [
    'Open Word Frequency Counter in your browser.',
    'Paste or type your text into the box.',
    'Get the result instantly — your text stays on your device.',
  ],
  faqs: [
    { q: 'Is Word Frequency Counter free?', a: 'Yes, it is free and private.' },
    { q: 'Is my text uploaded?', a: 'No. Your text stays on your device and is processed locally.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work with large text?', a: 'Yes. Processing happens in your browser, so your text never leaves your computer.' },
  ],
};