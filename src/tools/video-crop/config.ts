import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'video-crop',
  name: 'Video Crop',
  description: 'Crop the frame of a video to remove black bars or change aspect ratio — all in your browser.',
  longDescription:
    'Crop videos without uploading them to any server. Video Crop runs entirely in your browser using ffmpeg.wasm: cut away black bars or carve out a custom box by entering width, height and the top-left corner in pixels. Your video never leaves your device.',
  category: 'video',
  keywords: ['video crop', 'crop video', 'remove black bars', 'trim frame', 'video aspect ratio'],
  icon: 'Video',
  isClientOnly: true,
  features: [
    'Remove black bars',
    'Custom box',
    'Keep ratio',
    'Local only',
  ],

  howTo: [
    'Open Video Crop in your browser.',
    'Add your video file.',
    'Choose the options you need, then process it locally with ffmpeg.wasm.',
    'Download the result — your video never leaves your device.',
  ],
  faqs: [
    { q: 'Is Video Crop free?', a: 'Yes, it is free and runs entirely in your browser.' },
    { q: 'Are my videos uploaded?', a: 'No. Videos are processed locally with ffmpeg.wasm for privacy.' },
    { q: 'What video formats are supported?', a: 'MP4, MOV, WebM, AVI, MKV and more depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
  ],
};