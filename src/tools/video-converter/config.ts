import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'video-converter',
  name: 'Video Converter',
  description: 'Convert video between MP4, MOV, WebM, AVI, MKV and GIF — right in your browser, no upload.',
  longDescription:
    'Change any video into the format you need without sending it anywhere. Video Converter runs entirely in your browser using ffmpeg.wasm: turn MP4 into MOV, WebM, AVI or MKV, or export a short clip as a GIF — all processed locally on your device. Fast, private and free.',
  category: 'video',
  keywords: ['video converter', 'convert video', 'mp4 to mov', 'mp4 to webm', 'video to gif'],
  icon: 'Video',
  isClientOnly: true,
  features: [
    'MP4 / MOV / WebM',
    'AVI / MKV',
    'To GIF',
    '100% local',
  ],

  howTo: [
    'Open Video Converter in your browser.',
    'Add your video file.',
    'Choose the options you need, then process it locally with ffmpeg.wasm.',
    'Download the result — your video never leaves your device.',
  ],
  faqs: [
    { q: 'Is Video Converter free?', a: 'Yes, it is free and runs entirely in your browser.' },
    { q: 'Are my videos uploaded?', a: 'No. Videos are processed locally with ffmpeg.wasm for privacy.' },
    { q: 'What video formats are supported?', a: 'MP4, MOV, WebM, AVI, MKV and more depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
  ],
};