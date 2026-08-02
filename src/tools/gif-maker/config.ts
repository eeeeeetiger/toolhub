import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'gif-maker',
  name: 'GIF Maker',
  description: 'Turn multiple static images into an animated GIF, with meme text.',
  longDescription:
    'Build an animated GIF from your photos. Upload several static images, arrange their order, add bold top and bottom meme text just like the meme generator, set the frame delay, and export a looping GIF. All frames are stitched and encoded locally in your browser.',
  category: 'image',
  keywords: ['gif maker', 'make gif', 'images to gif', 'photo to gif', 'animated gif creator'],
  icon: 'Images',
  isClientOnly: true,
  features: ['Images to GIF', 'Reorder frames', 'Meme text', 'Local export'],
  relatedTools: ['meme-generator', 'gif-editor', 'image-collage'],

  howTo: [
    'Open GIF Maker in your browser — no install, no signup.',
    'Add the image you want to work with (drag & drop or pick a file).',
    'Adjust any options, then let it run locally on your device.',
    'Download the result instantly. Your image never leaves your computer.',
  ],
  faqs: [
    { q: 'Is GIF Maker free?', a: 'Yes, GIF Maker is 100% free and runs entirely in your browser.' },
    { q: 'Are my images uploaded to a server?', a: 'No. Images are processed locally in your browser for full privacy — they never leave your device.' },
    { q: 'What formats are supported?', a: 'Common formats such as JPG, PNG, WebP and more, depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. GIF Maker works in any modern browser, no installation needed.' },
  ],
};