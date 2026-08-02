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

  howTo: [
    'Open Box Shadow Generator in your browser.',
    'Set your options or pick colors / values.',
    'Copy or download the generated output — created locally on your device.',
  ],
  faqs: [
    { q: 'Is Box Shadow Generator free?', a: 'Yes, and it runs entirely in your browser.' },
    { q: 'Is my work uploaded?', a: 'No. Everything is generated locally on your device.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
    { q: 'Can I export the result?', a: 'Yes. Copy or download the output directly from your browser.' },
  ],
};