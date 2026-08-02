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

  howTo: [
    'Open Aspect Ratio Calculator in your browser.',
    'Set your options or pick colors / values.',
    'Copy or download the generated output — created locally on your device.',
  ],
  faqs: [
    { q: 'Is Aspect Ratio Calculator free?', a: 'Yes, and it runs entirely in your browser.' },
    { q: 'Is my work uploaded?', a: 'No. Everything is generated locally on your device.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
    { q: 'Can I export the result?', a: 'Yes. Copy or download the output directly from your browser.' },
  ],
};