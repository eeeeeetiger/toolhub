import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'video-compressor',
  name: 'Video Compressor',
  description: 'Shrink video file size right in your browser — no upload, fast and private.',
  longDescription:
    'Compress videos without uploading them to any server. Video Compressor runs entirely in your browser using ffmpeg.wasm: pick a target size, lower the resolution, or trade a little quality for a much smaller file — perfect for sharing on social media, email or chat. Your video never leaves your device.',
  category: 'video',
  keywords: ['video compressor', 'compress video', 'reduce video size', 'shrink mp4', 'video optimizer'],
  icon: 'Video',
  isClientOnly: true,
  features: [
    'Resolution scaling',
    'Quality / CRF control',
    'Optional mute',
    '100% local',
  ],

  howTo: [
    'Open Video Compressor in your browser.',
    'Add your video file.',
    'Choose the options you need, then process it locally with ffmpeg.wasm.',
    'Download the result — your video never leaves your device.',
  ],
  faqs: [
    { q: 'Is Video Compressor free?', a: 'Yes, it is free and runs entirely in your browser.' },
    { q: 'Are my videos uploaded?', a: 'No. Videos are processed locally with ffmpeg.wasm for privacy.' },
    { q: 'What video formats are supported?', a: 'MP4, MOV, WebM, AVI, MKV and more depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
  ],
};