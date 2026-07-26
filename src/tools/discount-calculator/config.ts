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
};
