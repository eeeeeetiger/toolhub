import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'portrait-cutout',
  name: 'Portrait Cutout',
  description:
    'Cut out people from photos instantly with Google MediaPipe. Upload a portrait, get a transparent PNG in seconds, then refine edges with a brush. Runs locally — no uploads.',
  longDescription:
    'Portrait Cutout uses Google MediaPipe Selfie Segmentation to separate people from backgrounds in real time. The model is tiny (~25 KB) and runs entirely in your browser, making it the fastest way to cut out a person from any photo. After the automatic cutout, use the brush tools to fix hair edges, restore missed body parts, or erase background bleed. Download the foreground as a transparent PNG, or grab the background with the person removed.',
  category: 'image',
  keywords: [
    'portrait cutout',
    'person remover',
    'cut out person',
    'selfie cutout',
    'people background remover',
    'human segmentation',
    'transparent portrait',
  ],
  icon: 'User',
  isClientOnly: true,
  features: ['MediaPipe AI', 'Ultra-fast person cutout', 'Brush refinement', '100% private'],
  relatedTools: ['ai-photo-cutout', 'batch-background-remover', 'image-converter'],

  howTo: [
    'Open Portrait Cutout in your browser — no install, no signup.',
    'Add the image you want to work with (drag & drop or pick a file).',
    'Adjust any options, then let it run locally on your device.',
    'Download the result instantly. Your image never leaves your computer.',
  ],
  faqs: [
    { q: 'Is Portrait Cutout free?', a: 'Yes, Portrait Cutout is 100% free and runs entirely in your browser.' },
    { q: 'Are my images uploaded to a server?', a: 'No. Images are processed locally in your browser for full privacy — they never leave your device.' },
    { q: 'What formats are supported?', a: 'Common formats such as JPG, PNG, WebP and more, depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. Portrait Cutout works in any modern browser, no installation needed.' },
  ],
};