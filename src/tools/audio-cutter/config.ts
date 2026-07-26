import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'audio-cutter',
  name: 'Audio Cutter',
  description: 'Trim and cut audio to any start and end point — right in your browser, no upload.',
  longDescription:
    'Slice any audio clip to the exact part you need. Audio Cutter runs fully in your browser: load a file, set the start and end times in seconds, and export just that segment as MP3 or WAV. No uploads, no waiting, no watermarks.',
  category: 'audio',
  keywords: ['audio cutter', 'trim audio', 'cut audio', 'audio trimmer', 'audio splitter'],
  icon: 'Music',
  isClientOnly: true,
  features: ['Precise trim', 'MP3 / WAV', '100% local'],
  relatedTools: ['audio-merger', 'audio-converter'],
};
