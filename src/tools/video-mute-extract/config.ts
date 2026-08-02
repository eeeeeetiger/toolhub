import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'video-mute-extract',
  name: 'Mute or Extract Audio',
  description: 'Remove sound from a video or extract its audio track as MP3 — all in your browser, private.',
  longDescription:
    'Mute or Extract Audio works entirely in your browser using ffmpeg.wasm. Strip the audio from a clip in a single pass (lossless mute, video re-encoded as needed), or pull out the sound track and save it as a standalone MP3 — perfect for podcasts, voiceovers or removing background noise. Your video never leaves your device.',
  category: 'video',
  keywords: ['mute video', 'remove audio', 'extract audio', 'video to mp3', 'audio extraction'],
  icon: 'Video',
  isClientOnly: true,
  features: [
    'Remove audio',
    'Extract to MP3',
    'Lossless mute',
    'Local only',
  ],

  howTo: [
    'Open Mute or Extract Audio in your browser.',
    'Add your video file.',
    'Choose the options you need, then process it locally with ffmpeg.wasm.',
    'Download the result — your video never leaves your device.',
  ],
  faqs: [
    { q: 'Is Mute or Extract Audio free?', a: 'Yes, it is free and runs entirely in your browser.' },
    { q: 'Are my videos uploaded?', a: 'No. Videos are processed locally with ffmpeg.wasm for privacy.' },
    { q: 'What video formats are supported?', a: 'MP4, MOV, WebM, AVI, MKV and more depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
  ],
};