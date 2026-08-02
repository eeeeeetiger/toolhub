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

  faqs: [
    { q: 'Is MP4 to WEBM free?', a: 'Yes, it is free and runs entirely in your browser.' },
    { q: 'Are my videos uploaded?', a: 'No. Videos are processed locally with ffmpeg.wasm for privacy.' },
    { q: 'What video formats are supported?', a: 'MP4, MOV, WebM, AVI, MKV and more depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
  ],
};