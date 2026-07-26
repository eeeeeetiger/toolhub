import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'retirement-calculator',
  name: 'Retirement Calculator',
  description: 'Project your retirement savings from current age and contributions.',
  longDescription: 'Estimate how much you could have at retirement. The retirement calculator uses your age, current savings, monthly contributions and return rate.',
  category: 'calculators',
  keywords: ['retirement calculator', 'retirement savings', 'pension calculator', 'future savings'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['Years to retire', 'Projected savings', 'No upload'],
  relatedTools: [],
  howTo: ['Enter your values in the fields above.', 'The result updates instantly.', 'Adjust inputs to compare scenarios.'],
  addedAt: '2026-07-21',
};
