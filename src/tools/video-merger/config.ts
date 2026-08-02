import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'video-merger',
  name: 'Video Merger',
  description: 'Join multiple video clips into one file in the order you choose — all processed locally.',
  longDescription:
    'Combine several video clips into a single video without sending anything to a server. Video Merger uses ffmpeg.wasm to concatenate your files in the exact order you arrange, keeping the same format and quality. Your videos never leave your device.',
  category: 'video',
  keywords: ['video merger', 'join videos', 'merge video', 'concat video', 'combine clips'],
  icon: 'Video',
  isClientOnly: true,
  features: [
    'Join clips',
    'Keep order',
    'Same format',
    'Local only',
  ],

  howTo: [
    'Open Video Merger in your browser.',
    'Add your video file.',
    'Choose the options you need, then process it locally with ffmpeg.wasm.',
    'Download the result — your video never leaves your device.',
  ],
  faqs: [
    { q: 'Is Video Merger free?', a: 'Yes, it is free and runs entirely in your browser.' },
    { q: 'Are my videos uploaded?', a: 'No. Videos are processed locally with ffmpeg.wasm for privacy.' },
    { q: 'What video formats are supported?', a: 'MP4, MOV, WebM, AVI, MKV and more depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
  ],
};