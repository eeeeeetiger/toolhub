import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'find-replace',
  name: 'Find & Replace',
  description: 'Find and replace text with plain or regex search.',
  longDescription: 'Replace words or patterns across a block of text. Supports regular expressions and case-sensitive matching, all processed in your browser.',
  category: 'text',
  keywords: ['find replace', 'regex replace', 'search and replace', 'text replace'],
  icon: 'Replace',
  isClientOnly: true,
  features: ['Plain or regex', 'Case options', 'Local'],
  relatedTools: ['text-sorter', 'html-entity-converter'],

  howTo: [
    'Open Find & Replace in your browser.',
    'Paste or type your text into the box.',
    'Get the result instantly — your text stays on your device.',
  ],
  faqs: [
    { q: 'Is Find & Replace free?', a: 'Yes, it is free and private.' },
    { q: 'Is my text uploaded?', a: 'No. Your text stays on your device and is processed locally.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work with large text?', a: 'Yes. Processing happens in your browser, so your text never leaves your computer.' },
  ],
};