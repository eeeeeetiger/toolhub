import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'readability-analyzer',
  name: 'Readability Analyzer',
  description:
    'Check the Flesch reading-ease score, grade level and sentence stats of your English text — free and instant.',
  longDescription:
    'Paste any English text to see how easy it is to read. Readability Analyzer computes the Flesch Reading Ease score (0–100, higher is easier), the Flesch–Kincaid grade level, plus average sentence length, average syllables per word and total word/syllable counts. Great for tuning blog posts, docs and essays toward your audience.',
  category: 'text',
  keywords: ['flesch reading ease', 'readability score', 'grade level checker', 'reading difficulty', 'readability analyzer'],
  icon: 'Type',
  isClientOnly: true,
  features: ['Flesch score', 'Grade level', 'Sentence stats', 'Difficulty band'],
  relatedTools: ['word-counter', 'reading-time', 'text-cleaner'],

  howTo: [
    'Open Readability Analyzer in your browser.',
    'Paste or type your text into the box.',
    'Get the result instantly — your text stays on your device.',
  ],
  faqs: [
    { q: 'Is Readability Analyzer free?', a: 'Yes, it is free and private.' },
    { q: 'Is my text uploaded?', a: 'No. Your text stays on your device and is processed locally.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work with large text?', a: 'Yes. Processing happens in your browser, so your text never leaves your computer.' },
  ],
};