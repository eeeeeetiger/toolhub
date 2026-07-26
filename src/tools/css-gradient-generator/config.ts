import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'css-gradient-generator',
  name: 'CSS Gradient Generator',
  description: 'Build linear and radial CSS gradients with live preview.',
  longDescription: 'Pick colors and angle, see a live gradient preview, and copy the ready-to-use CSS. Great for buttons, hero backgrounds and cards.',
  category: 'design',
  keywords: ['css gradient generator', 'linear gradient', 'radial gradient', 'gradient css'],
  icon: 'Blend',
  isClientOnly: true,
  features: ['Linear & radial', 'Live preview', 'Copy CSS'],
  relatedTools: ['box-shadow-generator', 'color-contrast-checker', 'aspect-ratio-calculator'],
};
