import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'webm-to-mp4',
  name: 'WEBM to MP4',
  description: 'Convert WEBM videos to MP4 for compatibility.',
  longDescription: 'Change WEBM to MP4 so videos play on any device. WEBM to MP4 runs locally with ffmpeg.wasm.',
  category: 'video',
  keywords: ['webm to mp4', 'convert webm to mp4', 'webm to mp4 converter', 'webm mp4'],
  icon: 'Video',
  isClientOnly: true,
  features: ['WEBM → MP4', 'Compatible', 'Local only'],
  relatedTools: ['video-converter', 'mp4-to-webm'],
  howTo: ['Add your video file.', 'We convert it locally with ffmpeg.wasm.', 'Download the result.'],
  addedAt: '2026-07-21',
};
