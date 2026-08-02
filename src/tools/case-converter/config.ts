import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'case-converter',
  name: 'Case Converter',
  description:
    'Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase and snake_case instantly.',
  longDescription:
    'Case Converter transforms your text into any common casing style with a single click. Title Case follows English headline rules (skips short articles, conjunctions and prepositions), and Sentence case capitalizes the first letter of every sentence. Use it to normalize headings, format code identifiers, clean up imported data or prepare social media copy. It runs entirely in your browser, so your text stays private.',
  category: 'text',
  keywords: ['case converter', 'uppercase converter', 'lowercase converter', 'title case', 'sentence case', 'camelcase converter', 'snake case'],
  icon: 'Type',
  isClientOnly: true,
  features: ['UPPERCASE / lowercase', 'Title & Sentence case', 'camelCase / snake_case', 'One-click copy'],
  relatedTools: ['word-counter', 'slug-generator'],

  howTo: [
    'Open Case Converter in your browser.',
    'Paste or type your text into the box.',
    'Get the result instantly — your text stays on your device.',
  ],
  faqs: [
    { q: 'Is Case Converter free?', a: 'Yes, it is free and private.' },
    { q: 'Is my text uploaded?', a: 'No. Your text stays on your device and is processed locally.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work with large text?', a: 'Yes. Processing happens in your browser, so your text never leaves your computer.' },
  ],
};