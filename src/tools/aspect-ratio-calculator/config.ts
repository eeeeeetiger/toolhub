import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'aspect-ratio-calculator',
  name: 'Aspect Ratio Calculator',
  description: 'Simplify width:height ratios for responsive layouts.',
  longDescription: 'Enter a width and height to get the simplified aspect ratio (e.g. 16:9) and the matching dimensions for common resolutions.',
  category: 'design',
  keywords: ['aspect ratio calculator', '16:9 calculator', 'ratio calculator', 'responsive ratio'],
  icon: 'RectangleHorizontal',
  isClientOnly: true,
  features: ['Simplify ratio', 'Common sizes', 'Instant'],
  relatedTools: ['css-gradient-generator', 'box-shadow-generator', 'color-contrast-checker'],
};
