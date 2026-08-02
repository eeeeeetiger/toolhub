import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'video-watermark',
  name: 'Video Watermark',
  description: 'Add a text watermark or brand overlay to your video — fully local, no upload.',
  longDescription:
    'Stamp your videos with a text watermark or brand overlay without sending anything to a server. Video Watermark runs entirely in your browser with ffmpeg.wasm: pick a position (top, bottom or center), choose a color, set the font size, and optionally bold it — perfect for protecting content or adding brand exposure. Your video never leaves your device.',
  category: 'video',
  keywords: ['video watermark', 'add watermark to video', 'text overlay', 'brand overlay', 'video text'],
  icon: 'Video',
  isClientOnly: true,
  features: [
    'Text overlay',
    'Top/Bottom/Center',
    'Color & size',
    'Local only',
  ],

  howTo: [
    'Open Video Watermark in your browser.',
    'Add your video file.',
    'Choose the options you need, then process it locally with ffmpeg.wasm.',
    'Download the result — your video never leaves your device.',
  ],
  faqs: [
    { q: 'Is Video Watermark free?', a: 'Yes, it is free and runs entirely in your browser.' },
    { q: 'Are my videos uploaded?', a: 'No. Videos are processed locally with ffmpeg.wasm for privacy.' },
    { q: 'What video formats are supported?', a: 'MP4, MOV, WebM, AVI, MKV and more depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
  ],
};