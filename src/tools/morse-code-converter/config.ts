import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'morse-code-converter',
  name: 'Morse Code Converter',
  description: 'Convert text to Morse code and back.',
  longDescription: 'Translate words into Morse code dots and dashes, or decode a Morse string back into text. Pure client-side fun and utility.',
  category: 'text',
  keywords: ['morse code', 'text to morse', 'morse decoder', 'morse translator'],
  icon: 'Radio',
  isClientOnly: true,
  features: ['Text → Morse', 'Morse → text', 'Local'],
  relatedTools: ['base-converter', 'text-reverser', 'html-entity-converter'],

  howTo: [
    'Open Morse Code Converter in your browser.',
    'Paste or type your text into the box.',
    'Get the result instantly — your text stays on your device.',
  ],
  faqs: [
    { q: 'Is Morse Code Converter free?', a: 'Yes, it is free and private.' },
    { q: 'Is my text uploaded?', a: 'No. Your text stays on your device and is processed locally.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work with large text?', a: 'Yes. Processing happens in your browser, so your text never leaves your computer.' },
  ],
};