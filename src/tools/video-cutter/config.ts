import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'video-cutter',
  name: 'Video Cutter',
  description: 'Trim a video by start and end time — extract just the part you need, right in your browser.',
  longDescription:
    'Cut any video to a precise time range without uploading it anywhere. Video Cutter uses ffmpeg.wasm to extract a clip by start and end seconds, keeping the original quality with a lossless stream copy that works with MP4, MOV, WebM, MKV and more. Everything runs locally on your device.',
  category: 'video',
  keywords: ['video cutter', 'trim video', 'cut video', 'extract clip', 'split video'],
  icon: 'Video',
  isClientOnly: true,
  features: [
    'Trim by time',
    'Lossless cut',
    'Any format',
    'Local only',
  ],

  howTo: [
    'Open Video Cutter in your browser.',
    'Add your video file.',
    'Choose the options you need, then process it locally with ffmpeg.wasm.',
    'Download the result — your video never leaves your device.',
  ],
  faqs: [
    { q: 'Is Video Cutter free?', a: 'Yes, it is free and runs entirely in your browser.' },
    { q: 'Are my videos uploaded?', a: 'No. Videos are processed locally with ffmpeg.wasm for privacy.' },
    { q: 'What video formats are supported?', a: 'MP4, MOV, WebM, AVI, MKV and more depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
  ],
};