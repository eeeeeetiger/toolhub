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
};
