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
};
