'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { Upload, Trash2, Download, Image as ImageIcon, Wand2 } from 'lucide-react';
import { useI18n } from '@/i18n';

type ExportFormat = 'image/png' | 'image/jpeg' | 'image/webp';

interface Loaded {
  file: File;
  name: string;
  base: string;
  width: number;
  height: number;
  mimeType: string;
  url: string;
  el: HTMLImageElement;
}

interface Settings {
  scale: 1 | 2 | 4;
  sharpen: number; // 0..100
  denoise: number; // 0..100
  brightness: number; // -100..100
  contrast: number; // -100..100
}

function clamp255(v: number): number { return v < 0 ? 0 : v > 255 ? 255 : v; }

// High-quality stepped upscale using progressive 2x draws with smoothing.
function upscaleCanvas(src: HTMLImageElement | HTMLCanvasElement, sw: number, sh: number, factor: number): HTMLCanvasElement {
  let curW = sw, curH = sh;
  let cur: HTMLImageElement | HTMLCanvasElement = src;
  const targetW = sw * factor, targetH = sh * factor;
  // Step by 2x until we reach/exceed target, then final draw to exact size.
  while (curW * 2 <= targetW && curH * 2 <= targetH) {
    const c = document.createElement('canvas');
    c.width = curW * 2; c.height = curH * 2;
    const ctx = c.getContext('2d')!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(cur, 0, 0, c.width, c.height);
    cur = c; curW = c.width; curH = c.height;
  }
  const out = document.createElement('canvas');
  out.width = targetW; out.height = targetH;
  const octx = out.getContext('2d')!;
  octx.imageSmoothingEnabled = true;
  octx.imageSmoothingQuality = 'high';
  octx.drawImage(cur, 0, 0, targetW, targetH);
  return out;
}

// Apply a 3x3 convolution kernel to ImageData (in place on a copy).
function convolve(data: ImageData, kernel: number[], divisor: number, bias: number): ImageData {
  const { width: w, height: h } = data;
  const src = data.data;
  const out = new Uint8ClampedArray(src.length);
  const k = kernel;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r = 0, g = 0, b = 0;
      let ki = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const px = Math.min(w - 1, Math.max(0, x + dx));
          const py = Math.min(h - 1, Math.max(0, y + dy));
          const idx = (py * w + px) * 4;
          const kv = k[ki++];
          r += src[idx] * kv;
          g += src[idx + 1] * kv;
          b += src[idx + 2] * kv;
        }
      }
      const o = (y * w + x) * 4;
      out[o] = clamp255(r / divisor + bias);
      out[o + 1] = clamp255(g / divisor + bias);
      out[o + 2] = clamp255(b / divisor + bias);
      out[o + 3] = src[o + 3];
    }
  }
  return new ImageData(out, w, h);
}

// Blend two ImageData by alpha (a: base weight for `base`, 1-a for `other`).
function blend(base: ImageData, other: ImageData, w: number): ImageData {
  const out = new Uint8ClampedArray(base.data.length);
  const A = base.data, B = other.data;
  for (let i = 0; i < A.length; i += 4) {
    out[i] = A[i] * (1 - w) + B[i] * w;
    out[i + 1] = A[i + 1] * (1 - w) + B[i + 1] * w;
    out[i + 2] = A[i + 2] * (1 - w) + B[i + 2] * w;
    out[i + 3] = A[i + 3];
  }
  return new ImageData(out, base.width, base.height);
}

function applyBrightnessContrast(data: ImageData, brightness: number, contrast: number): ImageData {
  const d = data.data;
  const b = brightness * 2.55; // -255..255
  const c = contrast / 100;
  const factor = (1 + c) / (1 - c || 0.0001); // contrast multiplier
  for (let i = 0; i < d.length; i += 4) {
    for (let ch = 0; ch < 3; ch++) {
      let v = d[i + ch] + b;
      v = factor * (v - 128) + 128;
      d[i + ch] = clamp255(v);
    }
  }
  return data;
}

// Full enhancement pipeline → returns a canvas at upscaled size.
function enhance(loaded: Loaded, s: Settings): HTMLCanvasElement {
  const base = upscaleCanvas(loaded.el, loaded.width, loaded.height, s.scale);
  const ctx = base.getContext('2d')!;
  let data = ctx.getImageData(0, 0, base.width, base.height);

  // Denoise: blend with a light box blur (3x3 average).
  if (s.denoise > 0) {
    const blurKernel = [1, 1, 1, 1, 1, 1, 1, 1, 1];
    const blurred = convolve(data, blurKernel, 9, 0);
    data = blend(data, blurred, (s.denoise / 100) * 0.8);
  }

  // Sharpen: unsharp-like kernel, strength scaled.
  if (s.sharpen > 0) {
    const amt = s.sharpen / 100; // 0..1
    // Kernel: center (1+4a), edges (-a). divisor 1.
    const a = amt;
    const kernel = [0, -a, 0, -a, 1 + 4 * a, -a, 0, -a, 0];
    const sharp = convolve(data, kernel, 1, 0);
    data = sharp;
  }

  // Brightness / contrast.
  if (s.brightness !== 0 || s.contrast !== 0) {
    data = applyBrightnessContrast(data, s.brightness, s.contrast);
  }

  ctx.putImageData(data, 0, 0);
  return base;
}

export default function UpscalerClient() {
  const { t } = useI18n();
  const tb = (k: string, f: string) => t(`tools.image-upscaler.ui.${k}`, f);

  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('image/png');
  const [quality, setQuality] = useState(92);
  const [sliderPos, setSliderPos] = useState(50);

  const [settings, setSettings] = useState<Settings>({ scale: 2, sharpen: 30, denoise: 10, brightness: 0, contrast: 8 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const beforeRef = useRef<HTMLCanvasElement>(null);
  const afterRef = useRef<HTMLCanvasElement>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const patch = useCallback((p: Partial<Settings>) => setSettings((s) => ({ ...s, ...p })), []);

  const loadFile = useCallback((file: File | null) => {
    if (!file || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return;
    const url = URL.createObjectURL(file);
    const el = new Image();
    el.onload = () => {
      setLoaded((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return {
          file, name: file.name, base: file.name.replace(/\.[^.]+$/, ''),
          width: el.naturalWidth, height: el.naturalHeight, mimeType: file.type, url, el,
        };
      });
    };
    el.onerror = () => URL.revokeObjectURL(url);
    el.src = url;
  }, []);

  // Draw the "before" (original) into its canvas.
  useEffect(() => {
    if (!loaded) return;
    const c = beforeRef.current;
    if (!c) return;
    c.width = loaded.width; c.height = loaded.height;
    const ctx = c.getContext('2d')!;
    ctx.drawImage(loaded.el, 0, 0);
  }, [loaded]);

  // Recompute enhanced result (debounced via rAF-ish setTimeout to keep UI responsive).
  const recompute = useCallback(() => {
    if (!loaded) return;
    setProcessing(true);
    // Defer heavy work so the slider UI stays responsive.
    setTimeout(() => {
      try {
        const result = enhance(loaded, settings);
        resultCanvasRef.current = result;
        const c = afterRef.current;
        if (c) {
          c.width = result.width; c.height = result.height;
          const ctx = c.getContext('2d')!;
          ctx.clearRect(0, 0, c.width, c.height);
          ctx.drawImage(result, 0, 0);
        }
      } finally {
        setProcessing(false);
      }
    }, 0);
  }, [loaded, settings]);

  useEffect(() => { recompute(); }, [recompute]);

  const doExport = async () => {
    const result = resultCanvasRef.current;
    if (!result || !loaded) return;
    setExporting(true);
    try {
      const q = format === 'image/png' ? undefined : quality / 100;
      const blob: Blob = await new Promise((res, rej) => result.toBlob((b) => (b ? res(b) : rej(new Error('fail'))), format, q));
      const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${loaded.base}-${settings.scale}x.${ext}`; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } finally {
      setExporting(false);
    }
  };

  const clearAll = () => {
    if (loaded) URL.revokeObjectURL(loaded.url);
    setLoaded(null);
    resultCanvasRef.current = null;
  };

  const onDrop = (e: DragEvent) => { e.preventDefault(); setDragOver(false); loadFile(e.dataTransfer.files?.[0] ?? null); };

  const outDim = useMemo(() => (loaded ? { w: loaded.width * settings.scale, h: loaded.height * settings.scale } : null), [loaded, settings.scale]);

  // Before/after slider drag.
  const sliderDragging = useRef(false);
  const onSliderDown = (e: ReactPointerEvent<HTMLDivElement>) => { sliderDragging.current = true; updateSlider(e); (e.target as HTMLElement).setPointerCapture(e.pointerId); };
  const onSliderMove = (e: ReactPointerEvent<HTMLDivElement>) => { if (sliderDragging.current) updateSlider(e); };
  const onSliderUp = (e: ReactPointerEvent<HTMLDivElement>) => { sliderDragging.current = false; try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* ignore */ } };
  const updateSlider = (e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const p = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(100, Math.max(0, p)));
  };

  return (
    <div className="space-y-5">
      {!loaded && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-colors ${dragOver ? 'border-brand bg-brand/5' : 'border-slate-300 bg-slate-50'}`}
        >
          <ImageIcon className="h-8 w-8 text-slate-400" />
          <p className="text-sm text-slate-500">{tb('dropHint', 'Drag & drop an image here, or use the button below')}</p>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
            <Upload className="h-4 w-4" /> {tb('addFile', 'Choose Image')}
          </button>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => loadFile(e.target.files?.[0] ?? null)} />
        </div>
      )}

      {loaded && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Before/After preview */}
          <div className="space-y-3">
            <div
              className="relative select-none overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
              style={{ aspectRatio: `${loaded.width} / ${loaded.height}`, touchAction: 'none' }}
              onPointerDown={onSliderDown}
              onPointerMove={onSliderMove}
              onPointerUp={onSliderUp}
            >
              {/* After (full, underneath) */}
              <canvas ref={afterRef} className="absolute inset-0 h-full w-full object-contain" style={{ imageRendering: 'auto' }} />
              {/* Before (clipped to left of slider) */}
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
                <canvas ref={beforeRef} className="h-full" style={{ width: `${100 / (sliderPos / 100)}%`, maxWidth: 'none' }} />
              </div>
              {/* Divider handle */}
              <div className="absolute inset-y-0 z-10 w-0.5 bg-white shadow" style={{ left: `${sliderPos}%` }}>
                <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-1.5 py-1 text-[10px] font-bold text-brand shadow">◀▶</div>
              </div>
              {/* Labels */}
              <span className="absolute left-2 top-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white">{tb('before', 'Before')}</span>
              <span className="absolute right-2 top-2 rounded bg-brand/80 px-1.5 py-0.5 text-[10px] font-medium text-white">{tb('after', 'After')}</span>
              {processing && <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-black/60 px-2 py-1 text-[11px] text-white">{tb('processing', 'Processing…')}</span>}
            </div>
            <p className="text-center text-xs text-slate-500">
              {tb('resolution', 'Resolution')}: {loaded.width}×{loaded.height} → <span className="font-medium text-slate-700">{outDim?.w}×{outDim?.h}</span>
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Scale */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">{tb('scale', 'Upscale factor')}</label>
              <div className="flex gap-2">
                {([1, 2, 4] as const).map((f) => (
                  <button key={f} type="button" onClick={() => patch({ scale: f })} className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${settings.scale === f ? 'border-brand bg-brand/[0.06] text-brand' : 'border-slate-200 text-slate-600 hover:border-brand/30'}`}>
                    {f}x
                  </button>
                ))}
              </div>
            </div>

            {/* Sharpen */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">{tb('sharpen', 'Sharpen')}: {settings.sharpen}</label>
              <input type="range" min={0} max={100} value={settings.sharpen} onChange={(e) => patch({ sharpen: Number(e.target.value) })} className="w-full accent-brand" />
            </div>

            {/* Denoise */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">{tb('denoise', 'Noise reduction')}: {settings.denoise}</label>
              <input type="range" min={0} max={100} value={settings.denoise} onChange={(e) => patch({ denoise: Number(e.target.value) })} className="w-full accent-brand" />
            </div>

            {/* Brightness */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">{tb('brightness', 'Brightness')}: {settings.brightness}</label>
              <input type="range" min={-100} max={100} value={settings.brightness} onChange={(e) => patch({ brightness: Number(e.target.value) })} className="w-full accent-brand" />
            </div>

            {/* Contrast */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">{tb('contrast', 'Contrast')}: {settings.contrast}</label>
              <input type="range" min={-100} max={100} value={settings.contrast} onChange={(e) => patch({ contrast: Number(e.target.value) })} className="w-full accent-brand" />
            </div>

            <button type="button" onClick={() => patch({ sharpen: 30, denoise: 10, brightness: 0, contrast: 8 })} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100">
              <Wand2 className="h-3.5 w-3.5" /> {tb('autoEnhance', 'Reset to auto')}
            </button>

            {/* Format */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">{tb('exportFormat', 'Export format')}</label>
              <select value={format} onChange={(e) => setFormat(e.target.value as ExportFormat)} className="w-full rounded-lg border border-slate-200 p-2 text-sm">
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPG</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>
            {format !== 'image/png' && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">{tb('quality', 'Quality')}: {quality}%</label>
                <input type="range" min={1} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-brand" />
              </div>
            )}

            <button type="button" onClick={doExport} disabled={exporting || processing} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60">
              <Download className="h-4 w-4" /> {exporting ? tb('exporting', 'Exporting…') : tb('download', 'Download')}
            </button>
            <button type="button" onClick={clearAll} className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-600">
              <Trash2 className="h-4 w-4" /> {tb('clear', 'Choose another')}
            </button>
            <p className="text-center text-[11px] text-slate-400">{tb('note', 'Lightweight local enhancement. Large 4x images may take a moment.')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
