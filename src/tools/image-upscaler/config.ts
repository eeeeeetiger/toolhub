import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'image-upscaler',
  name: 'Image Upscaler & Enhancer',
  description:
    'Upscale and enhance images in your browser. 2x/4x enlargement with high-quality resampling, sharpening, noise reduction and contrast boost.',
  longDescription:
    'Image Upscaler & Enhancer increases the resolution of your photos and cleans them up — all in your browser. Enlarge to 2x or 4x with high-quality resampling, then fine-tune the result with sharpening, light noise reduction, brightness and contrast controls. Perfect for old photos, low-res product shots, AI-generated images and small avatars. Compare before and after with a slider, then export as PNG, JPG or WebP. This is a lightweight, fully local enhancer — nothing is uploaded, and AI super-resolution models can be added later.',
  category: 'image',
  keywords: [
    'upscale image',
    'increase image resolution',
    'enhance photo',
    'image upscaler',
    'photo enhancer',
    'enlarge image',
    'sharpen image',
    'denoise photo',
  ],
  icon: 'Sparkles',
  isClientOnly: true,
  features: ['2x / 4x upscale', 'Sharpen', 'Noise reduction', 'Contrast boost', 'Before/After', '100% private'],
  relatedTools: ['image-resize-crop', 'image-compressor', 'image-converter'],
};
