import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'age-calculator',
  name: 'Age Calculator',
  description: 'Calculate your exact age in years, months and days — instantly, in your browser.',
  longDescription:
    'How old are you, exactly? The Age Calculator takes your date of birth and works out your precise age in years, months, days and total days lived. Everything runs locally in your browser.',
  category: 'calculators',
  keywords: ['age calculator', 'calculate age', 'exact age', 'how old am i'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['Years', 'Months', 'Days', 'Total days'],
  relatedTools: ['date-difference-calculator', 'bmi-calculator'],
};
