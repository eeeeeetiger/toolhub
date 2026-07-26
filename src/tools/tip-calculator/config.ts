import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'tip-calculator',
  name: 'Tip Calculator',
  description: 'Split a restaurant bill and calculate the tip per person — instantly, in your browser.',
  longDescription:
    'Never argue over the tip again. The Tip Calculator works out the tip amount, the total bill and how much each person pays when you split it. Pure math in your browser, no upload.',
  category: 'calculators',
  keywords: ['tip calculator', 'split tip', 'restaurant tip', 'tip splitter'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['Tip amount', 'Total', 'Per person'],
  relatedTools: ['percentage-calculator'],
};
