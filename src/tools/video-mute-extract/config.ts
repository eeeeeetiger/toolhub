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
};
