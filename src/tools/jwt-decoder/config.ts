import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'jwt-decoder',
  name: 'JWT Decoder',
  description:
    'Decode JSON Web Tokens (JWT) and inspect the header and payload. No verification, fully client-side.',
  longDescription:
    'JWT Decoder parses a JSON Web Token and shows its decoded header and payload as readable JSON. It does not verify signatures — it is meant for inspecting tokens during development and debugging. Paste a token, and the three parts (header, payload, signature) are split and decoded instantly in your browser.',
  category: 'developer',
  keywords: ['jwt decoder', 'decode jwt', 'jwt parser', 'json web token decoder', 'inspect jwt'],
  icon: 'Code',
  isClientOnly: true,
  features: ['Decode header & payload', 'Pretty JSON', 'No signature check', 'Private & instant'],
  relatedTools: ['base64', 'json-formatter'],

  howTo: [
    'Open JWT Decoder in your browser — no install, no signup.',
    'Paste your input (code, query, or value) into the box.',
    'See the formatted, decoded, or generated result instantly, computed locally on your device.',
  ],
  faqs: [
    { q: 'Is JWT Decoder free?', a: 'Yes, JWT Decoder is 100% free and runs entirely in your browser.' },
    { q: 'Is my data sent anywhere?', a: 'No. Everything is processed locally on your device; nothing is uploaded.' },
    { q: 'Do I need to install anything?', a: 'No. JWT Decoder runs in any modern browser, no installation or signup required.' },
    { q: 'Is it safe for private code?', a: 'Yes. Your input stays in your browser and is never stored or transmitted.' },
  ],
};