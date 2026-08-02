import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'url-encoder',
  name: 'URL Encode / Decode',
  description:
    'Encode text for safe use in URLs or decode URL-encoded strings back to readable text.',
  longDescription:
    'URL Encode / Decode converts text to and from percent-encoding so it can be safely used in query strings and paths. It uses the standard encodeURIComponent / decodeURIComponent rules and handles UTF-8, making it handy for building links, debugging APIs and inspecting request parameters.',
  category: 'developer',
  keywords: ['url encoder', 'url decoder', 'encode url', 'decode url online', 'percent encoding'],
  icon: 'Code',
  isClientOnly: true,
  features: ['Encode URI component', 'Decode', 'UTF-8 safe', 'One-click copy'],
  relatedTools: ['base64', 'jwt-decoder'],

  howTo: [
    'Open URL Encode / Decode in your browser — no install, no signup.',
    'Paste your input (code, query, or value) into the box.',
    'See the formatted, decoded, or generated result instantly, computed locally on your device.',
  ],
  faqs: [
    { q: 'Is URL Encode / Decode free?', a: 'Yes, URL Encode / Decode is 100% free and runs entirely in your browser.' },
    { q: 'Is my data sent anywhere?', a: 'No. Everything is processed locally on your device; nothing is uploaded.' },
    { q: 'Do I need to install anything?', a: 'No. URL Encode / Decode runs in any modern browser, no installation or signup required.' },
    { q: 'Is it safe for private code?', a: 'Yes. Your input stays in your browser and is never stored or transmitted.' },
  ],
};