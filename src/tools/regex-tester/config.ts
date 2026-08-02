import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'regex-tester',
  name: 'Regex Tester',
  description:
    'Test regular expressions against any text with live match highlighting and capture groups.',
  longDescription:
    'Regex Tester lets you build and debug regular expressions in real time. Enter a pattern and flags, paste your test string, and see every match highlighted with its capture groups. Great for validating input formats, extracting data and learning regex without leaving your browser.',
  category: 'developer',
  keywords: ['regex tester', 'regular expression tester', 'regex online', 'regex debugger', 'test regex'],
  icon: 'Code',
  isClientOnly: true,
  features: ['Live highlighting', 'Flags support', 'Capture groups', 'Match count'],
  relatedTools: ['json-formatter', 'base64'],

  howTo: [
    'Open Regex Tester in your browser — no install, no signup.',
    'Paste your input (code, query, or value) into the box.',
    'See the formatted, decoded, or generated result instantly, computed locally on your device.',
  ],
  faqs: [
    { q: 'Is Regex Tester free?', a: 'Yes, Regex Tester is 100% free and runs entirely in your browser.' },
    { q: 'Is my data sent anywhere?', a: 'No. Everything is processed locally on your device; nothing is uploaded.' },
    { q: 'Do I need to install anything?', a: 'No. Regex Tester runs in any modern browser, no installation or signup required.' },
    { q: 'Is it safe for private code?', a: 'Yes. Your input stays in your browser and is never stored or transmitted.' },
  ],
};