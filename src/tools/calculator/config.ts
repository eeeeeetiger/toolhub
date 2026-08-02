import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'calculator',
  name: 'Calculator Suite',
  description:
    'Free online calculators for BMI, loan payments, percentages and age — quick answers in your browser.',
  longDescription:
    'A handy set of everyday calculators in one place. Work out your BMI and weight category, estimate monthly loan or mortgage payments with total interest, calculate percentages and percentage change, and find an exact age in years, months and days. Every calculation runs instantly and privately in your browser.',
  category: 'utility',
  keywords: ['bmi calculator', 'loan calculator', 'percentage calculator', 'age calculator', 'online calculator'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['BMI calculator', 'Loan / mortgage', 'Percentage', 'Age calculator'],
  relatedTools: ['unit-converter', 'timestamp-converter'],

  howTo: [
    'Open Calculator Suite in your browser.',
    'Add your input or file.',
    'Get the result instantly — processed locally, nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is Calculator Suite free?', a: 'Yes, Offline ToolHub tools are free and private.' },
    { q: 'Is my data uploaded?', a: 'No. Processing happens locally in your browser.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work offline?', a: 'Once loaded, Calculator Suite runs entirely on your device.' },
  ],
};