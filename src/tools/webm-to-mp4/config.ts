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

  faqs: [
    { q: 'Is WEBM to MP4 free?', a: 'Yes, it is free and runs entirely in your browser.' },
    { q: 'Are my videos uploaded?', a: 'No. Videos are processed locally with ffmpeg.wasm for privacy.' },
    { q: 'What video formats are supported?', a: 'MP4, MOV, WebM, AVI, MKV and more depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
  ],
};