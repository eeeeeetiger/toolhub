import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'image-redact',
  name: 'Blur, Pixelate & Redact Image',
  description:
    'Hide sensitive parts of an image in your browser. Draw rectangles or brush over faces, plates, addresses and IDs with blur, pixelate or solid redaction.',
  longDescription:
    'Blur, Pixelate & Redact Image lets you protect privacy without uploading anything. Draw rectangular selections or paint freehand with a brush over the areas you want to hide — faces, license plates, home addresses, chat screenshots, emails, bank card numbers and more. Choose between blur, pixelate (mosaic) or a solid block, and adjust the strength. Everything is processed locally in your browser, so your private images never leave your device. Automatic face detection can be added later.',
  category: 'image',
  keywords: [
    'blur image',
    'pixelate image',
    'blur face',
    'redact image',
    'hide license plate',
    'censor photo',
    'mosaic image',
    'blur text in image',
  ],
  icon: 'EyeOff',
  isClientOnly: true,
  features: ['Rectangle redact', 'Brush redact', 'Blur / Pixelate / Block', 'Adjustable strength', 'Undo', '100% private'],
  relatedTools: ['image-resize-crop', 'image-watermark', 'image-compressor'],
};
