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

  howTo: [
    'Open Blur, Pixelate & Redact Image in your browser — no install, no signup.',
    'Add the image you want to work with (drag & drop or pick a file).',
    'Adjust any options, then let it run locally on your device.',
    'Download the result instantly. Your image never leaves your computer.',
  ],
  faqs: [
    { q: 'Is Blur, Pixelate & Redact Image free?', a: 'Yes, Blur, Pixelate & Redact Image is 100% free and runs entirely in your browser.' },
    { q: 'Are my images uploaded to a server?', a: 'No. Images are processed locally in your browser for full privacy — they never leave your device.' },
    { q: 'What formats are supported?', a: 'Common formats such as JPG, PNG, WebP and more, depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. Blur, Pixelate & Redact Image works in any modern browser, no installation needed.' },
  ],
};