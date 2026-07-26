'use client';

// 把多帧合成为「动画 WebP」（复用项目共享的 ffmpeg.wasm 实例）。
// 可变帧延迟用平均帧率近似（WebP 动画在 ffmpeg 中以固定帧率合成）。
// 仅用于浏览器端（client 组件调用）。getFFmpeg 顶层只 import 类，预渲染安全。

import { getFFmpeg, onProgress, type ProgressCallback } from '@/lib/video';
import type { GifFrame } from '@/lib/gif';

export async function encodeWebp(
  frames: GifFrame[],
  opts: { quality?: number; onProgress?: ProgressCallback },
): Promise<Blob> {
  if (!frames.length) throw new Error('no frames');
  const ff = await getFFmpeg();
  const unbind = opts.onProgress ? onProgress(ff, opts.onProgress) : null;
  const names: string[] = [];
  try {
    for (let i = 0; i < frames.length; i++) {
      const name = `wf${i.toString().padStart(4, '0')}.png`;
      const c = document.createElement('canvas');
      c.width = frames[i].imageData.width;
      c.height = frames[i].imageData.height;
      c.getContext('2d')!.putImageData(frames[i].imageData, 0, 0);
      const png = await new Promise<Blob | null>((res) => c.toBlob(res, 'image/png'));
      if (!png) throw new Error('png encode failed');
      await ff.writeFile(name, new Uint8Array(await png.arrayBuffer()));
      names.push(name);
    }
    const avgDelay = frames.reduce((s, f) => s + f.delay, 0) / frames.length;
    const fps = Math.max(1, Math.round(1000 / (avgDelay || 100)));
    // quality 1-20（GIF 语义：越小越好）映射到 WebP q 0-100（越大越好）
    const q = opts.quality != null ? Math.round(((opts.quality - 1) / 19) * 100) : 100;
    const out = 'wf_out.webp';
    await ff.exec([
      '-r', String(fps),
      '-i', 'wf%04d.png',
      '-loop', '0',
      '-c:v', 'libwebp',
      '-quality', String(q),
      '-lossless', '0',
      out,
    ]);
    const data = (await ff.readFile(out)) as Uint8Array;
    return new Blob([new Uint8Array(data)], { type: 'image/webp' });
  } finally {
    for (const n of names) {
      try { await ff.deleteFile(n); } catch { /* ignore */ }
    }
    try { await ff.deleteFile('wf_out.webp'); } catch { /* ignore */ }
    if (unbind) unbind();
  }
}
