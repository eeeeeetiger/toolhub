import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'ai-photo-cutout',
  name: 'AI Photo Cutout',
  description:
    'Remove image backgrounds with AI right in your browser. Upload a photo, get a transparent PNG, then fine-tune edges with a brush. 100% private — no uploads.',
  longDescription:
    'Remove Background uses a U2Net AI model to cut out the subject from any image — people, products, animals, or objects. The model runs entirely in your browser via WebAssembly, so your images never leave your device. After the automatic cutout, switch to brush mode to restore missed areas or erase background spill around hair, fur, or complex edges. Download the foreground as a transparent PNG, or grab the background with the subject removed.',
  category: 'image',
  keywords: [
    'remove background',
    'background remover',
    'transparent background maker',
    'cut out image',
    'photo background eraser',
    'ai bg remover',
    'png transparent',
  ],
  icon: 'Scissors',
  isClientOnly: true,
  features: ['AI auto cutout', 'Brush refinement', 'Foreground + Background', '100% private'],
  relatedTools: ['portrait-cutout', 'batch-background-remover', 'image-converter'],

  howTo: [
    'Open AI Photo Cutout in your browser — no install, no signup.',
    'Add the image you want to work with (drag & drop or pick a file).',
    'Adjust any options, then let it run locally on your device.',
    'Download the result instantly. Your image never leaves your computer.',
  ],
  faqs: [
    { q: 'Is AI Photo Cutout free?', a: 'Yes, AI Photo Cutout is 100% free and runs entirely in your browser.' },
    { q: 'Are my images uploaded to a server?', a: 'No. Images are processed locally in your browser for full privacy — they never leave your device.' },
    { q: 'What formats are supported?', a: 'Common formats such as JPG, PNG, WebP and more, depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. AI Photo Cutout works in any modern browser, no installation needed.' },
  ],
};