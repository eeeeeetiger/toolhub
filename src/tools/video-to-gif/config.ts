import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'video-to-gif',
  name: 'Video to GIF',
  description: 'Turn a clip from your video into a GIF — right in your browser, no upload.',
  longDescription:
    'Make a GIF from any video without uploading it anywhere. Video to GIF runs entirely in your browser using ffmpeg.wasm: pick a start and end point, choose a frame rate, and export a 480p animated GIF — perfect for reactions and social posts. Your video never leaves your device.',
  category: 'video',
  keywords: ['video to gif', 'make gif', 'mp4 to gif', 'video gif maker', 'animated gif'],
  icon: 'Video',
  isClientOnly: true,
  features: [
    'Trim to GIF',
    '480p output',
    'FPS control',
    'Local only',
  ],
};
