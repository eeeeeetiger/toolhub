import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'mp4-to-webm',
  name: 'MP4 to WEBM',
  description: 'Convert MP4 to WEBM for lighter web video.',
  longDescription: 'Optimize MP4 for the web with WEBM. MP4 to WEBM runs locally with ffmpeg.wasm.',
  category: 'video',
  keywords: ['mp4 to webm', 'convert mp4 to webm', 'mp4 to webm converter', 'mp4 webm'],
  icon: 'Video',
  isClientOnly: true,
  features: ['MP4 → WEBM', 'Web optimized', 'Local only'],
  relatedTools: ['video-converter', 'webm-to-mp4'],
  howTo: ['Add your video file.', 'We convert it locally with ffmpeg.wasm.', 'Download the result.'],
  addedAt: '2026-07-21',
};
