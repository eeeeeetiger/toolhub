import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'pregnancy-due-date-calculator',
  name: 'Pregnancy Due Date Calculator',
  description: 'Estimate your due date from the first day of your last period.',
  longDescription: 'Get an estimated due date and conception window. The pregnancy due date calculator adds 280 days to your last period date.',
  category: 'calculators',
  keywords: ['due date calculator', 'pregnancy calculator', 'estimated due date', 'baby due date'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['Due date', 'Conception', 'No upload'],
  relatedTools: [],
  howTo: ['Enter your values in the fields above.', 'The result updates instantly.', 'Adjust inputs to compare scenarios.'],
  addedAt: '2026-07-21',
};
