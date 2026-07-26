// Web Worker: all image compression runs here (off the main thread) so the UI
// stays responsive. Decodes via createImageBitmap + OffscreenCanvas, encodes
// per format:
//   - JPG         -> MozJPEG (wasm) — re-compresses existing JPGs smaller
//   - WebP        -> libwebp (wasm, SIMD auto-detected) — same as MozJPEG, a
//                    real encoder instead of Canvas convertToBlob so re-pressing
//                    an existing WebP actually shrinks instead of bloating.
//   - PNG (quant) -> UPNG.encode with color quantization (lossy, small files)
//   - PNG (lossless) -> UPNG.encode (no palette) -> oxipng WASM optimize
// Also supports an "estimate" job: compress a ~100px thumbnail and extrapolate
// the full-size result by area ratio with a per-format fudge exponent.

import UPNG from 'upng-js';
import { init as initOxipng } from '@jsquash/oxipng/optimise.js';
// MozJPEG encoder — far better than Canvas convertToBlob for JPG: it applies
// optimize_coding + progressive + trellis by default, so re-compressing a JPG
// actually shrinks it instead of bloating it (the old Canvas path did).
import { init as initJpeg } from '@jsquash/jpeg/encode.js';
import encodeJpegMoz from '@jsquash/jpeg/encode.js';
// libwebp encoder (same Squoosh lineage as MozJPEG). It auto-detects SIMD and
// picks the matching wasm glue internally; we just pre-compile the wasm from
// /public and hand it to init() (same pattern as MozJPEG — avoids the worker
// bundle's relative wasm path 404ing).
import { init as initWebp } from '@jsquash/webp/encode.js';
import encodeWebpLib from '@jsquash/webp/encode.js';
import { simd as detectSimd } from 'wasm-feature-detect';

export type WorkerFormat = 'original' | 'image/jpeg' | 'image/webp';
export type PngMode = 'quant' | 'lossless';

export interface WorkerRequest {
  id: string;
  // Transferable ArrayBuffer of the file bytes (avoids structured-clone copy).
  buffer: ArrayBuffer;
  name: string; // original file name (for type detection + ext)
  type: string; // file.type, e.g. "image/png"
  format: WorkerFormat;
  quality: number; // 1-100, used for JPG/WebP and PNG quant level
  pngMode: PngMode;
  job: 'compress' | 'estimate';
}

export interface WorkerResult {
  id: string;
  job: 'compress' | 'estimate';
  ok: boolean;
  // Transferable ArrayBuffer back to main thread.
  bytes?: ArrayBuffer;
  size?: number;
  width?: number;
  height?: number;
  estimated?: boolean;
  outExt?: string;
  error?: string;
}

// The three formats this tool can actually re-encode / compress.
function isSupportedImage(type: string): boolean {
  return (
    type === 'image/png' ||
    type === 'image/jpeg' ||
    type === 'image/webp'
  );
}

// oxipng wasm is served same-origin from /public so nothing is fetched from a
// CDN (keeps the tool fully private / offline-capable).
let oxipngReady: Promise<unknown> | null = null;
function ensureOxipng(): Promise<unknown> {
  if (!oxipngReady) {
    oxipngReady = initOxipng('/oxipng_bg.wasm');
  }
  return oxipngReady;
}

// MozJPEG wasm is served same-origin from /public/mozjpeg_enc.wasm (we copied it
// there from the @jsquash/jpeg package). jsquash init() expects a compiled
// WebAssembly.Module, so we fetch + compile it ourselves.
let jpegReady: Promise<unknown> | null = null;
function ensureJpeg(): Promise<unknown> {
  if (!jpegReady) {
    jpegReady = (async () => {
      const res = await fetch('/mozjpeg_enc.wasm');
      const bytes = await res.arrayBuffer();
      const module = await WebAssembly.compile(bytes);
      await initJpeg(module);
    })();
  }
  return jpegReady;
}

// libwebp wasm is served same-origin from /public. There are two flavours:
// webp_enc.wasm (baseline) and webp_enc_simd.wasm (SIMD-accelerated). We probe
// the device, fetch + compile the matching one, and pass the compiled module to
// init() so the encoder uses it instead of trying to fetch a relative path.
let webpReady: Promise<unknown> | null = null;
function ensureWebp(): Promise<unknown> {
  if (!webpReady) {
    webpReady = (async () => {
      const useSimd = await detectSimd();
      const url = useSimd ? '/webp_enc_simd.wasm' : '/webp_enc.wasm';
      const res = await fetch(url);
      const bytes = await res.arrayBuffer();
      const module = await WebAssembly.compile(bytes);
      await initWebp(module);
    })();
  }
  return webpReady;
}

function detectOutExt(name: string, format: WorkerFormat, sourceType: string): string {
  if (format === 'image/jpeg') return 'jpg';
  if (format === 'image/webp') return 'webp';
  // original: keep source extension
  const m = /\.([^.]+)$/.exec(name);
  if (m) return m[1].toLowerCase();
  if (sourceType.includes('png')) return 'png';
  if (sourceType.includes('jpeg') || sourceType.includes('jpg')) return 'jpg';
  if (sourceType.includes('webp')) return 'webp';
  return 'png';
}

// Map quality 1-100 -> UPNG quantization color count.
// 100 => no quantization (lossless RGBA), lower => fewer colors => smaller file.
function qualityToPngPS(quality: number): number {
  if (quality >= 100) return 0;
  if (quality >= 90) return 256;
  if (quality >= 80) return 192;
  if (quality >= 70) return 128;
  if (quality >= 60) return 96;
  if (quality >= 50) return 64;
  if (quality >= 40) return 48;
  if (quality >= 30) return 32;
  if (quality >= 20) return 24;
  return 16;
}

async function decode(file: File): Promise<{ bmp: ImageBitmap; w: number; h: number }> {
  const bmp = await createImageBitmap(file);
  return { bmp, w: bmp.width, h: bmp.height };
}

function getImageData(bmp: ImageBitmap, w: number, h: number): ImageData {
  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('OffscreenCanvas 2D context not supported');
  ctx.drawImage(bmp, 0, 0);
  return ctx.getImageData(0, 0, w, h);
}

async function encode(
  bmp: ImageBitmap,
  w: number,
  h: number,
  format: WorkerFormat,
  sourceType: string,
  quality: number,
  pngMode: PngMode
): Promise<{ bytes: ArrayBuffer; outExt: string }> {
  // Resolve effective output type.
  let effType = format === 'original' ? sourceType || 'image/png' : format;

  if (effType === 'image/jpeg' || effType === 'image/webp') {
    // JPG is encoded with MozJPEG (not Canvas convertToBlob) so re-compressing
    // an existing JPG actually shrinks it instead of bloating it. Canvas fills
    // the white background only when we must flatten a non-JPG source (PNG/WebP
    // alpha) into JPG; for an already-JPG source we draw straight onto a
    // transparent canvas and let MozJPEG handle it.
    const needsWhiteBg = effType === 'image/jpeg' && sourceType !== 'image/jpeg';
    const canvas = new OffscreenCanvas(w, h);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('OffscreenCanvas 2D context not supported');
    if (needsWhiteBg) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
    }
    ctx.drawImage(bmp, 0, 0);
    const imageData = ctx.getImageData(0, 0, w, h);

    if (effType === 'image/jpeg') {
      await ensureJpeg();
      const buf = await encodeJpegMoz(imageData, { quality });
      return { bytes: buf, outExt: 'jpg' };
    }

    // WebP is encoded with libwebp (not Canvas convertToBlob) so re-compressing
    // an existing WebP actually shrinks it instead of bloating it. libwebp keeps
    // the alpha channel (transparency) intact, unlike the JPG path above.
    await ensureWebp();
    const buf = await encodeWebpLib(imageData, { quality });
    return { bytes: buf, outExt: 'webp' };
  }

  // PNG path — UPNG.encode returns an ArrayBuffer (not a Uint8Array).
  const imageData = getImageData(bmp, w, h);
  const rgba = imageData.data;

  if (pngMode === 'lossless') {
    // Lossless: encode without quantization (ps=0), then optimize via oxipng WASM.
    const raw = UPNG.encode([rgba.buffer], w, h, 0, false, false);
    await ensureOxipng();
    const { optimise } = await import('@jsquash/oxipng');
    const optBuf = (await optimise(raw, { level: 2, optimiseAlpha: true })) as ArrayBuffer;
    return { bytes: optBuf, outExt: 'png' };
  }

  // Quantized (lossy) PNG — the high-compression default.
  const ps = qualityToPngPS(quality);
  const encoded = UPNG.encode([rgba.buffer], w, h, ps, false, false);
  return { bytes: encoded, outExt: 'png' };
}

// Estimate full-size output by compressing a small (max 120px) thumbnail and
// scaling by area ratio with a per-format fudge exponent (compression is
// sub-linear in area: larger images compress relatively better).
async function estimate(
  bmp: ImageBitmap,
  w: number,
  h: number,
  format: WorkerFormat,
  sourceType: string,
  quality: number,
  pngMode: PngMode
): Promise<{ size: number; width: number; height: number }> {
  // Use a moderately large preview (256px) so its complexity profile matches
  // the full image much better than a 120px thumbnail would, keeping the
  // area-ratio extrapolation accurate.
  const MAX = 256;
  const scale = Math.min(1, MAX / Math.max(w, h));
  const sw = Math.max(1, Math.round(w * scale));
  const sh = Math.max(1, Math.round(h * scale));

  const { bytes } = await encode(
    await makeScaledBitmap(bmp, w, h, sw, sh),
    sw,
    sh,
    format,
    sourceType,
    quality,
    pngMode
  );
  const smallSize = bytes.byteLength;

  // Sub-linear scaling: larger images compress relatively better, but the
  // exponent is kept low because the preview is already large (256px), so the
  // area ratio is small and the extrapolation stays close to reality.
  const fudge: Record<string, number> = {
    'image/jpeg': 0.5,
    'image/webp': 0.55,
    png: 0.6,
  };
  const effType = format === 'original' ? sourceType || 'image/png' : format;
  let key = 'png';
  if (effType === 'image/jpeg') key = 'image/jpeg';
  else if (effType === 'image/webp') key = 'image/webp';
  const exp = fudge[key] ?? 0.55;

  const areaRatio = (w * h) / (sw * sh);
  const est = Math.max(1, Math.round(smallSize * Math.pow(areaRatio, exp)));
  return { size: est, width: w, height: h };
}

async function makeScaledBitmap(
  bmp: ImageBitmap,
  _w: number,
  _h: number,
  sw: number,
  sh: number
): Promise<ImageBitmap> {
  const canvas = new OffscreenCanvas(sw, sh);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('OffscreenCanvas 2D context not supported');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bmp, 0, 0, sw, sh);
  return createImageBitmap(canvas);
}

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const req = e.data;
  const file = new File([req.buffer], req.name, { type: req.type });
  try {
    let bytes: ArrayBuffer | null = null;
    let size = 0;
    let outExt = detectOutExt(req.name, req.format, req.type);

    // "Original format" on a source we can't re-encode (e.g. GIF/BMP/TIFF):
    // output it untouched — no compression, no format change. This is the
    // safest "original format" behavior for unsupported types.
    const originalUnsupported =
      req.format === 'original' && !isSupportedImage(req.type);

    if (originalUnsupported) {
      bytes = req.buffer;
      size = bytes.byteLength;
      outExt = detectOutExt(req.name, 'original', req.type);
      const res: WorkerResult = {
        id: req.id,
        job: req.job,
        ok: true,
        size,
        outExt,
        estimated: req.job === 'estimate',
        bytes,
      };
      (self as unknown as Worker).postMessage(res, [bytes]);
      return;
    }

    const { bmp, w, h } = await decode(file);

    if (req.job === 'estimate') {
      const est = await estimate(bmp, w, h, req.format, req.type, req.quality, req.pngMode);
      size = est.size;
    } else {
      const enc = await encode(bmp, w, h, req.format, req.type, req.quality, req.pngMode);
      bytes = enc.bytes;
      size = bytes.byteLength;
      outExt = enc.outExt;

      // "Original format" mode promise: never produce a LARGER file than the
      // source. If re-compression didn't help (e.g. the source was already
      // maximally compressed), fall back to the untouched original bytes.
      // Covers JPG (MozJPEG), WebP (Canvas) and PNG (UPNG/oxipng) sources.
      if (req.format === 'original' && bytes.byteLength >= req.buffer.byteLength) {
        bytes = req.buffer;
        size = bytes.byteLength;
        outExt = detectOutExt(req.name, 'original', req.type);
      }
    }

    bmp.close?.();

    const res: WorkerResult = {
      id: req.id,
      job: req.job,
      ok: true,
      size,
      width: w,
      height: h,
      outExt,
      estimated: req.job === 'estimate',
    };
    if (bytes) {
      // bytes is an ArrayBuffer — transfer it directly to avoid a copy.
      res.bytes = bytes;
      (self as unknown as Worker).postMessage(res, [bytes]);
    } else {
      (self as unknown as Worker).postMessage(res);
    }
  } catch (err) {
    const res: WorkerResult = {
      id: req.id,
      job: req.job,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
    (self as unknown as Worker).postMessage(res);
  }
};
