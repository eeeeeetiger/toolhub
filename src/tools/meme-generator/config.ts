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

  howTo: [
    'Open Meme Generator in your browser — no install, no signup.',
    'Add the image you want to work with (drag & drop or pick a file).',
    'Adjust any options, then let it run locally on your device.',
    'Download the result instantly. Your image never leaves your computer.',
  ],
  faqs: [
    { q: 'Is Meme Generator free?', a: 'Yes, Meme Generator is 100% free and runs entirely in your browser.' },
    { q: 'Are my images uploaded to a server?', a: 'No. Images are processed locally in your browser for full privacy — they never leave your device.' },
    { q: 'What formats are supported?', a: 'Common formats such as JPG, PNG, WebP and more, depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. Meme Generator works in any modern browser, no installation needed.' },
  ],
};