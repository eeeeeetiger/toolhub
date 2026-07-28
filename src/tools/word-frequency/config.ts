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
};
