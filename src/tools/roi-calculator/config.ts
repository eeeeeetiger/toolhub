import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'roi-calculator',
  name: 'ROI Calculator',
  description: 'Measure the return on any investment as a percentage and profit figure.',
  longDescription: 'See how profitable an investment is. The ROI calculator returns the percentage return and absolute profit from an initial amount and final value.',
  category: 'calculators',
  keywords: ['roi calculator', 'return on investment', 'investment calculator', 'profit calculator'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['ROI %', 'Profit', 'Instant'],
  relatedTools: [],
  howTo: ['Enter your values in the fields above.', 'The result updates instantly.', 'Adjust inputs to compare scenarios.'],
  addedAt: '2026-07-21',

  faqs: [
    { q: 'Is ROI Calculator free?', a: 'Yes, every calculator on Offline ToolHub is free.' },
    { q: 'Is my data stored?', a: 'No. Calculations happen instantly in your browser and nothing is saved.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
    { q: 'Does it work on mobile?', a: 'Yes. ROI Calculator runs in any modern browser, including phones.' },
  ],
};