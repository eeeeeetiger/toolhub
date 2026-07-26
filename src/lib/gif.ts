// 共享 GIF 工具库：解码（gifuct-js）/ 编码（gif.js）/ 帧变换 / 表情包文字叠加。
// 仅用于浏览器端（client 组件调用）。gif.js 与 gifuct-js 均按需在浏览器内动态 import，避免 SSR 报错。

export interface GifFrame {
  imageData: ImageData;
  delay: number; // 毫秒
}

export interface DecodedGif {
  width: number;
  height: number;
  frames: GifFrame[];
}

export interface MemeTextConfig {
  topText: string;
  bottomText: string;
  fontFamily: string; // CSS font-family，如 'Impact, sans-serif'
  fontScale: number; // 字号占画布宽度的比例，如 0.09
  textColor: string;
  strokeColor: string;
  strokeWidth: number; // 描边像素宽度（0 = 无描边）
}

// ---------- 画布辅助 ----------

function imgDataToCanvas(imageData: ImageData): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = imageData.width;
  c.height = imageData.height;
  c.getContext('2d')!.putImageData(imageData, 0, 0);
  return c;
}

export function frameToCanvas(frame: GifFrame): HTMLCanvasElement {
  return imgDataToCanvas(frame.imageData);
}

export function cloneImageData(imageData: ImageData): ImageData {
  return new ImageData(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height);
}

// ---------- 解码 ----------

export async function decodeGif(buffer: ArrayBuffer): Promise<DecodedGif> {
  const { parseGIF, decompressFrames } = await import('gifuct-js');
  const gif = parseGIF(buffer);
  const raw = decompressFrames(gif, true);
  const width = gif.lsd.width;
  const height = gif.lsd.height;

  const frames: GifFrame[] = [];
  let full = new ImageData(width, height);
  let saved: ImageData | null = null;
  let prevDisposal = 0;
  let prevDims = { top: 0, left: 0, width, height };

  const clearRect = (img: ImageData, d: { top: number; left: number; width: number; height: number }) => {
    for (let y = 0; y < d.height; y++) {
      for (let x = 0; x < d.width; x++) {
        const idx = ((d.top + y) * width + (d.left + x)) * 4;
        img.data[idx + 3] = 0;
      }
    }
  };

  for (const frame of raw) {
    const dims = frame.dims as { top: number; left: number; width: number; height: number };
    const patch = frame.patch as Uint8ClampedArray;

    // 应用上一帧的处置方式
    if (prevDisposal === 2) {
      clearRect(full, prevDims);
    } else if (prevDisposal === 3 && saved) {
      full = cloneImageData(saved);
    }

    // 把当前帧补丁放到全尺寸画布上的对应位置
    const patchFull = new ImageData(width, height);
    let i = 0;
    for (let y = 0; y < dims.height; y++) {
      for (let x = 0; x < dims.width; x++) {
        const dst = ((dims.top + y) * width + (dims.left + x)) * 4;
        patchFull.data[dst] = patch[i++];
        patchFull.data[dst + 1] = patch[i++];
        patchFull.data[dst + 2] = patch[i++];
        patchFull.data[dst + 3] = patch[i++];
      }
    }

    // 合成：补丁不透明像素覆盖到全帧
    for (let p = 0; p < width * height * 4; p += 4) {
      if (patchFull.data[p + 3] !== 0) {
        full.data[p] = patchFull.data[p];
        full.data[p + 1] = patchFull.data[p + 1];
        full.data[p + 2] = patchFull.data[p + 2];
        full.data[p + 3] = patchFull.data[p + 3];
      }
    }

    frames.push({
      imageData: cloneImageData(full),
      delay: frame.delay && frame.delay > 0 ? frame.delay : 100,
    });

    prevDisposal = frame.disposalType;
    prevDims = dims;
    if (frame.disposalType === 3) {
      saved = cloneImageData(full);
    }
  }

  return { width, height, frames };
}

// ---------- WebP 解码（支持动画逐帧） ----------

export async function decodeWebp(buffer: ArrayBuffer): Promise<DecodedGif> {
  const ImageDecoderCtor = (globalThis as any).ImageDecoder;
  if (ImageDecoderCtor) {
    try {
      const dec = new ImageDecoderCtor({ data: buffer, type: 'image/webp' });
      await dec.tracks.ready;
      const frames: GifFrame[] = [];
      let i = 0;
      while (true) {
        try {
          const { image } = await dec.decode({ frameIndex: i });
          const bmp = await createImageBitmap(image as any);
          const c = document.createElement('canvas');
          c.width = bmp.width;
          c.height = bmp.height;
          const ctx = c.getContext('2d')!;
          ctx.drawImage(bmp, 0, 0);
          const imageData = ctx.getImageData(0, 0, c.width, c.height);
          let delay = 100;
          if (typeof (image as any).duration === 'number' && (image as any).duration > 0) {
            delay = Math.round((image as any).duration / 1000); // 微秒 → 毫秒
          }
          frames.push({ imageData, delay });
          if (bmp.close) bmp.close();
          image.close();
          i++;
        } catch {
          break;
        }
      }
      dec.close();
      if (frames.length > 0) {
        return { width: frames[0].imageData.width, height: frames[0].imageData.height, frames };
      }
    } catch {
      /* 不支持或解码失败，落到 fallback */
    }
  }
  // Fallback：浏览器不支持 ImageDecoder 时，用原生解码取首帧（静态图正常，动画图仅首帧）
  const bmp = await createImageBitmap(new Blob([buffer], { type: 'image/webp' }));
  const c = document.createElement('canvas');
  c.width = bmp.width;
  c.height = bmp.height;
  const ctx = c.getContext('2d')!;
  ctx.drawImage(bmp, 0, 0);
  const imageData = ctx.getImageData(0, 0, c.width, c.height);
  if (bmp.close) bmp.close();
  return { width: c.width, height: c.height, frames: [{ imageData, delay: 100 }] };
}

// ---------- 编码 ----------

export async function encodeGif(
  frames: GifFrame[],
  opts: { width: number; height: number; quality?: number; repeat?: number; onProgress?: (p: number) => void },
): Promise<Blob> {
  const mod = (await import('gif.js')) as any;
  const GIF = mod.default ?? mod;
  return new Promise<Blob>((resolve, reject) => {
    const gif = new GIF({
      workers: 2,
      quality: opts.quality ?? 10,
      workerScript: '/gif.worker.js',
      width: opts.width,
      height: opts.height,
      repeat: opts.repeat ?? 0,
    });
    frames.forEach((f) => gif.addFrame(f.imageData, { delay: f.delay, copy: true }));
    if (opts.onProgress) gif.on('progress', (p: number) => opts.onProgress!(p));
    gif.on('finished', (blob: Blob) => resolve(blob));
    gif.on('abort', () => reject(new Error('GIF 编码被中止')));
    gif.render();
  });
}

// ---------- 帧变换 ----------

export function resizeImageData(imageData: ImageData, w: number, h: number, bg = '#ffffff'): ImageData {
  const src = imgDataToCanvas(imageData);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  if (bg) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
  }
  const scale = Math.min(w / imageData.width, h / imageData.height);
  const dw = Math.round(imageData.width * scale);
  const dh = Math.round(imageData.height * scale);
  ctx.drawImage(src, (w - dw) / 2, (h - dh) / 2, dw, dh);
  return ctx.getImageData(0, 0, w, h);
}

export function scaleFrames(frames: GifFrame[], factor: number): GifFrame[] {
  const f = Math.max(0.05, Math.min(1, factor));
  return frames.map((fr) => ({
    imageData: resizeImageData(fr.imageData, Math.round(fr.imageData.width * f), Math.round(fr.imageData.height * f)),
    delay: fr.delay,
  }));
}

export function reverseFrames(frames: GifFrame[]): GifFrame[] {
  return [...frames].reverse();
}

export function sampleFrames(frames: GifFrame[], step: number): GifFrame[] {
  const s = Math.max(1, Math.round(step));
  return frames.filter((_, i) => i % s === 0);
}

export function setSpeed(frames: GifFrame[], multiplier: number): GifFrame[] {
  const m = Math.max(0.1, multiplier);
  return frames.map((fr) => ({ imageData: fr.imageData, delay: Math.max(20, Math.round(fr.delay / m)) }));
}

export function cropFrames(frames: GifFrame[], rect: { x: number; y: number; w: number; h: number }): GifFrame[] {
  return frames.map((fr) => {
    const c = document.createElement('canvas');
    c.width = rect.w;
    c.height = rect.h;
    const ctx = c.getContext('2d')!;
    const src = imgDataToCanvas(fr.imageData);
    ctx.drawImage(src, -rect.x, -rect.y);
    return { imageData: ctx.getImageData(0, 0, rect.w, rect.h), delay: fr.delay };
  });
}

// ---------- 表情包文字叠加 ----------

export function drawMemeText(ctx: CanvasRenderingContext2D, w: number, h: number, cfg: MemeTextConfig): void {
  const baseSize = Math.max(8, Math.round(w * cfg.fontScale));
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';

  const drawLine = (text: string, y: number) => {
    let size = baseSize;
    ctx.font = `bold ${size}px ${cfg.fontFamily}`;
    // 自动收缩以适应宽度
    while (ctx.measureText(text).width > w * 0.94 && size > 8) {
      size -= 1;
      ctx.font = `bold ${size}px ${cfg.fontFamily}`;
    }
    if (cfg.strokeWidth > 0) {
      ctx.lineWidth = cfg.strokeWidth;
      ctx.strokeStyle = cfg.strokeColor;
      ctx.strokeText(text, w / 2, y);
    }
    ctx.fillStyle = cfg.textColor;
    ctx.fillText(text, w / 2, y);
  };

  if (cfg.topText) drawLine(cfg.topText, baseSize * 0.9);
  if (cfg.bottomText) drawLine(cfg.bottomText, h - baseSize * 0.9);
}

export function applyTextToImageData(imageData: ImageData, cfg: MemeTextConfig): ImageData {
  if (!cfg.topText && !cfg.bottomText) return imageData;
  const c = imgDataToCanvas(imageData);
  const ctx = c.getContext('2d')!;
  drawMemeText(ctx, c.width, c.height, cfg);
  return ctx.getImageData(0, 0, c.width, c.height);
}

export function applyTextToFrames(frames: GifFrame[], cfg: MemeTextConfig): GifFrame[] {
  if (!cfg.topText && !cfg.bottomText) return frames;
  return frames.map((fr) => ({
    imageData: applyTextToImageData(fr.imageData, cfg),
    delay: fr.delay,
  }));
}

// ---------- 文件下载 ----------

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function imageDataToBlob(imageData: ImageData, type = 'image/png'): Promise<Blob> {
  const c = imgDataToCanvas(imageData);
  return new Promise((resolve, reject) => {
    c.toBlob((b) => (b ? resolve(b) : reject(new Error('导出失败'))), type);
  });
}
