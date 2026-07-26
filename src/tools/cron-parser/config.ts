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
};
