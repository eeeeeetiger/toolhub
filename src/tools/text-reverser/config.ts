import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'text-reverser',
  name: 'Text Reverser',
  description: 'Reverse characters, words or lines of text.',
  longDescription: 'Flip a string backwards by characters, reverse the order of words, or invert the sequence of lines. Runs locally in your browser.',
  category: 'text',
  keywords: ['reverse text', 'backwards text', 'reverse words', 'reverse lines'],
  icon: 'FlipHorizontal2',
  isClientOnly: true,
  features: ['Chars / words / lines', 'Instant', 'Private'],
  relatedTools: ['text-sorter', 'morse-code-converter', 'find-replace'],

  howTo: [
    'Open Text Reverser in your browser.',
    'Paste or type your text into the box.',
    'Get the result instantly — your text stays on your device.',
  ],
  faqs: [
    { q: 'Is Text Reverser free?', a: 'Yes, it is free and private.' },
    { q: 'Is my text uploaded?', a: 'No. Your text stays on your device and is processed locally.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work with large text?', a: 'Yes. Processing happens in your browser, so your text never leaves your computer.' },
  ],
};