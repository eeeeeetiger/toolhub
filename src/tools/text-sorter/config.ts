import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'text-sorter',
  name: 'Sort Text Lines',
  description: 'Sort lines alphabetically and remove duplicates in your browser.',
  longDescription: 'Sort a list of lines A→Z or Z→A, optionally de-duplicate and drop blank lines. Runs locally — your text never leaves the page.',
  category: 'text',
  keywords: ['sort text', 'sort lines', 'alphabetize list', 'remove duplicate lines'],
  icon: 'ListOrdered',
  isClientOnly: true,
  features: ['A→Z / Z→A', 'De-duplicate', 'Drop blanks'],
  relatedTools: ['find-replace', 'text-reverser'],

  howTo: [
    'Open Sort Text Lines in your browser.',
    'Paste or type your text into the box.',
    'Get the result instantly — your text stays on your device.',
  ],
  faqs: [
    { q: 'Is Sort Text Lines free?', a: 'Yes, it is free and private.' },
    { q: 'Is my text uploaded?', a: 'No. Your text stays on your device and is processed locally.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work with large text?', a: 'Yes. Processing happens in your browser, so your text never leaves your computer.' },
  ],
};