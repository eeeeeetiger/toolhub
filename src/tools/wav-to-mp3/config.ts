import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'wav-to-mp3',
  name: 'WAV to MP3',
  description: 'Convert WAV audio to MP3 to shrink file size — locally in your browser.',
  longDescription: 'Turn large WAV files into compact MP3. WAV to MP3 runs on your device with ffmpeg.wasm, so nothing is uploaded.',
  category: 'audio',
  keywords: ['wav to mp3', 'convert wav to mp3', 'wav to mp3 converter', 'wav to mp3 online'],
  icon: 'Music',
  isClientOnly: true,
  features: ['WAV → MP3', 'Smaller files', 'Local only'],
  relatedTools: ['audio-converter', 'flac-to-mp3'],
  howTo: ['Add your audio file (or allow mic/camera).', 'The tool processes it on your device.', 'Preview or download the result.'],
  addedAt: '2026-07-21',
};
