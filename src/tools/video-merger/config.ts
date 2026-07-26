import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'video-merger',
  name: 'Video Merger',
  description: 'Join multiple video clips into one file in the order you choose — all processed locally.',
  longDescription:
    'Combine several video clips into a single video without sending anything to a server. Video Merger uses ffmpeg.wasm to concatenate your files in the exact order you arrange, keeping the same format and quality. Your videos never leave your device.',
  category: 'video',
  keywords: ['video merger', 'join videos', 'merge video', 'concat video', 'combine clips'],
  icon: 'Video',
  isClientOnly: true,
  features: [
    'Join clips',
    'Keep order',
    'Same format',
    'Local only',
  ],
};
