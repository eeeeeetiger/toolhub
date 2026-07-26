import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'loan-calculator',
  name: 'Loan Calculator',
  description: 'Estimate monthly loan or mortgage payments and total interest — instantly, in your browser.',
  longDescription:
    'Plan a loan or mortgage with confidence. The Loan Calculator estimates your monthly payment, total interest and total amount paid from the loan amount, annual rate and term. All calculations run locally on your device.',
  category: 'calculators',
  keywords: ['loan calculator', 'mortgage calculator', 'monthly payment', 'loan payment calculator'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['Monthly payment', 'Total interest', 'Total paid'],
  relatedTools: ['compound-interest-calculator'],
};
