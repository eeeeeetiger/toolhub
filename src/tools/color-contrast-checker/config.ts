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

  howTo: [
    'Open Color Contrast Checker in your browser.',
    'Set your options or pick colors / values.',
    'Copy or download the generated output — created locally on your device.',
  ],
  faqs: [
    { q: 'Is Color Contrast Checker free?', a: 'Yes, and it runs entirely in your browser.' },
    { q: 'Is my work uploaded?', a: 'No. Everything is generated locally on your device.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
    { q: 'Can I export the result?', a: 'Yes. Copy or download the output directly from your browser.' },
  ],
};