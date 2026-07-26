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
};
