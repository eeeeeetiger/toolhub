import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'calorie-calculator',
  name: 'Calorie Calculator',
  description: 'Work out the calories to maintain, lose or gain weight.',
  longDescription: 'Plan your diet with daily calorie targets. The calorie calculator estimates maintenance and adjusted intakes for weight goals.',
  category: 'calculators',
  keywords: ['calorie calculator', 'daily calories', 'weight loss calories', 'calorie intake'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['Maintain', 'Lose', 'Gain'],
  relatedTools: [],
  howTo: ['Enter your values in the fields above.', 'The result updates instantly.', 'Adjust inputs to compare scenarios.'],
  addedAt: '2026-07-21',
};
