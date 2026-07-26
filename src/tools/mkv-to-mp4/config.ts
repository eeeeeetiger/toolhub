import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'mkv-to-mp4',
  name: 'MKV to MP4',
  description: 'Convert MKV videos to MP4 for easier sharing.',
  longDescription: 'Turn MKV files into MP4 for broader device support. MKV to MP4 processes on your device.',
  category: 'video',
  keywords: ['mkv to mp4', 'convert mkv to mp4', 'mkv to mp4 converter', 'mkv mp4'],
  icon: 'Video',
  isClientOnly: true,
  features: ['MKV → MP4', 'Shareable', 'Local only'],
  relatedTools: ['video-converter', 'mov-to-mp4'],
  howTo: ['Add your video file.', 'We convert it locally with ffmpeg.wasm.', 'Download the result.'],
  addedAt: '2026-07-21',
};
