import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'gif-editor',
  name: 'GIF Editor',
  description: 'Upload a GIF or WebP to trim, resize, remove frames, speed up, reverse, compress — and export as GIF or WebP, all in your browser.',
  longDescription:
    'A full-featured GIF & WebP editor that runs entirely in your browser. Upload a GIF or WebP to see every frame as a live animated preview, then crop, resize, change playback speed, reverse the animation, delete individual frames, or compress it to a smaller file. Export the result as a new animated GIF or as an animated WebP. Every operation is processed locally — your file never leaves your device.',
  category: 'image',
  keywords: ['gif editor', 'edit gif', 'compress gif', 'reverse gif', 'crop gif', 'remove gif frames', 'gif to webp', 'webp to gif', 'gif maker'],
  icon: 'Film',
  isClientOnly: true,
  features: ['Crop & resize', 'Speed & reverse', 'Remove individual frames', 'GIF & WebP import/export', 'Local processing'],
  relatedTools: ['gif-maker', 'meme-generator', 'image-compressor'],
};
