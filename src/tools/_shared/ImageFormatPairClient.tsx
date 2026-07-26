'use client';

import { usePathname } from 'next/navigation';
import ImageConverterClient from '@/tools/image-converter/ImageConverterClient';

type Fmt = 'jpg' | 'png' | 'webp';

const MAP: Record<string, Fmt> = {
  'png-to-jpg': 'jpg',
  'jpg-to-png': 'png',
  'webp-to-jpg': 'jpg',
  'webp-to-png': 'png',
  'png-to-webp': 'webp',
  'jpg-to-webp': 'webp',
};

// 格式对落地页：从 URL 推导 slug，复用图片转换内核并锁定目标格式。
export default function ImageFormatPairClient() {
  const slug = (usePathname() || '').replace(/^\/tools\//, '').replace(/\/$/, '');
  return <ImageConverterClient lockedTarget={MAP[slug] ?? 'jpg'} />;
}
