import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'meme-generator',
  name: 'Meme Generator',
  description: 'Add top & bottom text to any image — static or animated GIF — and export.',
  longDescription:
    'Create memes in seconds. Upload a static photo (PNG, JPG, WebP) or an animated GIF, add bold top and bottom text, pick the font, color and outline, and export. For animated GIFs the text is drawn onto every frame so the result stays animated. Everything runs locally in your browser.',
  category: 'image',
  keywords: ['meme generator', 'make meme', 'add text to image', 'meme maker', 'caption gif'],
  icon: 'MessageSquareText',
  isClientOnly: true,
  features: ['Static & GIF', 'Top / bottom text', 'Font & color', 'Local export'],
  relatedTools: ['gif-maker', 'gif-editor', 'image-watermark'],
};
