import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'bpm-detector',
  name: 'BPM Detector',
  description: 'Estimate the tempo (BPM) of any song or beat.',
  longDescription:
    'Drop in a track and get an estimated beats-per-minute reading. This tool uses web-audio-beat-detector in the browser with a 40–200 BPM range, so slow ballads are not misread as double-time tempos. Everything is analyzed locally on your device.',
  category: 'audio',
  keywords: ['bpm detector', 'tempo finder', 'detect bpm', 'beats per minute'],
  icon: 'Activity',
  isClientOnly: true,
  features: ['Estimate BPM', 'No upload', 'Instant'],
  relatedTools: ['audio-speed', 'reverse-audio', 'audio-converter'],
};
