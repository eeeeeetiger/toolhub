import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'break-even-calculator',
  name: 'Break-Even Calculator',
  description: 'Find how many units you must sell to cover costs.',
  longDescription: 'Work out the break-even point for a product or business. Enter fixed costs, price and unit cost to get break-even units and revenue.',
  category: 'calculators',
  keywords: ['break even calculator', 'break even point', 'units to break even', 'business calculator'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['Break-even units', 'Revenue', 'No upload'],
  relatedTools: [],
  howTo: ['Enter your values in the fields above.', 'The result updates instantly.', 'Adjust inputs to compare scenarios.'],
  addedAt: '2026-07-21',

  faqs: [
    { q: 'Is Break-Even Calculator free?', a: 'Yes, every calculator on Offline ToolHub is free.' },
    { q: 'Is my data stored?', a: 'No. Calculations happen instantly in your browser and nothing is saved.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
    { q: 'Does it work on mobile?', a: 'Yes. Break-Even Calculator runs in any modern browser, including phones.' },
  ],
};