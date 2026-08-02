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

  howTo: [
    'Open CSS Gradient Generator in your browser.',
    'Set your options or pick colors / values.',
    'Copy or download the generated output — created locally on your device.',
  ],
  faqs: [
    { q: 'Is CSS Gradient Generator free?', a: 'Yes, and it runs entirely in your browser.' },
    { q: 'Is my work uploaded?', a: 'No. Everything is generated locally on your device.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
    { q: 'Can I export the result?', a: 'Yes. Copy or download the output directly from your browser.' },
  ],
};