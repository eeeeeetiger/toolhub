import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'mov-to-mp4',
  name: 'MOV to MP4',
  description: 'Convert MOV videos to MP4 for universal playback.',
  longDescription: 'Make QuickTime MOV files play anywhere by converting to MP4. MOV to MP4 runs locally with ffmpeg.wasm.',
  category: 'video',
  keywords: ['mov to mp4', 'convert mov to mp4', 'mov to mp4 converter', 'mov mp4'],
  icon: 'Video',
  isClientOnly: true,
  features: ['MOV → MP4', 'Universal', 'Local only'],
  relatedTools: ['video-converter', 'mkv-to-mp4'],
  howTo: ['Add your video file.', 'We convert it locally with ffmpeg.wasm.', 'Download the result.'],
  addedAt: '2026-07-21',
};
