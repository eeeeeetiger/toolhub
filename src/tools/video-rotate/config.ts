import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'video-rotate',
  name: 'Video Rotate & Flip',
  description: 'Rotate a video 90° or mirror-flip it right in your browser — no upload, fully private.',
  longDescription:
    'Rotate or flip videos without uploading them anywhere. Video Rotate & Flip runs entirely in your browser using ffmpeg.wasm: turn a sideways clip 90°, flip it 180°, or mirror it horizontally or vertically. Your video never leaves your device.',
  category: 'video',
  keywords: ['video rotate', 'rotate video', 'flip video', 'mirror video', 'video orientation'],
  icon: 'Video',
  isClientOnly: true,
  features: [
    'Rotate 90°',
    '180° flip',
    'Mirror H/V',
    'Local only',
  ],

  howTo: [
    'Open Video Rotate & Flip in your browser.',
    'Add your video file.',
    'Choose the options you need, then process it locally with ffmpeg.wasm.',
    'Download the result — your video never leaves your device.',
  ],
  faqs: [
    { q: 'Is Video Rotate & Flip free?', a: 'Yes, it is free and runs entirely in your browser.' },
    { q: 'Are my videos uploaded?', a: 'No. Videos are processed locally with ffmpeg.wasm for privacy.' },
    { q: 'What video formats are supported?', a: 'MP4, MOV, WebM, AVI, MKV and more depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
  ],
};