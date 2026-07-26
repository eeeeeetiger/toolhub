import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'audio-recorder',
  name: 'Voice Recorder',
  description: 'Record audio from your microphone and download it as MP3 or WAV — right in your browser, no upload.',
  longDescription:
    'A simple, private voice recorder that runs entirely in your browser. Hit record, capture from your microphone with the MediaRecorder API, preview the clip, and download it as an MP3 or WAV file. Nothing is uploaded to any server.',
  category: 'audio',
  keywords: ['voice recorder', 'audio recorder', 'record audio online', 'mic recorder'],
  icon: 'Music',
  isClientOnly: true,
  features: ['Mic capture', 'MP3 / WAV output', 'Live preview', 'Local only'],
  relatedTools: ['audio-cutter', 'audio-merger'],
};
