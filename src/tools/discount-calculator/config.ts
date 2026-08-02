import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'discount-calculator',
  name: 'Discount Calculator',
  description: 'Calculate the final price after a discount and how much you save — instantly.',
  longDescription:
    'See the real price after a percentage discount. The Discount Calculator shows the final amount and exactly how much you save off the original price. Runs entirely in your browser.',
  category: 'calculators',
  keywords: ['discount calculator', 'price after discount', 'percent off', 'sale price calculator'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['Final price', 'Amount saved', 'Instant'],
  relatedTools: ['percentage-calculator'],

  howTo: [
    'Open Discount Calculator in your browser.',
    'Enter your numbers in the input fields.',
    'See the result update instantly — everything is computed locally on your device.',
  ],
  faqs: [
    { q: 'Is Discount Calculator free?', a: 'Yes, every calculator on Offline ToolHub is free.' },
    { q: 'Is my data stored?', a: 'No. Calculations happen instantly in your browser and nothing is saved.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
    { q: 'Does it work on mobile?', a: 'Yes. Discount Calculator runs in any modern browser, including phones.' },
  ],
};