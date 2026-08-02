import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'compound-interest-calculator',
  name: 'Compound Interest Calculator',
  description: 'Project how your savings or investment grows with compound interest — instantly.',
  longDescription:
    'Watch your money grow. The Compound Interest Calculator projects the final balance and total interest earned on a principal at a given annual rate, compounded as often as you like. All math runs locally in your browser.',
  category: 'calculators',
  keywords: ['compound interest calculator', 'investment growth', 'interest calculator', 'savings calculator'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['Final amount', 'Interest earned', 'Any frequency'],
  relatedTools: ['loan-calculator'],

  howTo: [
    'Open Compound Interest Calculator in your browser.',
    'Enter your numbers in the input fields.',
    'See the result update instantly — everything is computed locally on your device.',
  ],
  faqs: [
    { q: 'Is Compound Interest Calculator free?', a: 'Yes, every calculator on Offline ToolHub is free.' },
    { q: 'Is my data stored?', a: 'No. Calculations happen instantly in your browser and nothing is saved.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
    { q: 'Does it work on mobile?', a: 'Yes. Compound Interest Calculator runs in any modern browser, including phones.' },
  ],
};