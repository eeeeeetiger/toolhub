import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'chmod-calculator',
  name: 'Chmod Calculator',
  description: 'Convert between numeric and symbolic file permissions.',
  longDescription: 'Type 755 or rwxr-xr-x and see the other form plus the owner/group/other breakdown. Pure client-side.',
  category: 'developer',
  keywords: ['chmod calculator', 'file permissions', 'rwx converter', 'chmod 755'],
  icon: 'ShieldCheck',
  isClientOnly: true,
  features: ['Octal ⇄ symbolic', 'Per-class view', 'Instant'],
  relatedTools: ['cron-parser', 'sql-formatter', 'jwt-generator'],

  howTo: [
    'Open Chmod Calculator in your browser — no install, no signup.',
    'Paste your input (code, query, or value) into the box.',
    'See the formatted, decoded, or generated result instantly, computed locally on your device.',
  ],
  faqs: [
    { q: 'Is Chmod Calculator free?', a: 'Yes, Chmod Calculator is 100% free and runs entirely in your browser.' },
    { q: 'Is my data sent anywhere?', a: 'No. Everything is processed locally on your device; nothing is uploaded.' },
    { q: 'Do I need to install anything?', a: 'No. Chmod Calculator runs in any modern browser, no installation or signup required.' },
    { q: 'Is it safe for private code?', a: 'Yes. Your input stays in your browser and is never stored or transmitted.' },
  ],
};