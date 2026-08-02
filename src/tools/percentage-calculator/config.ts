import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'percentage-calculator',
  name: 'Percentage Calculator',
  description: 'Work out percentages, "X% of Y" and percentage change — instantly, in your browser.',
  longDescription:
    'Solve everyday percentage problems fast. The Percentage Calculator tells you what X% of Y is and how much a value changed from A to B (increase or decrease). No upload, no waiting — pure math in your browser.',
  category: 'calculators',
  keywords: ['percentage calculator', 'percentage of', 'percentage change', 'what is x percent of y'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['X% of Y', 'Percentage change', 'Instant'],
  relatedTools: ['discount-calculator'],

  howTo: [
    'Open Percentage Calculator in your browser.',
    'Enter your numbers in the input fields.',
    'See the result update instantly — everything is computed locally on your device.',
  ],
  faqs: [
    { q: 'Is Percentage Calculator free?', a: 'Yes, every calculator on Offline ToolHub is free.' },
    { q: 'Is my data stored?', a: 'No. Calculations happen instantly in your browser and nothing is saved.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
    { q: 'Does it work on mobile?', a: 'Yes. Percentage Calculator runs in any modern browser, including phones.' },
  ],
};