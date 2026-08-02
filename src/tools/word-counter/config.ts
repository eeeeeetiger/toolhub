import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'word-counter',
  name: 'Word Counter',
  description:
    'Count words, characters, sentences and lines in your text with reading time and keyword density — free and instant.',
  longDescription:
    'Paste or type any text to get an instant breakdown of words, characters (with and without spaces), sentences, paragraphs and lines. Word Counter also estimates reading time and shows the most frequent words, making it ideal for hitting essay limits, optimizing blog post length and improving readability.',
  category: 'text',
  keywords: ['word counter', 'character counter', 'count words online', 'reading time calculator', 'word count tool'],
  icon: 'Type',
  isClientOnly: true,
  features: ['Words & characters', 'Sentences & lines', 'Reading time', 'Keyword density'],
  relatedTools: ['case-converter', 'slug-generator'],

  howTo: [
    'Open Word Counter in your browser.',
    'Paste or type your text into the box.',
    'Get the result instantly — your text stays on your device.',
  ],
  faqs: [
    { q: 'Is Word Counter free?', a: 'Yes, it is free and private.' },
    { q: 'Is my text uploaded?', a: 'No. Your text stays on your device and is processed locally.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work with large text?', a: 'Yes. Processing happens in your browser, so your text never leaves your computer.' },
  ],
};