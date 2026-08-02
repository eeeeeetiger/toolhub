import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'uuid-generator',
  name: 'UUID Generator',
  description:
    'Generate RFC-4122 version 4 UUIDs in bulk. Create one or thousands of unique identifiers instantly.',
  longDescription:
    'UUID Generator creates cryptographically strong random UUIDs (v4) using your browser’s crypto module. Set how many you need, generate them in one click, and copy the whole list for use as database keys, request IDs or test fixtures. No server, no tracking.',
  category: 'developer',
  keywords: ['uuid generator', 'generate uuid', 'uuid v4', 'random uuid', 'uuid online'],
  icon: 'Code',
  isClientOnly: true,
  features: ['RFC-4122 v4', 'Bulk generation', 'Uppercase option', 'Copy all'],
  relatedTools: ['base64', 'jwt-decoder'],

  howTo: [
    'Open UUID Generator in your browser — no install, no signup.',
    'Paste your input (code, query, or value) into the box.',
    'See the formatted, decoded, or generated result instantly, computed locally on your device.',
  ],
  faqs: [
    { q: 'Is UUID Generator free?', a: 'Yes, UUID Generator is 100% free and runs entirely in your browser.' },
    { q: 'Is my data sent anywhere?', a: 'No. Everything is processed locally on your device; nothing is uploaded.' },
    { q: 'Do I need to install anything?', a: 'No. UUID Generator runs in any modern browser, no installation or signup required.' },
    { q: 'Is it safe for private code?', a: 'Yes. Your input stays in your browser and is never stored or transmitted.' },
  ],
};