import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'date-difference-calculator',
  name: 'Date Difference Calculator',
  description: 'Find the number of days, weeks, months or years between two dates — instantly.',
  longDescription:
    'Count the time between any two dates. The Date Difference Calculator shows the gap in days, weeks, months and years, whether you are planning a project, a trip or just curious. Runs entirely in your browser.',
  category: 'calculators',
  keywords: ['date difference calculator', 'days between dates', 'date calculator', 'how many days'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['Days', 'Weeks', 'Months', 'Years'],
  relatedTools: ['age-calculator'],
};
