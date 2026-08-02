import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'jwt-generator',
  name: 'JWT Generator',
  description: 'Create a signed HS256 JWT from header, payload and secret.',
  longDescription: 'Build a JSON Web Token locally: enter the header and payload as JSON, provide a secret, and sign with HMAC-SHA256. Your secret never leaves the browser.',
  category: 'developer',
  keywords: ['jwt generator', 'create jwt', 'sign jwt', 'hs256 token'],
  icon: 'KeyRound',
  isClientOnly: true,
  features: ['HS256 sign', 'Local secret', 'Copy token'],
  relatedTools: ['jwt-decoder', 'base-converter', 'cron-parser'],

  howTo: [
    'Open JWT Generator in your browser — no install, no signup.',
    'Paste your input (code, query, or value) into the box.',
    'See the formatted, decoded, or generated result instantly, computed locally on your device.',
  ],
  faqs: [
    { q: 'Is JWT Generator free?', a: 'Yes, JWT Generator is 100% free and runs entirely in your browser.' },
    { q: 'Is my data sent anywhere?', a: 'No. Everything is processed locally on your device; nothing is uploaded.' },
    { q: 'Do I need to install anything?', a: 'No. JWT Generator runs in any modern browser, no installation or signup required.' },
    { q: 'Is it safe for private code?', a: 'Yes. Your input stays in your browser and is never stored or transmitted.' },
  ],
};