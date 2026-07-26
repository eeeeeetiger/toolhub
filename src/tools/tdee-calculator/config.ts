import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'tdee-calculator',
  name: 'TDEE Calculator',
  description: 'Estimate your daily calorie needs (BMR and TDEE).',
  longDescription: 'Find how many calories you burn each day. The TDEE calculator uses the Mifflin-St Jeor formula for BMR and activity level for total daily energy expenditure.',
  category: 'calculators',
  keywords: ['tdee calculator', 'bmr calculator', 'calorie needs', 'maintenance calories'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['BMR', 'TDEE', 'Goal calories'],
  relatedTools: [],
  howTo: ['Enter your values in the fields above.', 'The result updates instantly.', 'Adjust inputs to compare scenarios.'],
  addedAt: '2026-07-21',
};
