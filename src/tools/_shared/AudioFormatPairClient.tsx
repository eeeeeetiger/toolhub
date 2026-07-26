'use client';

import { usePathname } from 'next/navigation';
import AudioConvertCore from '@/tools/_shared/audio-convert-core';

type Fmt = 'mp3' | 'wav' | 'm4a' | 'ogg' | 'flac';

const MAP: Record<string, { target: Fmt; accept: string }> = {
  'wav-to-mp3': { target: 'mp3', accept: 'audio/*' },
  'flac-to-mp3': { target: 'mp3', accept: 'audio/*' },
  'ogg-to-mp3': { target: 'mp3', accept: 'audio/*' },
  'mp3-to-wav': { target: 'wav', accept: 'audio/*' },
  'm4a-to-wav': { target: 'wav', accept: 'audio/*' },
  'wav-to-flac': { target: 'flac', accept: 'audio/*' },
  'video-to-mp3': { target: 'mp3', accept: 'video/*' },
};

// 格式对落地页：从 URL 推导 slug，复用音频转换内核并锁定目标格式。
export default function AudioFormatPairClient() {
  const slug = (usePathname() || '').replace(/^\/tools\//, '').replace(/\/$/, '');
  const m = MAP[slug] ?? { target: 'mp3' as Fmt, accept: 'audio/*' };
  return <AudioConvertCore lockedTarget={m.target} accept={m.accept} />;
}
