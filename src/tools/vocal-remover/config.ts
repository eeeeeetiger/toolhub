import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'vocal-remover',
  name: 'Vocal Remover',
  description: 'Remove vocals from a stereo track to make an instrumental.',
  longDescription: 'Turn a song into a karaoke-style instrumental using phase cancellation. The vocal remover processes your file locally and exports MP3 or WAV.',
  category: 'audio',
  keywords: ['vocal remover', 'remove vocals', 'karaoke maker', 'instrumental maker'],
  icon: 'AudioLines',
  isClientOnly: true,
  features: ['Center cancel', 'MP3 or WAV export', 'Local only'],
  relatedTools: ['audio-converter', 'audio-cutter'],
  howTo: ['Add your audio file (or allow mic/camera).', 'The tool processes it on your device.', 'Preview or download the result.'],
  addedAt: '2026-07-21',
};
