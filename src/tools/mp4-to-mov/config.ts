import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'mp4-to-mov',
  name: 'MP4 to MOV',
  description: 'Convert MP4 videos to MOV for Apple devices.',
  longDescription: 'Get an MOV version of an MP4 for QuickTime and macOS. MP4 to MOV processes on your device.',
  category: 'video',
  keywords: ['mp4 to mov', 'convert mp4 to mov', 'mp4 to mov converter', 'mp4 mov'],
  icon: 'Video',
  isClientOnly: true,
  features: ['MP4 → MOV', 'Apple friendly', 'Local only'],
  relatedTools: ['video-converter', 'mov-to-mp4'],
  howTo: ['Add your video file.', 'We convert it locally with ffmpeg.wasm.', 'Download the result.'],
  addedAt: '2026-07-21',
};
