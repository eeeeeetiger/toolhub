import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'mortgage-calculator',
  name: 'Mortgage Calculator',
  description: 'Estimate your monthly mortgage payment, total interest and total cost — instantly, in your browser.',
  longDescription: 'Plan a home purchase with a clear monthly payment estimate. The mortgage calculator factors in loan amount, interest rate and term to show monthly payment, total interest and total paid. No upload, no signup.',
  category: 'calculators',
  keywords: ['mortgage calculator', 'monthly mortgage payment', 'home loan calculator', 'mortgage payment estimator'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['Monthly payment', 'Total interest', 'No upload'],
  relatedTools: [],
  howTo: ['Enter your values in the fields above.', 'The result updates instantly.', 'Adjust inputs to compare scenarios.'],
  addedAt: '2026-07-21',

  faqs: [
    { q: 'Is Mortgage Calculator free?', a: 'Yes, every calculator on Offline ToolHub is free.' },
    { q: 'Is my data stored?', a: 'No. Calculations happen instantly in your browser and nothing is saved.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
    { q: 'Does it work on mobile?', a: 'Yes. Mortgage Calculator runs in any modern browser, including phones.' },
  ],
};