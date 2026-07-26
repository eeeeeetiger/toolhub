import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'box-shadow-generator',
  name: 'Box Shadow Generator',
  description: 'Design CSS box shadows with a live preview.',
  longDescription: 'Tune offset, blur, spread, color and inset, watch the result update live, and copy the generated box-shadow CSS.',
  category: 'design',
  keywords: ['box shadow generator', 'css shadow', 'box-shadow css', 'shadow maker'],
  icon: 'Square',
  isClientOnly: true,
  features: ['X/Y/blur/spread', 'Inset option', 'Copy CSS'],
  relatedTools: ['css-gradient-generator', 'color-contrast-checker', 'aspect-ratio-calculator'],
};
