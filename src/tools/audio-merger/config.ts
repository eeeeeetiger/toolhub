import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'audio-merger',
  name: 'Audio Merger',
  description: 'Join multiple audio clips into one file — right in your browser, no upload.',
  longDescription:
    'Combine several audio recordings into a single track. Audio Merger decodes and concatenates your files entirely in the browser using the Web Audio API and exports one file — choose MP3 for a small, shareable result or WAV for full quality. No uploads, no file-size limits, no server.',
  category: 'audio',
  keywords: ['merge audio', 'join audio', 'combine audio files', 'audio joiner'],
  icon: 'Music',
  isClientOnly: true,
  features: ['Join clips', 'MP3 or WAV output', '100% local'],
  relatedTools: ['audio-cutter', 'audio-converter'],
};
