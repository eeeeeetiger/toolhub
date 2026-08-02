import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'video-to-mp3',
  name: 'Video to MP3',
  description: 'Extract audio from a video and save it as MP3.',
  longDescription: 'Pull the soundtrack out of any video as an MP3. Video to MP3 runs locally with ffmpeg.wasm — your file never leaves your device.',
  category: 'audio',
  keywords: ['video to mp3', 'extract audio from video', 'mp4 to mp3', 'video to mp3 converter'],
  icon: 'Music',
  isClientOnly: true,
  features: ['Video → MP3', 'Extract audio', 'Local only'],
  relatedTools: ['audio-converter', 'audio-cutter'],
  howTo: ['Add your audio file (or allow mic/camera).', 'The tool processes it on your device.', 'Preview or download the result.'],
  addedAt: '2026-07-21',

  faqs: [
    { q: 'Is Video to MP3 free?', a: 'Yes, all audio tools on Offline ToolHub are free.' },
    { q: 'Are my audio files uploaded?', a: 'No. Audio is processed locally in your browser with Web Audio and ffmpeg.wasm.' },
    { q: 'What audio formats are supported?', a: 'MP3, WAV, M4A, OGG and FLAC, depending on the tool.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};