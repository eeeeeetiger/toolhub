import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'savings-goal-calculator',
  name: 'Savings Goal Calculator',
  description: 'See how much to save each month to hit a savings goal.',
  longDescription: 'Plan a savings target. The savings goal calculator works out the monthly contribution needed, accounting for current savings and expected return.',
  category: 'calculators',
  keywords: ['savings goal calculator', 'savings calculator', 'monthly savings', 'save for goal'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['Monthly to save', 'Future value', 'No upload'],
  relatedTools: [],
  howTo: ['Enter your values in the fields above.', 'The result updates instantly.', 'Adjust inputs to compare scenarios.'],
  addedAt: '2026-07-21',
};
