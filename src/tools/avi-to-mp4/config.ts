import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'avi-to-mp4',
  name: 'AVI to MP4',
  description: 'Convert AVI videos to MP4 to shrink and share.',
  longDescription: 'Modernize AVI files as MP4. AVI to MP4 processes locally in your browser.',
  category: 'video',
  keywords: ['avi to mp4', 'convert avi to mp4', 'avi to mp4 converter', 'avi mp4'],
  icon: 'Video',
  isClientOnly: true,
  features: ['AVI → MP4', 'Smaller', 'Local only'],
  relatedTools: ['video-converter', 'mov-to-mp4'],
  howTo: ['Add your video file.', 'We convert it locally with ffmpeg.wasm.', 'Download the result.'],
  addedAt: '2026-07-21',

  faqs: [
    { q: 'Is AVI to MP4 free?', a: 'Yes, it is free and runs entirely in your browser.' },
    { q: 'Are my videos uploaded?', a: 'No. Videos are processed locally with ffmpeg.wasm for privacy.' },
    { q: 'What video formats are supported?', a: 'MP4, MOV, WebM, AVI, MKV and more depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
  ],
};