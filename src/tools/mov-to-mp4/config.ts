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

  faqs: [
    { q: 'Is MOV to MP4 free?', a: 'Yes, it is free and runs entirely in your browser.' },
    { q: 'Are my videos uploaded?', a: 'No. Videos are processed locally with ffmpeg.wasm for privacy.' },
    { q: 'What video formats are supported?', a: 'MP4, MOV, WebM, AVI, MKV and more depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
  ],
};