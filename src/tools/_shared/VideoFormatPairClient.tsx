'use client';

import { usePathname } from 'next/navigation';
import VideoConverterClient from '@/tools/video-converter/VideoConverterClient';

type Fmt = 'mp4' | 'mov' | 'webm' | 'avi' | 'mkv' | 'gif';

const MAP: Record<string, Fmt> = {
  'mov-to-mp4': 'mp4',
  'mkv-to-mp4': 'mp4',
  'webm-to-mp4': 'mp4',
  'avi-to-mp4': 'mp4',
  'mp4-to-webm': 'webm',
  'mp4-to-mov': 'mov',
};

// 格式对落地页：从 URL 推导 slug，复用视频转换内核并锁定目标格式。
export default function VideoFormatPairClient() {
  const slug = (usePathname() || '').replace(/^\/tools\//, '').replace(/\/$/, '');
  return <VideoConverterClient lockedTarget={MAP[slug] ?? 'mp4'} />;
}
