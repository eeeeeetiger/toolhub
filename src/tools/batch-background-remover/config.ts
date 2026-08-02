import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'batch-background-remover',
  name: 'Batch Background Remover',
  description:
    'Remove image backgrounds in your browser. Auto-detects solid vs complex backgrounds, batch-processes files and folders, and downloads a ZIP named <original>_nobg.png.',
  longDescription:
    'Image Background Remover strips backgrounds from pictures entirely in the browser. It automatically picks the best method for each image: a fast color-key pass for solid or near-solid backgrounds, and an AI model for complex scenes with hair, fur or translucent edges. Upload many files at once or a whole folder, process them all with one click, preview each result, and grab a single ZIP where every file is named <original>_nobg.png. Everything runs locally on your device — no uploads, no server, fully private.',
  category: 'image',
  keywords: [
    'background remover',
    'remove bg',
    'transparent background',
    'png transparent',
    'cut out image',
    'photo background eraser',
    'batch bg remover',
  ],
  icon: 'Image',
  isClientOnly: true,
  features: ['Solid + AI smart', 'Auto-detect mode', 'Batch & folder', 'ZIP download', 'Named _nobg', '100% private'],
  relatedTools: ['image-compressor', 'image-converter'],

  howTo: [
    'Open Batch Background Remover in your browser — no install, no signup.',
    'Add the image you want to work with (drag & drop or pick a file).',
    'Adjust any options, then let it run locally on your device.',
    'Download the result instantly. Your image never leaves your computer.',
  ],
  faqs: [
    { q: 'Is Batch Background Remover free?', a: 'Yes, Batch Background Remover is 100% free and runs entirely in your browser.' },
    { q: 'Are my images uploaded to a server?', a: 'No. Images are processed locally in your browser for full privacy — they never leave your device.' },
    { q: 'What formats are supported?', a: 'Common formats such as JPG, PNG, WebP and more, depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. Batch Background Remover works in any modern browser, no installation needed.' },
  ],
};