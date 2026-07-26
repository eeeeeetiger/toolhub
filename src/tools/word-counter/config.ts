import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'word-counter',
  name: 'Word Counter',
  description:
    'Count words, characters, sentences and lines in your text with reading time and keyword density — free and instant.',
  longDescription:
    'Paste or type any text to get an instant breakdown of words, characters (with and without spaces), sentences, paragraphs and lines. Word Counter also estimates reading time and shows the most frequent words, making it ideal for hitting essay limits, optimizing blog post length and improving readability.',
  category: 'writing',
  keywords: ['word counter', 'character counter', 'count words online', 'reading time calculator', 'word count tool'],
  icon: 'Type',
  isClientOnly: true,
  features: ['Words & characters', 'Sentences & lines', 'Reading time', 'Keyword density'],
  relatedTools: ['case-converter', 'slug-generator'],
};
