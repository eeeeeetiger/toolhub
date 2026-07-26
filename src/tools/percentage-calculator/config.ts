import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'percentage-calculator',
  name: 'Percentage Calculator',
  description: 'Work out percentages, "X% of Y" and percentage change — instantly, in your browser.',
  longDescription:
    'Solve everyday percentage problems fast. The Percentage Calculator tells you what X% of Y is and how much a value changed from A to B (increase or decrease). No upload, no waiting — pure math in your browser.',
  category: 'calculators',
  keywords: ['percentage calculator', 'percentage of', 'percentage change', 'what is x percent of y'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['X% of Y', 'Percentage change', 'Instant'],
  relatedTools: ['discount-calculator'],
};
