import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'exif-viewer',
  name: 'EXIF Viewer & Cleaner',
  description:
    'View photo metadata (camera, date, GPS) and strip it before sharing to protect your privacy.',
  longDescription:
    'Photos store hidden metadata — camera model, capture date, and often precise GPS coordinates. Upload a JPEG to inspect its EXIF data, then create a clean copy with all metadata removed so you can share it safely. Stripping happens by re-rendering the image in your browser, so nothing is uploaded to any server.',
  category: 'utility',
  keywords: ['exif viewer', 'remove exif', 'photo metadata', 'strip gps from photo', 'exif cleaner'],
  icon: 'Camera',
  isClientOnly: true,
  features: ['View EXIF / GPS', 'Strip metadata', 'Private & local', 'JPEG support'],
  relatedTools: ['image-compressor', 'color-picker'],

  howTo: [
    'Open EXIF Viewer & Cleaner in your browser.',
    'Add your input or file.',
    'Get the result instantly — processed locally, nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is EXIF Viewer & Cleaner free?', a: 'Yes, Offline ToolHub tools are free and private.' },
    { q: 'Is my data uploaded?', a: 'No. Processing happens locally in your browser.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work offline?', a: 'Once loaded, EXIF Viewer & Cleaner runs entirely on your device.' },
  ],
};