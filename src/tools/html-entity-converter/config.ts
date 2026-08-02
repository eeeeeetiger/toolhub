import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'html-entity-converter',
  name: 'HTML Entity Converter',
  description: 'Encode or decode HTML entities (&, <, >, " …).',
  longDescription: 'Turn special characters into safe HTML entities for the web, or decode entities back into readable text. Runs entirely in your browser.',
  category: 'developer',
  keywords: ['html entity encoder', 'html entity decoder', 'encode html', 'decode entities'],
  icon: 'Code2',
  isClientOnly: true,
  features: ['Encode & decode', 'Safe for web', 'Instant'],
  relatedTools: ['find-replace', 'base-converter', 'text-reverser'],

  howTo: [
    'Open HTML Entity Converter in your browser — no install, no signup.',
    'Paste your input (code, query, or value) into the box.',
    'See the formatted, decoded, or generated result instantly, computed locally on your device.',
  ],
  faqs: [
    { q: 'Is HTML Entity Converter free?', a: 'Yes, HTML Entity Converter is 100% free and runs entirely in your browser.' },
    { q: 'Is my data sent anywhere?', a: 'No. Everything is processed locally on your device; nothing is uploaded.' },
    { q: 'Do I need to install anything?', a: 'No. HTML Entity Converter runs in any modern browser, no installation or signup required.' },
    { q: 'Is it safe for private code?', a: 'Yes. Your input stays in your browser and is never stored or transmitted.' },
  ],
};