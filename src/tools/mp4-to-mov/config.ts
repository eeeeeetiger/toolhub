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

  faqs: [
    { q: 'Is MP4 to MOV free?', a: 'Yes, it is free and runs entirely in your browser.' },
    { q: 'Are my videos uploaded?', a: 'No. Videos are processed locally with ffmpeg.wasm for privacy.' },
    { q: 'What video formats are supported?', a: 'MP4, MOV, WebM, AVI, MKV and more depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
  ],
};