import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'audio-converter',
  name: 'Audio Converter',
  description: 'Convert audio between MP3, WAV, M4A, OGG and FLAC — right in your browser, no upload.',
  longDescription:
    'Change any audio file into the format you need without sending it anywhere. Audio Converter runs entirely in your browser using ffmpeg.wasm: turn MP3 into WAV, M4A into MP3, or export to OGG and FLAC — all processed locally on your device. Fast, private and free.',
  category: 'audio',
  keywords: ['audio converter', 'convert audio', 'mp3 to wav', 'wav to mp3', 'm4a to mp3', 'ogg to mp3'],
  icon: 'Music',
  isClientOnly: true,
  features: ['MP3 / WAV / M4A', 'OGG / FLAC', '100% local', 'Adjustable bitrate'],
  relatedTools: ['m4a-to-mp3', 'audio-cutter', 'audio-compressor'],
};
