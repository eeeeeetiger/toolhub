import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'color-contrast-checker',
  name: 'Color Contrast Checker',
  description: 'Check WCAG contrast between two colors.',
  longDescription: 'Pick a foreground and background color to see the WCAG contrast ratio and whether the pair passes AA and AAA for readable text.',
  category: 'design',
  keywords: ['color contrast checker', 'wcag contrast', 'contrast ratio', 'accessible colors'],
  icon: 'Contrast',
  isClientOnly: true,
  features: ['WCAG ratio', 'AA / AAA', 'Live preview'],
  relatedTools: ['css-gradient-generator', 'box-shadow-generator', 'aspect-ratio-calculator'],
};
