import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'json-formatter',
  name: 'JSON Formatter',
  description:
    'Format, validate and minify JSON with syntax error highlighting. Free online tool for developers.',
  longDescription:
    'Paste your JSON to format it with proper indentation, validate its structure, or minify it for production. JSON Formatter shows clear error messages with line numbers when input is invalid, and supports one-click copy of the result. Everything runs in your browser — ideal for debugging APIs and configuring data files.',
  category: 'developer',
  keywords: ['json formatter', 'json validator', 'json beautifier', 'minify json', 'format json online', 'json parser'],
  icon: 'Code',
  isClientOnly: true,
  features: ['Format & beautify', 'Validate with errors', 'Minify', 'Copy result'],
  relatedTools: ['base64', 'jwt-decoder'],

  howTo: [
    'Open JSON Formatter in your browser — no install, no signup.',
    'Paste your input (code, query, or value) into the box.',
    'See the formatted, decoded, or generated result instantly, computed locally on your device.',
  ],
  faqs: [
    { q: 'Is JSON Formatter free?', a: 'Yes, JSON Formatter is 100% free and runs entirely in your browser.' },
    { q: 'Is my data sent anywhere?', a: 'No. Everything is processed locally on your device; nothing is uploaded.' },
    { q: 'Do I need to install anything?', a: 'No. JSON Formatter runs in any modern browser, no installation or signup required.' },
    { q: 'Is it safe for private code?', a: 'Yes. Your input stays in your browser and is never stored or transmitted.' },
  ],
};