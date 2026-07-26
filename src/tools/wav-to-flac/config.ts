import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'wav-to-flac',
  name: 'WAV to FLAC',
  description: 'Convert WAV to lossless FLAC to save space without quality loss.',
  longDescription: 'Shrink WAV files with lossless FLAC compression. WAV to FLAC runs locally in your browser.',
  category: 'audio',
  keywords: ['wav to flac', 'convert wav to flac', 'wav to flac converter', 'wav flac'],
  icon: 'Music',
  isClientOnly: true,
  features: ['WAV → FLAC', 'Lossless', 'Local only'],
  relatedTools: ['audio-converter', 'flac-to-mp3'],
  howTo: ['Add your audio file (or allow mic/camera).', 'The tool processes it on your device.', 'Preview or download the result.'],
  addedAt: '2026-07-21',
};
