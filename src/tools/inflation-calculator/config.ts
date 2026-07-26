import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'inflation-calculator',
  name: 'Inflation Calculator',
  description: 'See how inflation changes the future cost of money.',
  longDescription: 'Understand purchasing power over time. The inflation calculator shows the future cost of today’s amount at a given inflation rate.',
  category: 'calculators',
  keywords: ['inflation calculator', 'future value inflation', 'purchasing power', 'cost inflation'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['Future cost', 'Lost value', 'No upload'],
  relatedTools: [],
  howTo: ['Enter your values in the fields above.', 'The result updates instantly.', 'Adjust inputs to compare scenarios.'],
  addedAt: '2026-07-21',
};
