import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'color-picker',
  name: 'Color Picker & Palette',
  description:
    'Pick colors from an image or the color wheel, get HEX/RGB/HSL codes and generate matching palettes.',
  longDescription:
    'Grab the exact color you need in seconds. Upload an image and click any pixel to sample its color, or use the color wheel to explore shades. See instant HEX, RGB and HSL values, copy them with one click, and generate a harmonious palette of complementary and analogous colors for your designs. Everything runs locally in your browser.',
  category: 'utility',
  keywords: ['color picker', 'hex color picker', 'image color picker', 'color palette generator', 'rgb to hex'],
  icon: 'Palette',
  isClientOnly: true,
  features: ['Pick from image', 'HEX / RGB / HSL', 'Palette generator', 'One-click copy'],
  relatedTools: ['image-compressor', 'favicon-generator'],

  howTo: [
    'Open Color Picker & Palette in your browser.',
    'Add your input or file.',
    'Get the result instantly — processed locally, nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is Color Picker & Palette free?', a: 'Yes, Offline ToolHub tools are free and private.' },
    { q: 'Is my data uploaded?', a: 'No. Processing happens locally in your browser.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work offline?', a: 'Once loaded, Color Picker & Palette runs entirely on your device.' },
  ],
};