import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'body-fat-calculator',
  name: 'Body Fat Calculator',
  description: 'Estimate body fat percentage with the U.S. Navy method.',
  longDescription: 'A quick body fat estimate using height, waist, neck (and hip for women) measurements. The body fat calculator applies the U.S. Navy formula.',
  category: 'calculators',
  keywords: ['body fat calculator', 'body fat percentage', 'navy body fat', 'body fat estimate'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['Estimated %', 'Navy method', 'No upload'],
  relatedTools: [],
  howTo: ['Enter your values in the fields above.', 'The result updates instantly.', 'Adjust inputs to compare scenarios.'],
  addedAt: '2026-07-21',

  faqs: [
    { q: 'Is Body Fat Calculator free?', a: 'Yes, every calculator on Offline ToolHub is free.' },
    { q: 'Is my data stored?', a: 'No. Calculations happen instantly in your browser and nothing is saved.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
    { q: 'Does it work on mobile?', a: 'Yes. Body Fat Calculator runs in any modern browser, including phones.' },
  ],
};