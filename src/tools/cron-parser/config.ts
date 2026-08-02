import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'cron-parser',
  name: 'Cron Parser',
  description: 'Explain a cron expression and preview its next run times.',
  longDescription: 'Paste a cron schedule and get a plain-English description plus the next few execution times. Runs entirely in your browser.',
  category: 'developer',
  keywords: ['cron parser', 'cron expression', 'crontab explain', 'cron to english'],
  icon: 'Clock',
  isClientOnly: true,
  features: ['Human-readable', 'Next runs', 'Local'],
  relatedTools: ['chmod-calculator', 'sql-formatter', 'jwt-generator'],

  howTo: [
    'Open Cron Parser in your browser — no install, no signup.',
    'Paste your input (code, query, or value) into the box.',
    'See the formatted, decoded, or generated result instantly, computed locally on your device.',
  ],
  faqs: [
    { q: 'Is Cron Parser free?', a: 'Yes, Cron Parser is 100% free and runs entirely in your browser.' },
    { q: 'Is my data sent anywhere?', a: 'No. Everything is processed locally on your device; nothing is uploaded.' },
    { q: 'Do I need to install anything?', a: 'No. Cron Parser runs in any modern browser, no installation or signup required.' },
    { q: 'Is it safe for private code?', a: 'Yes. Your input stays in your browser and is never stored or transmitted.' },
  ],
};