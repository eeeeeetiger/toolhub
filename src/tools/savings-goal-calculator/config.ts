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

  faqs: [
    { q: 'Is Savings Goal Calculator free?', a: 'Yes, every calculator on Offline ToolHub is free.' },
    { q: 'Is my data stored?', a: 'No. Calculations happen instantly in your browser and nothing is saved.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
    { q: 'Does it work on mobile?', a: 'Yes. Savings Goal Calculator runs in any modern browser, including phones.' },
  ],
};