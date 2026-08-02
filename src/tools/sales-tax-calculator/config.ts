import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'sales-tax-calculator',
  name: 'Sales Tax Calculator',
  description: 'Add sales tax to any amount in one tap — perfect for shopping and invoicing.',
  longDescription: 'Quickly work out how much sales tax to add to a price. The sales tax calculator shows the tax and the final total for any rate and amount.',
  category: 'calculators',
  keywords: ['sales tax calculator', 'calculate sales tax', 'tax added to price', 'sales tax estimator'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['Tax amount', 'Final total', 'Any rate'],
  relatedTools: [],
  howTo: ['Enter your values in the fields above.', 'The result updates instantly.', 'Adjust inputs to compare scenarios.'],
  addedAt: '2026-07-21',

  faqs: [
    { q: 'Is Sales Tax Calculator free?', a: 'Yes, every calculator on Offline ToolHub is free.' },
    { q: 'Is my data stored?', a: 'No. Calculations happen instantly in your browser and nothing is saved.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
    { q: 'Does it work on mobile?', a: 'Yes. Sales Tax Calculator runs in any modern browser, including phones.' },
  ],
};