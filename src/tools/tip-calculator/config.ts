import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'tip-calculator',
  name: 'Tip Calculator',
  description: 'Split a restaurant bill and calculate the tip per person — instantly, in your browser.',
  longDescription:
    'Never argue over the tip again. The Tip Calculator works out the tip amount, the total bill and how much each person pays when you split it. Pure math in your browser, no upload.',
  category: 'calculators',
  keywords: ['tip calculator', 'split tip', 'restaurant tip', 'tip splitter'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['Tip amount', 'Total', 'Per person'],
  relatedTools: ['percentage-calculator'],

  howTo: [
    'Open Tip Calculator in your browser.',
    'Enter your numbers in the input fields.',
    'See the result update instantly — everything is computed locally on your device.',
  ],
  faqs: [
    { q: 'Is Tip Calculator free?', a: 'Yes, every calculator on Offline ToolHub is free.' },
    { q: 'Is my data stored?', a: 'No. Calculations happen instantly in your browser and nothing is saved.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
    { q: 'Does it work on mobile?', a: 'Yes. Tip Calculator runs in any modern browser, including phones.' },
  ],
};