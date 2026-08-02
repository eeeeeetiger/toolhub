import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'salary-calculator',
  name: 'Salary Calculator',
  description: 'Convert an hourly rate to annual, monthly and weekly salary.',
  longDescription: 'Turn an hourly wage into annual, monthly and weekly pay. The salary calculator helps you compare job offers and freelance rates.',
  category: 'calculators',
  keywords: ['salary calculator', 'hourly to salary', 'annual salary', 'pay calculator'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['Annual', 'Monthly', 'Weekly'],
  relatedTools: [],
  howTo: ['Enter your values in the fields above.', 'The result updates instantly.', 'Adjust inputs to compare scenarios.'],
  addedAt: '2026-07-21',

  faqs: [
    { q: 'Is Salary Calculator free?', a: 'Yes, every calculator on Offline ToolHub is free.' },
    { q: 'Is my data stored?', a: 'No. Calculations happen instantly in your browser and nothing is saved.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
    { q: 'Does it work on mobile?', a: 'Yes. Salary Calculator runs in any modern browser, including phones.' },
  ],
};