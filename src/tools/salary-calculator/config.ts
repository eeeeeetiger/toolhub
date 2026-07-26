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
};
