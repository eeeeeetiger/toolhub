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

  faqs: [
    { q: 'Is TDEE Calculator free?', a: 'Yes, every calculator on Offline ToolHub is free.' },
    { q: 'Is my data stored?', a: 'No. Calculations happen instantly in your browser and nothing is saved.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
    { q: 'Does it work on mobile?', a: 'Yes. TDEE Calculator runs in any modern browser, including phones.' },
  ],
};