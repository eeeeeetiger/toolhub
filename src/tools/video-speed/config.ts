import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'video-speed',
  name: 'Video Speed Changer',
  description: 'Speed up or slow down any video playback — in your browser, no upload, fully private.',
  longDescription:
    'Change the playback speed of your videos without re-uploading them anywhere. Video Speed Changer runs entirely in your browser using ffmpeg.wasm: pick a factor from 0.25x (slow-mo) to 4x (fast-forward), keep the original audio in sync, and export to any format — perfect for tutorials, lectures or highlight clips. Your video never leaves your device.',
  category: 'video',
  keywords: ['video speed', 'change video speed', 'speed up video', 'slow down video', 'video playback'],
  icon: 'Video',
  isClientOnly: true,
  features: [
    '0.5x – 4x',
    'Keep audio',
    'Any format',
    'Local only',
  ],
};
