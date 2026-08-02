import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'video-speed',
  name: 'Video Speed Changer',
  description: 'Speed up or slow down any video playback — in your browser, no upload, fully private.',
  longDescription:
    'Change the playback speed of your videos without re-uploading them anywhere. Video Speed Changer runs entirely in your browser using ffmpeg.wasm: pick a factor from 0.25x (slow-mo) to 4x (fast-forward), keep the original audio in sync, and export to any format — perfect for tutorials, lectures or highlight clips. Your video never leaves your device.',
  category: 'video',
  keywords: ['video speed', 'change video speed', 'speed up video', 'slow down video', 'video playback'],
  icon: 'Video',
  isClientOnly: true,
  features: [
    '0.5x – 4x',
    'Keep audio',
    'Any format',
    'Local only',
  ],

  howTo: [
    'Open Video Speed Changer in your browser.',
    'Add your video file.',
    'Choose the options you need, then process it locally with ffmpeg.wasm.',
    'Download the result — your video never leaves your device.',
  ],
  faqs: [
    { q: 'Is Video Speed Changer free?', a: 'Yes, it is free and runs entirely in your browser.' },
    { q: 'Are my videos uploaded?', a: 'No. Videos are processed locally with ffmpeg.wasm for privacy.' },
    { q: 'What video formats are supported?', a: 'MP4, MOV, WebM, AVI, MKV and more depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
  ],
};