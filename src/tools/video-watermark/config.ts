import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'video-watermark',
  name: 'Video Watermark',
  description: 'Add a text watermark or brand overlay to your video — fully local, no upload.',
  longDescription:
    'Stamp your videos with a text watermark or brand overlay without sending anything to a server. Video Watermark runs entirely in your browser with ffmpeg.wasm: pick a position (top, bottom or center), choose a color, set the font size, and optionally bold it — perfect for protecting content or adding brand exposure. Your video never leaves your device.',
  category: 'video',
  keywords: ['video watermark', 'add watermark to video', 'text overlay', 'brand overlay', 'video text'],
  icon: 'Video',
  isClientOnly: true,
  features: [
    'Text overlay',
    'Top/Bottom/Center',
    'Color & size',
    'Local only',
  ],
};
