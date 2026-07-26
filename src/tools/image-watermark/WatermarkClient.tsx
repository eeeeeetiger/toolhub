'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from 'react';
import { Upload, Trash2, Download, Type, ImagePlus, Image as ImageIcon, X, FolderOpen } from 'lucide-react';
import { useI18n } from '@/i18n';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type WmType = 'text' | 'logo';
type Anchor =
  | 'tl' | 'tc' | 'tr'
  | 'ml' | 'mc' | 'mr'
  | 'bl' | 'bc' | 'br';
type ExportFormat = 'original' | 'image/jpeg' | 'image/png' | 'image/webp';

interface ImageEntry {
  id: string;
  file: File;
  name: string;
  base: string;
  width: number;
  height: number;
  mimeType: string;
  url: string;
}

interface WmState {
  type: WmType;
  text: string;
  fontFamily: string;
  fontSize: number; // percent of image min-dimension
  color: string;
  bold: boolean;
  italic: boolean;
  stroke: boolean;
  strokeColor: string;
  shadow: boolean;
  opacity: number; // 0..100
  rotation: number; // degrees
  anchor: Anchor;
  margin: number; // percent of image min-dimension
  tiled: boolean;
  tileGap: number; // percent
  logoScale: number; // percent of image width
}

const FONTS = [
  { id: 'Arial, sans-serif', label: 'Sans (Arial)' },
  { id: 'Georgia, serif', label: 'Serif (Georgia)' },
  { id: '"Times New Roman", serif', label: 'Times' },
  { id: '"Courier New", monospace', label: 'Mono (Courier)' },
  { id: 'Impact, sans-serif', label: 'Impact' },
  { id: 'Verdana, sans-serif', label: 'Verdana' },
];

const ANCHORS: Anchor[] = ['tl', 'tc', 'tr', 'ml', 'mc', 'mr', 'bl', 'bc', 'br'];

const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

function makeId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function resolveOutputType(format: ExportFormat, sourceMime: string): string {
  if (format === 'original') return sourceMime || 'image/png';
  return format;
}
function supportsAlpha(t: string): boolean {
  return t === 'image/png' || t === 'image/webp';
}

function anchorPoint(anchor: Anchor, W: number, H: number, margin: number): { x: number; y: number; ax: number; ay: number } {
  const col = anchor[1]; // l/c/r
  const row = anchor[0]; // t/m/b
  let x = W / 2, ax = 0.5;
  let y = H / 2, ay = 0.5;
  if (col === 'l') { x = margin; ax = 0; }
  else if (col === 'r') { x = W - margin; ax = 1; }
  if (row === 't') { y = margin; ay = 0; }
  else if (row === 'b') { y = H - margin; ay = 1; }
  return { x, y, ax, ay };
}

// ---------------------------------------------------------------------------
// Render engine
// ---------------------------------------------------------------------------

function drawTextWatermark(ctx: CanvasRenderingContext2D, W: number, H: number, wm: WmState) {
  const min = Math.min(W, H);
  const fontPx = Math.max(8, (wm.fontSize / 100) * min);
  const weight = wm.bold ? 'bold' : 'normal';
  const style = wm.italic ? 'italic' : 'normal';
  ctx.font = `${style} ${weight} ${fontPx}px ${wm.fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = wm.color;
  ctx.globalAlpha = wm.opacity / 100;
  if (wm.shadow) {
    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = fontPx * 0.12;
    ctx.shadowOffsetX = fontPx * 0.04;
    ctx.shadowOffsetY = fontPx * 0.04;
  }
  const text = wm.text || 'Watermark';
  const metrics = ctx.measureText(text);
  const tw = metrics.width;
  const th = fontPx;

  const drawOne = (cx: number, cy: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((wm.rotation * Math.PI) / 180);
    if (wm.stroke) {
      ctx.lineWidth = Math.max(1, fontPx * 0.06);
      ctx.strokeStyle = wm.strokeColor;
      ctx.strokeText(text, 0, 0);
    }
    ctx.fillText(text, 0, 0);
    ctx.restore();
  };

  const margin = (wm.margin / 100) * min;
  if (wm.tiled) {
    ctx.shadowColor = 'transparent';
    const gap = (wm.tileGap / 100) * min;
    const stepX = tw + gap + 40;
    const stepY = th + gap + 40;
    for (let y = stepY / 2; y < H + stepY; y += stepY) {
      for (let x = stepX / 2; x < W + stepX; x += stepX) {
        drawOne(x, y);
      }
    }
  } else {
    const { x, y, ax, ay } = anchorPoint(wm.anchor, W, H, margin);
    // Shift so the text box sits inside the margin at edges.
    const cx = x + (ax === 0 ? tw / 2 : ax === 1 ? -tw / 2 : 0);
    const cy = y + (ay === 0 ? th / 2 : ay === 1 ? -th / 2 : 0);
    drawOne(cx, cy);
  }
  ctx.globalAlpha = 1;
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

function drawLogoWatermark(ctx: CanvasRenderingContext2D, W: number, H: number, wm: WmState, logo: HTMLImageElement) {
  const min = Math.min(W, H);
  const targetW = (wm.logoScale / 100) * W;
  const ratio = logo.naturalHeight / logo.naturalWidth;
  const lw = targetW;
  const lh = targetW * ratio;
  ctx.globalAlpha = wm.opacity / 100;
  const margin = (wm.margin / 100) * min;

  const drawOne = (cx: number, cy: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((wm.rotation * Math.PI) / 180);
    ctx.drawImage(logo, -lw / 2, -lh / 2, lw, lh);
    ctx.restore();
  };

  if (wm.tiled) {
    const gap = (wm.tileGap / 100) * min;
    const stepX = lw + gap + 20;
    const stepY = lh + gap + 20;
    for (let y = stepY / 2; y < H + stepY; y += stepY) {
      for (let x = stepX / 2; x < W + stepX; x += stepX) {
        drawOne(x, y);
      }
    }
  } else {
    const { x, y, ax, ay } = anchorPoint(wm.anchor, W, H, margin);
    const cx = x + (ax === 0 ? lw / 2 : ax === 1 ? -lw / 2 : 0);
    const cy = y + (ay === 0 ? lh / 2 : ay === 1 ? -lh / 2 : 0);
    drawOne(cx, cy);
  }
  ctx.globalAlpha = 1;
}

function renderToCanvas(base: HTMLImageElement, W: number, H: number, wm: WmState, logo: HTMLImageElement | null, outType: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  if (!supportsAlpha(outType)) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
  }
  ctx.drawImage(base, 0, 0, W, H);
  if (wm.type === 'text') drawTextWatermark(ctx, W, H, wm);
  else if (logo) drawLogoWatermark(ctx, W, H, wm, logo);
  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const q = supportsAlpha(type) ? undefined : quality / 100;
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), type, q);
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function WatermarkClient() {
  const { t } = useI18n();
  const tb = (k: string, f: string) => t(`tools.image-watermark.ui.${k}`, f);

  const [images, setImages] = useState<ImageEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('original');
  const [quality, setQuality] = useState(92);

  const [logo, setLogo] = useState<{ url: string; el: HTMLImageElement } | null>(null);

  const [wm, setWm] = useState<WmState>({
    type: 'text',
    text: '© Your Brand',
    fontFamily: FONTS[0].id,
    fontSize: 6,
    color: '#ffffff',
    bold: true,
    italic: false,
    stroke: false,
    strokeColor: '#000000',
    shadow: true,
    opacity: 70,
    rotation: 0,
    anchor: 'br',
    margin: 4,
    tiled: false,
    tileGap: 8,
    logoScale: 20,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const imgCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Make the folder input behave like a directory picker.
  useEffect(() => {
    const el = folderInputRef.current;
    if (el) {
      el.setAttribute('webkitdirectory', '');
      el.setAttribute('directory', '');
    }
  }, []);

  const active = useMemo(() => images.find((i) => i.id === activeId) ?? null, [images, activeId]);

  const patch = useCallback((p: Partial<WmState>) => setWm((w) => ({ ...w, ...p })), []);

  const loadImageMeta = useCallback((file: File): Promise<ImageEntry> => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const entry: ImageEntry = {
          id: makeId(),
          file,
          name: file.name,
          base: file.name.replace(/\.[^.]+$/, ''),
          width: img.naturalWidth,
          height: img.naturalHeight,
          mimeType: file.type,
          url,
        };
        imgCacheRef.current.set(entry.id, img);
        resolve(entry);
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('bad image')); };
      img.src = url;
    });
  }, []);

  const addFiles = useCallback(async (list: FileList | null) => {
    if (!list || !list.length) return;
    const imgs = Array.from(list).filter((f) => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type));
    if (!imgs.length) return;
    const entries = await Promise.all(imgs.map(loadImageMeta));
    setImages((prev) => {
      const next = [...prev, ...entries];
      setActiveId((a) => a ?? next[0]?.id ?? null);
      return next;
    });
  }, [loadImageMeta]);

  const loadLogo = useCallback((file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const el = new Image();
    el.onload = () => {
      setLogo((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { url, el };
      });
      setWm((w) => ({ ...w, type: 'logo' }));
    };
    el.onerror = () => URL.revokeObjectURL(url);
    el.src = url;
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) { URL.revokeObjectURL(target.url); imgCacheRef.current.delete(id); }
      const next = prev.filter((i) => i.id !== id);
      setActiveId((a) => (a === id ? next[0]?.id ?? null : a));
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    for (const it of images) { URL.revokeObjectURL(it.url); imgCacheRef.current.delete(it.id); }
    setImages([]);
    setActiveId(null);
  }, [images]);

  // Preview render
  const renderPreview = useCallback(() => {
    if (!active) return;
    const img = imgCacheRef.current.get(active.id);
    const canvas = previewRef.current;
    if (!img || !canvas) return;
    const outType = resolveOutputType(exportFormat, active.mimeType);
    const out = renderToCanvas(img, active.width, active.height, wm, logo?.el ?? null, outType);
    const ctx = canvas.getContext('2d')!;
    canvas.width = out.width;
    canvas.height = out.height;
    ctx.clearRect(0, 0, out.width, out.height);
    ctx.drawImage(out, 0, 0);
  }, [active, wm, logo, exportFormat]);

  useEffect(() => { renderPreview(); }, [renderPreview]);

  const doExport = async () => {
    if (!images.length) return;
    setExporting(true);
    try {
      const blobs: { name: string; blob: Blob }[] = [];
      for (const entry of images) {
        const img = imgCacheRef.current.get(entry.id);
        if (!img) continue;
        const outType = resolveOutputType(exportFormat, entry.mimeType);
        const canvas = renderToCanvas(img, entry.width, entry.height, wm, logo?.el ?? null, outType);
        const blob = await canvasToBlob(canvas, outType, quality);
        const ext = EXT[outType] ?? 'png';
        blobs.push({ name: `${entry.base}-watermarked.${ext}`, blob });
      }
      if (blobs.length === 1) {
        const { name, blob } = blobs[0];
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      } else {
        const { zipSync } = await import('fflate');
        const map: Record<string, Uint8Array> = {};
        const used = new Set<string>();
        for (const b of blobs) {
          let name = b.name;
          if (used.has(name)) { const dot = name.lastIndexOf('.'); let n = 1; while (used.has(`${name.slice(0, dot)}_${n}${name.slice(dot)}`)) n++; name = `${name.slice(0, dot)}_${n}${name.slice(dot)}`; }
          used.add(name);
          map[name] = new Uint8Array(await b.blob.arrayBuffer());
        }
        const zipped = zipSync(map, { level: 9 });
        const blob = new Blob([zipped as unknown as BlobPart], { type: 'application/zip' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'watermarked-images.zip'; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }
    } finally {
      setExporting(false);
    }
  };

  const onDrop = (e: DragEvent) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); };

  const showQuality = (() => {
    const outType = resolveOutputType(exportFormat, active?.mimeType ?? '');
    return outType === 'image/jpeg' || outType === 'image/webp';
  })();

  const anchorGridLabel: Record<Anchor, string> = {
    tl: '↖', tc: '↑', tr: '↗', ml: '←', mc: '•', mr: '→', bl: '↙', bc: '↓', br: '↘',
  };

  return (
    <div className="space-y-5">
      {/* Upload */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${dragOver ? 'border-brand bg-brand/5' : 'border-slate-300 bg-slate-50'}`}
      >
        <ImageIcon className="h-8 w-8 text-slate-400" />
        <p className="text-sm text-slate-500">{tb('dropHint', 'Drag & drop images here, or use the button below')}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
            <Upload className="h-4 w-4" /> {tb('addFiles', 'Add Images')}
          </button>
          <button type="button" onClick={() => folderInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            <FolderOpen className="h-4 w-4" /> {tb('addFolder', 'Add Folder')}
          </button>
        </div>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => addFiles(e.target.files)} />
        <input ref={folderInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => addFiles(e.target.files)} />
      </div>

      {images.length > 0 && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#ffffff_0%_50%)] bg-[length:20px_20px] p-4">
              {active && <canvas ref={previewRef} style={{ maxWidth: '100%', maxHeight: '60vh', width: 'auto' }} className="rounded-lg shadow-sm" />}
            </div>
            {images.length > 1 && (
              <div>
                <p className="mb-2 text-xs font-medium text-slate-500">{tb('gallery', 'Images (click to preview)')}</p>
                <div className="flex flex-wrap gap-2">
                  {images.map((it) => (
                    <div key={it.id} className="relative">
                      <button type="button" onClick={() => setActiveId(it.id)} className={`relative block h-14 w-14 overflow-hidden rounded-lg border-2 ${it.id === activeId ? 'border-brand ring-2 ring-brand/30' : 'border-slate-200 hover:border-brand/40'}`} title={it.name}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={it.url} alt="" className="h-full w-full object-cover" />
                      </button>
                      <button type="button" onClick={() => removeImage(it.id)} className="absolute -right-1.5 -top-1.5 rounded-full bg-white p-0.5 text-slate-400 shadow hover:text-red-500" title="Remove">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Type toggle */}
            <div className="flex gap-2">
              <button type="button" onClick={() => patch({ type: 'text' })} className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium ${wm.type === 'text' ? 'border-brand bg-brand/[0.06] text-brand' : 'border-slate-200 text-slate-600 hover:border-brand/30'}`}>
                <Type className="h-4 w-4" /> {tb('textWm', 'Text')}
              </button>
              <button type="button" onClick={() => (logo ? patch({ type: 'logo' }) : logoInputRef.current?.click())} className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium ${wm.type === 'logo' ? 'border-brand bg-brand/[0.06] text-brand' : 'border-slate-200 text-slate-600 hover:border-brand/30'}`}>
                <ImagePlus className="h-4 w-4" /> {tb('logoWm', 'Logo')}
              </button>
              <input ref={logoInputRef} type="file" accept="image/png,image/webp,image/jpeg" hidden onChange={(e) => loadLogo(e.target.files?.[0] ?? null)} />
            </div>

            {/* Text controls */}
            {wm.type === 'text' && (
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">{tb('text', 'Watermark text')}</label>
                  <input type="text" value={wm.text} onChange={(e) => patch({ text: e.target.value })} className="w-full rounded-lg border border-slate-200 p-2 text-sm" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">{tb('font', 'Font')}</label>
                  <select value={wm.fontFamily} onChange={(e) => patch({ fontFamily: e.target.value })} className="w-full rounded-lg border border-slate-200 p-2 text-sm">
                    {FONTS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">{tb('fontSize', 'Font size')}: {wm.fontSize}%</label>
                  <input type="range" min={2} max={20} step={0.5} value={wm.fontSize} onChange={(e) => patch({ fontSize: Number(e.target.value) })} className="w-full accent-brand" />
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-slate-600">
                    {tb('color', 'Color')}
                    <input type="color" value={wm.color} onChange={(e) => patch({ color: e.target.value })} className="h-7 w-10 cursor-pointer rounded border border-slate-200" />
                  </label>
                  <label className="flex items-center gap-1 text-xs text-slate-600"><input type="checkbox" checked={wm.bold} onChange={(e) => patch({ bold: e.target.checked })} /> {tb('bold', 'Bold')}</label>
                  <label className="flex items-center gap-1 text-xs text-slate-600"><input type="checkbox" checked={wm.italic} onChange={(e) => patch({ italic: e.target.checked })} /> {tb('italic', 'Italic')}</label>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1 text-xs text-slate-600"><input type="checkbox" checked={wm.shadow} onChange={(e) => patch({ shadow: e.target.checked })} /> {tb('shadow', 'Shadow')}</label>
                  <label className="flex items-center gap-1 text-xs text-slate-600"><input type="checkbox" checked={wm.stroke} onChange={(e) => patch({ stroke: e.target.checked })} /> {tb('stroke', 'Outline')}</label>
                  {wm.stroke && <input type="color" value={wm.strokeColor} onChange={(e) => patch({ strokeColor: e.target.value })} className="h-7 w-10 cursor-pointer rounded border border-slate-200" />}
                </div>
              </div>
            )}

            {/* Logo controls */}
            {wm.type === 'logo' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-slate-200 p-2">
                  <span className="text-xs text-slate-500">{logo ? tb('logoLoaded', 'Logo loaded') : tb('noLogo', 'No logo yet')}</span>
                  <button type="button" onClick={() => logoInputRef.current?.click()} className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-100">{tb('changeLogo', 'Choose logo')}</button>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">{tb('logoScale', 'Logo size')}: {wm.logoScale}%</label>
                  <input type="range" min={5} max={80} value={wm.logoScale} onChange={(e) => patch({ logoScale: Number(e.target.value) })} className="w-full accent-brand" />
                </div>
              </div>
            )}

            {/* Opacity */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">{tb('opacity', 'Opacity')}: {wm.opacity}%</label>
              <input type="range" min={5} max={100} value={wm.opacity} onChange={(e) => patch({ opacity: Number(e.target.value) })} className="w-full accent-brand" />
            </div>

            {/* Rotation */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">{tb('rotation', 'Rotation')}: {wm.rotation}°</label>
              <input type="range" min={-90} max={90} value={wm.rotation} onChange={(e) => patch({ rotation: Number(e.target.value) })} className="w-full accent-brand" />
            </div>

            {/* Tiled toggle */}
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={wm.tiled} onChange={(e) => patch({ tiled: e.target.checked })} /> {tb('tiled', 'Tile across image')}
            </label>

            {/* Position grid (hidden when tiled) */}
            {!wm.tiled && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">{tb('position', 'Position')}</label>
                <div className="grid w-28 grid-cols-3 gap-1">
                  {ANCHORS.map((a) => (
                    <button key={a} type="button" onClick={() => patch({ anchor: a })} className={`flex h-8 items-center justify-center rounded border text-sm ${wm.anchor === a ? 'border-brand bg-brand/[0.08] text-brand' : 'border-slate-200 text-slate-400 hover:border-brand/30'}`} title={a}>
                      {anchorGridLabel[a]}
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  <label className="mb-1 block text-xs font-medium text-slate-600">{tb('margin', 'Edge margin')}: {wm.margin}%</label>
                  <input type="range" min={0} max={15} step={0.5} value={wm.margin} onChange={(e) => patch({ margin: Number(e.target.value) })} className="w-full accent-brand" />
                </div>
              </div>
            )}
            {wm.tiled && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">{tb('tileGap', 'Tile spacing')}: {wm.tileGap}%</label>
                <input type="range" min={0} max={30} value={wm.tileGap} onChange={(e) => patch({ tileGap: Number(e.target.value) })} className="w-full accent-brand" />
              </div>
            )}

            {/* Export format + quality */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">{tb('exportFormat', 'Export format')}</label>
              <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value as ExportFormat)} className="w-full rounded-lg border border-slate-200 p-2 text-sm">
                <option value="original">{tb('originalFmt', 'Original format')}</option>
                <option value="image/jpeg">JPG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>
            {showQuality && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">{tb('quality', 'Quality')}: {quality}%</label>
                <input type="range" min={1} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-brand" />
              </div>
            )}

            {/* Actions */}
            <button type="button" onClick={doExport} disabled={exporting || !images.length} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60">
              <Download className="h-4 w-4" />
              {exporting ? tb('exporting', 'Exporting…') : images.length > 1 ? tb('exportAll', `Download all (${images.length}) as ZIP`) : tb('download', 'Download')}
            </button>
            <button type="button" onClick={clearAll} disabled={exporting} className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-600 disabled:opacity-40">
              <Trash2 className="h-4 w-4" /> {tb('clear', 'Clear')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
