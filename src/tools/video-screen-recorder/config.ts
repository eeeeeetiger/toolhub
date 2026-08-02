import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'video-screen-recorder',
  name: 'Screen Recorder',
  description: 'Record your screen (camera, tab or window) right in your browser — no upload, fully private.',
  longDescription:
    'Record your screen, a browser tab or a window without sending anything to a server. Screen Recorder uses the MediaRecorder API and getDisplayMedia to capture video and audio entirely on your device, then lets you download the result as a file. Your recording never leaves your browser.',
  category: 'video',
  keywords: ['screen recorder', 'record screen', 'screen capture', 'webcam recorder', 'video recorder'],
  icon: 'Video',
  isClientOnly: true,
  features: [
    'Record screen',
    'Webcam option',
    'Download MP4',
    '100% local',
  ],

  howTo: [
    'Open Screen Recorder in your browser.',
    'Add your video file.',
    'Choose the options you need, then process it locally with ffmpeg.wasm.',
    'Download the result — your video never leaves your device.',
  ],
  faqs: [
    { q: 'Is Screen Recorder free?', a: 'Yes, it is free and runs entirely in your browser.' },
    { q: 'Are my videos uploaded?', a: 'No. Videos are processed locally with ffmpeg.wasm for privacy.' },
    { q: 'What video formats are supported?', a: 'MP4, MOV, WebM, AVI, MKV and more depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
  ],
};