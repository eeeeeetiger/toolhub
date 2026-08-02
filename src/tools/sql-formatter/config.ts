import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'sql-formatter',
  name: 'SQL Formatter',
  description: 'Pretty-print and format messy SQL queries.',
  longDescription: 'Paste a single-line or ugly SQL statement and get a readable, keyword-aligned version. Runs locally in your browser.',
  category: 'developer',
  keywords: ['sql formatter', 'format sql', 'pretty sql', 'beautify sql'],
  icon: 'Database',
  isClientOnly: true,
  features: ['Keyword layout', 'Readable', 'Local'],
  relatedTools: ['cron-parser', 'chmod-calculator', 'jwt-generator'],

  howTo: [
    'Open SQL Formatter in your browser — no install, no signup.',
    'Paste your input (code, query, or value) into the box.',
    'See the formatted, decoded, or generated result instantly, computed locally on your device.',
  ],
  faqs: [
    { q: 'Is SQL Formatter free?', a: 'Yes, SQL Formatter is 100% free and runs entirely in your browser.' },
    { q: 'Is my data sent anywhere?', a: 'No. Everything is processed locally on your device; nothing is uploaded.' },
    { q: 'Do I need to install anything?', a: 'No. SQL Formatter runs in any modern browser, no installation or signup required.' },
    { q: 'Is it safe for private code?', a: 'Yes. Your input stays in your browser and is never stored or transmitted.' },
  ],
};