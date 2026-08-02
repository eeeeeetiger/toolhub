import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'base64',
  name: 'Base64 Encode / Decode',
  description:
    'Encode text to Base64 or decode Base64 back to text instantly in your browser. Supports UTF-8.',
  longDescription:
    'Base64 tool encodes strings to Base64 and decodes Base64 strings back to readable text. It handles UTF-8 correctly, so emojis and non-Latin characters are preserved. Use it for debugging tokens, embedding data URIs or working with APIs — fully client-side and private.',
  category: 'developer',
  keywords: ['base64 encoder', 'base64 decoder', 'encode base64', 'decode base64 online', 'base64 to text'],
  icon: 'Code',
  isClientOnly: true,
  features: ['Encode text', 'Decode Base64', 'UTF-8 safe', 'One-click copy'],
  relatedTools: ['url-encoder', 'jwt-decoder'],

  howTo: [
    'Open Base64 Encode / Decode in your browser — no install, no signup.',
    'Paste your input (code, query, or value) into the box.',
    'See the formatted, decoded, or generated result instantly, computed locally on your device.',
  ],
  faqs: [
    { q: 'Is Base64 Encode / Decode free?', a: 'Yes, Base64 Encode / Decode is 100% free and runs entirely in your browser.' },
    { q: 'Is my data sent anywhere?', a: 'No. Everything is processed locally on your device; nothing is uploaded.' },
    { q: 'Do I need to install anything?', a: 'No. Base64 Encode / Decode runs in any modern browser, no installation or signup required.' },
    { q: 'Is it safe for private code?', a: 'Yes. Your input stays in your browser and is never stored or transmitted.' },
  ],
};