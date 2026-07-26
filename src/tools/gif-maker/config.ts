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
};
