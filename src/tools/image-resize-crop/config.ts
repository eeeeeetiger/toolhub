import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'image-resize-crop',
  name: 'Image Resizer & Cropper',
  description:
    'Resize and crop images in your browser. Social presets, fill/crop, fit-with-border and blur background, multi-file batch, and multi-size export with per-size crop.',
  longDescription:
    'Image Resizer & Cropper lets you resize and frame any photo entirely in your browser. Start from ready-made social presets (Instagram, YouTube, TikTok, LinkedIn and more) or set a custom size. Choose how the image fits the canvas: fill & crop, fit with border, or a blurred background. Drag and zoom to fine-tune framing, then export to JPG, PNG or WebP. Advanced users get precise controls for rotation, flip, quality and background. Upload several images at once and batch-export multiple target sizes — and in cover mode you can define a custom crop area for every size.',
  category: 'image',
  keywords: ['image resizer', 'image cropper', 'resize image', 'crop photo', 'social media image resizer', 'social image crop', 'resize for facebook', 'social media size', 'instagram size', 'youtube thumbnail', 'tiktok size', 'linkedin size', 'batch image resize', 'resize multiple images'],
  icon: 'Crop',
  isClientOnly: true,
  features: ['Social presets', 'Fill / Border / Blur', 'Drag & zoom', 'Multi-file', 'Multi-size export', '100% private'],
  relatedTools: ['image-compressor', 'image-converter', 'batch-background-remover'],

  howTo: [
    'Open Image Resizer & Cropper in your browser — no install, no signup.',
    'Add the image you want to work with (drag & drop or pick a file).',
    'Adjust any options, then let it run locally on your device.',
    'Download the result instantly. Your image never leaves your computer.',
  ],
  faqs: [
    { q: 'Is Image Resizer & Cropper free?', a: 'Yes, Image Resizer & Cropper is 100% free and runs entirely in your browser.' },
    { q: 'Are my images uploaded to a server?', a: 'No. Images are processed locally in your browser for full privacy — they never leave your device.' },
    { q: 'What formats are supported?', a: 'Common formats such as JPG, PNG, WebP and more, depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. Image Resizer & Cropper works in any modern browser, no installation needed.' },
  ],
};