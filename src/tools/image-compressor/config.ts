import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'image-compressor',
  name: 'Image Compressor',
  description:
    'Batch-compress images in your browser. Original/JPG/WebP output, high-ratio PNG via color quantization or lossless oxipng, live size estimate, folder upload and ZIP download.',
  longDescription:
    'Image Compressor shrinks image file size entirely in your browser, running every step in a background Web Worker so the UI never freezes. Compress many images at once, upload a whole folder, and download everything as a single ZIP. Pick the output format (keep original, JPG, or WebP), tune a quality slider, and see a live size estimate that updates as you drag. PNG gets two modes: high-compression color quantization for the smallest files, or true lossless optimization via the oxipng WebAssembly encoder. Everything runs locally — no upload, no server, fully private.',
  category: 'image',
  keywords: ['image compressor', 'compress jpg', 'compress png', 'compress webp', 'reduce image size', 'batch image optimizer', 'pngquant', 'oxipng', 'optimize images online'],
  icon: 'Image',
  isClientOnly: true,
  features: ['Original/JPG/WebP', 'PNG: quant + oxipng', 'Live estimate', 'Batch & folder', 'ZIP download', 'Web Worker', '100% private'],
  relatedTools: ['image-converter'],
};
