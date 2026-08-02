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

  howTo: [
    'Open Loan Calculator in your browser.',
    'Enter your numbers in the input fields.',
    'See the result update instantly — everything is computed locally on your device.',
  ],
  faqs: [
    { q: 'Is Loan Calculator free?', a: 'Yes, every calculator on Offline ToolHub is free.' },
    { q: 'Is my data stored?', a: 'No. Calculations happen instantly in your browser and nothing is saved.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
    { q: 'Does it work on mobile?', a: 'Yes. Loan Calculator runs in any modern browser, including phones.' },
  ],
};