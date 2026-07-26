'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { Upload, Trash2, Download, Image as ImageIcon, X, FolderOpen } from 'lucide-react';
import { useI18n } from '@/i18n';

// ---------------------------------------------------------------------------
// Types & layout definitions
// ---------------------------------------------------------------------------

type LayoutId =
  | 'ba-h' | 'ba-v'
  | 'g2h' | 'g2v'
  | 'g3h' | 'g3v'
  | 'g4' | 'g9';

interface CellRect { x: number; y: number; w: number; h: number } // normalized 0..1

interface ImageEntry {
  id: string;
  file: File;
  name: string;
  width: number;
  height: number;
  url: string;
}

interface CellFill {
  imageId: string | null;
  nx: number; // pan -1..1
  ny: number;
  z: number; // zoom >=1
}

const ASPECTS = [
  { id: '1-1', label: 'Square 1:1', w: 1, h: 1 },
  { id: '4-5', label: 'Portrait 4:5', w: 4, h: 5 },
  { id: '9-16', label: 'Story 9:16', w: 9, h: 16 },
  { id: '3-4', label: 'Portrait 3:4', w: 3, h: 4 },
  { id: '16-9', label: 'Landscape 16:9', w: 16, h: 9 },
  { id: '3-2', label: 'Landscape 3:2', w: 3, h: 2 },
];

// Number of cells per layout.
const LAYOUT_CELLS: Record<LayoutId, number> = {
  'ba-h': 2, 'ba-v': 2, g2h: 2, g2v: 2, g3h: 3, g3v: 3, g4: 4, g9: 9,
};

const LAYOUTS: { id: LayoutId; label: string; split: boolean }[] = [
  { id: 'ba-h', label: 'Before / After ↔', split: true },
  { id: 'ba-v', label: 'Before / After ↕', split: true },
  { id: 'g2h', label: '2 · rows', split: false },
  { id: 'g2v', label: '2 · cols', split: false },
  { id: 'g3h', label: '3 · rows', split: false },
  { id: 'g3v', label: '3 · cols', split: false },
  { id: 'g4', label: '4 · grid', split: false },
  { id: 'g9', label: '9 · grid', split: false },
];

// Build normalized cell rects for a layout. For before/after, `divider` (0..1) sets split.
function buildCells(layout: LayoutId, divider: number): CellRect[] {
  switch (layout) {
    case 'ba-h':
      return [
        { x: 0, y: 0, w: divider, h: 1 },
        { x: divider, y: 0, w: 1 - divider, h: 1 },
      ];
    case 'ba-v':
      return [
        { x: 0, y: 0, w: 1, h: divider },
        { x: 0, y: divider, w: 1, h: 1 - divider },
      ];
    case 'g2h':
      return [
        { x: 0, y: 0, w: 1, h: 0.5 },
        { x: 0, y: 0.5, w: 1, h: 0.5 },
      ];
    case 'g2v':
      return [
        { x: 0, y: 0, w: 0.5, h: 1 },
        { x: 0.5, y: 0, w: 0.5, h: 1 },
      ];
    case 'g3h':
      return [0, 1, 2].map((i) => ({ x: 0, y: i / 3, w: 1, h: 1 / 3 }));
    case 'g3v':
      return [0, 1, 2].map((i) => ({ x: i / 3, y: 0, w: 1 / 3, h: 1 }));
    case 'g4':
      return [
        { x: 0, y: 0, w: 0.5, h: 0.5 },
        { x: 0.5, y: 0, w: 0.5, h: 0.5 },
        { x: 0, y: 0.5, w: 0.5, h: 0.5 },
        { x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
      ];
    case 'g9':
      return Array.from({ length: 9 }, (_, i) => ({ x: (i % 3) / 3, y: Math.floor(i / 3) / 3, w: 1 / 3, h: 1 / 3 }));
    default:
      return [{ x: 0, y: 0, w: 1, h: 1 }];
  }
}

function makeId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function clamp(v: number, lo: number, hi: number): number { return Math.min(hi, Math.max(lo, v)); }

// Draw a rounded rect path.
function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

// Draw one image into a cell with cover fit + pan/zoom.
function drawCell(ctx: CanvasRenderingContext2D, img: HTMLImageElement, cx: number, cy: number, cw: number, ch: number, fill: CellFill, radius: number) {
  ctx.save();
  roundRectPath(ctx, cx, cy, cw, ch, radius);
  ctx.clip();
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const base = Math.max(cw / iw, ch / ih);
  const scale = base * fill.z;
  const maxOffX = Math.max(0, (iw * scale - cw) / 2);
  const maxOffY = Math.max(0, (ih * scale - ch) / 2);
  const offX = clamp(fill.nx, -1, 1) * maxOffX;
  const offY = clamp(fill.ny, -1, 1) * maxOffY;
  ctx.translate(cx + cw / 2 + offX, cy + ch / 2 + offY);
  ctx.scale(scale, scale);
  ctx.drawImage(img, -iw / 2, -ih / 2, iw, ih);
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CollageClient() {
  const { t } = useI18n();
  const tb = (k: string, f: string) => t(`tools.image-collage.ui.${k}`, f);

  const [images, setImages] = useState<ImageEntry[]>([]);
  const [layout, setLayout] = useState<LayoutId>('ba-h');
  const [aspectId, setAspectId] = useState('1-1');
  const [spacing, setSpacing] = useState(2); // percent of canvas min-dim
  const [radius, setRadius] = useState(2); // percent
  const [bgColor, setBgColor] = useState('#ffffff');
  const [divider, setDivider] = useState(0.5);
  const [fills, setFills] = useState<CellFill[]>([]);
  const [activeCell, setActiveCell] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [quality, setQuality] = useState(92);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
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

  const cellCount = LAYOUT_CELLS[layout];
  const aspect = useMemo(() => ASPECTS.find((a) => a.id === aspectId) ?? ASPECTS[0], [aspectId]);
  const isSplit = LAYOUTS.find((l) => l.id === layout)?.split ?? false;

  // Keep fills array length synced with cell count; assign images in order initially.
  useEffect(() => {
    setFills((prev) => {
      const next: CellFill[] = [];
      for (let i = 0; i < cellCount; i++) {
        next.push(prev[i] ?? { imageId: null, nx: 0, ny: 0, z: 1 });
      }
      return next;
    });
    setActiveCell((c) => Math.min(c, cellCount - 1));
  }, [cellCount]);

  // Auto-fill empty cells with newly added images (in order).
  const autoAssign = useCallback((entries: ImageEntry[]) => {
    setFills((prev) => {
      const next = [...prev];
      let qi = 0;
      for (let i = 0; i < next.length && qi < entries.length; i++) {
        if (!next[i]?.imageId) {
          next[i] = { imageId: entries[qi].id, nx: 0, ny: 0, z: 1 };
          qi++;
        }
      }
      return next;
    });
  }, []);

  const loadImageMeta = useCallback((file: File): Promise<ImageEntry> => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const entry: ImageEntry = { id: makeId(), file, name: file.name, width: img.naturalWidth, height: img.naturalHeight, url };
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
    setImages((prev) => [...prev, ...entries]);
    autoAssign(entries);
  }, [loadImageMeta, autoAssign]);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) { URL.revokeObjectURL(target.url); imgCacheRef.current.delete(id); }
      return prev.filter((i) => i.id !== id);
    });
    setFills((prev) => prev.map((f) => (f.imageId === id ? { ...f, imageId: null } : f)));
  }, []);

  const clearAll = useCallback(() => {
    for (const it of images) { URL.revokeObjectURL(it.url); imgCacheRef.current.delete(it.id); }
    setImages([]);
    setFills((prev) => prev.map(() => ({ imageId: null, nx: 0, ny: 0, z: 1 })));
  }, [images]);

  const assignToActive = useCallback((imageId: string) => {
    setFills((prev) => prev.map((f, i) => (i === activeCell ? { ...f, imageId, nx: 0, ny: 0, z: 1 } : f)));
  }, [activeCell]);

  const patchActiveFill = useCallback((p: Partial<CellFill>) => {
    setFills((prev) => prev.map((f, i) => (i === activeCell ? { ...f, ...p } : f)));
  }, [activeCell]);

  // Render size: fixed longer edge for quality.
  const outSize = useMemo(() => {
    const LONG = 2000;
    if (aspect.w >= aspect.h) return { W: LONG, H: Math.round((LONG * aspect.h) / aspect.w) };
    return { H: LONG, W: Math.round((LONG * aspect.w) / aspect.h) };
  }, [aspect]);

  const renderCanvas = useCallback((): HTMLCanvasElement => {
    const { W, H } = outSize;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, W, H);
    const min = Math.min(W, H);
    const gap = (spacing / 100) * min;
    const rad = (radius / 100) * min;
    const cells = buildCells(layout, isSplit ? divider : 0.5);
    cells.forEach((c, i) => {
      // Apply spacing by insetting each cell by half-gap; outer edges also inset for a frame look.
      const cx = c.x * W + gap / 2;
      const cy = c.y * H + gap / 2;
      const cw = c.w * W - gap;
      const ch = c.h * H - gap;
      if (cw <= 0 || ch <= 0) return;
      const fill = fills[i];
      const img = fill?.imageId ? imgCacheRef.current.get(fill.imageId) : null;
      if (img && fill) {
        drawCell(ctx, img, cx, cy, cw, ch, fill, rad);
      } else {
        // Empty cell placeholder.
        ctx.save();
        roundRectPath(ctx, cx, cy, cw, ch, rad);
        ctx.fillStyle = '#e2e8f0';
        ctx.fill();
        ctx.restore();
      }
    });
    return canvas;
  }, [outSize, bgColor, spacing, radius, layout, isSplit, divider, fills]);

  const renderPreview = useCallback(() => {
    const canvas = previewRef.current;
    if (!canvas) return;
    const out = renderCanvas();
    canvas.width = out.width; canvas.height = out.height;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, out.width, out.height);
    ctx.drawImage(out, 0, 0);
  }, [renderCanvas]);

  useEffect(() => { renderPreview(); }, [renderPreview]);

  // Drag to pan the active cell's image (map pointer delta on preview to normalized pan).
  const dragging = useRef(false);
  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!fills[activeCell]?.imageId) return;
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!dragging.current) return;
    const canvas = previewRef.current;
    const fill = fills[activeCell];
    if (!canvas || !fill?.imageId) return;
    const img = imgCacheRef.current.get(fill.imageId);
    if (!img) return;
    const { W, H } = outSize;
    const min = Math.min(W, H);
    const gap = (spacing / 100) * min;
    const cells = buildCells(layout, isSplit ? divider : 0.5);
    const c = cells[activeCell];
    const cw = c.w * W - gap;
    const ch = c.h * H - gap;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const base = Math.max(cw / iw, ch / ih);
    const scale = base * fill.z;
    const maxOffX = Math.max(0, (iw * scale - cw) / 2);
    const maxOffY = Math.max(0, (ih * scale - ch) / 2);
    const displayScale = canvas.clientWidth / W;
    const dOffX = e.movementX / displayScale;
    const dOffY = e.movementY / displayScale;
    const curOffX = clamp(fill.nx, -1, 1) * maxOffX + dOffX;
    const curOffY = clamp(fill.ny, -1, 1) * maxOffY + dOffY;
    patchActiveFill({
      nx: maxOffX > 0 ? clamp(curOffX / maxOffX, -1, 1) : 0,
      ny: maxOffY > 0 ? clamp(curOffY / maxOffY, -1, 1) : 0,
    });
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    dragging.current = false;
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* ignore */ }
  };

  const doExport = async () => {
    setExporting(true);
    try {
      const canvas = renderCanvas();
      const type = 'image/jpeg';
      const blob: Blob = await new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('fail'))), type, quality / 100));
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `collage-${aspect.id}.jpg`; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } finally {
      setExporting(false);
    }
  };

  const onDrop = (e: DragEvent) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); };
  const activeFill = fills[activeCell];

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
        <p className="text-sm text-slate-500">{tb('dropHint', 'Drag & drop photos here, or use the button below')}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
            <Upload className="h-4 w-4" /> {tb('addFiles', 'Add Photos')}
          </button>
          <button type="button" onClick={() => folderInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            <FolderOpen className="h-4 w-4" /> {tb('addFolder', 'Add Folder')}
          </button>
        </div>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => addFiles(e.target.files)} />
        <input ref={folderInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => addFiles(e.target.files)} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-4">
            <canvas
              ref={previewRef}
              style={{ maxWidth: '100%', maxHeight: '60vh', width: 'auto', aspectRatio: `${aspect.w} / ${aspect.h}`, touchAction: 'none' }}
              className="rounded-lg shadow-sm"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            />
          </div>

          {/* Cell selector */}
          <div>
            <p className="mb-2 text-xs font-medium text-slate-500">{tb('selectCell', 'Select a cell, then click a photo below to fill it')}</p>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: cellCount }, (_, i) => (
                <button key={i} type="button" onClick={() => setActiveCell(i)} className={`h-9 w-9 rounded-lg border text-sm font-medium ${i === activeCell ? 'border-brand bg-brand/[0.08] text-brand' : 'border-slate-200 text-slate-500 hover:border-brand/30'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Active cell zoom */}
          {activeFill?.imageId && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{tb('zoom', 'Zoom')}</span>
              <input type="range" min={1} max={4} step={0.01} value={activeFill.z} onChange={(e) => patchActiveFill({ z: Number(e.target.value) })} className="w-full accent-brand" />
              <button type="button" onClick={() => patchActiveFill({ nx: 0, ny: 0, z: 1 })} className="rounded px-2 py-1 text-xs text-slate-500 hover:text-brand">{tb('reset', 'Reset')}</button>
            </div>
          )}

          {/* Photo tray */}
          {images.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-slate-500">{tb('photos', 'Your photos')}</p>
              <div className="flex flex-wrap gap-2">
                {images.map((it) => (
                  <div key={it.id} className="relative">
                    <button type="button" onClick={() => assignToActive(it.id)} className="relative block h-14 w-14 overflow-hidden rounded-lg border-2 border-slate-200 hover:border-brand" title={tb('assign', 'Put in selected cell')}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={it.url} alt="" className="h-full w-full object-cover" />
                    </button>
                    <button type="button" onClick={() => removeImage(it.id)} className="absolute -right-1.5 -top-1.5 rounded-full bg-white p-0.5 text-slate-400 shadow hover:text-red-500">
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
          {/* Layout */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{tb('layout', 'Layout')}</label>
            <div className="grid grid-cols-2 gap-2">
              {LAYOUTS.map((l) => (
                <button key={l.id} type="button" onClick={() => setLayout(l.id)} className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${layout === l.id ? 'border-brand bg-brand/[0.06] text-brand' : 'border-slate-200 text-slate-600 hover:border-brand/30'}`}>
                  {tb(`layoutName.${l.id}`, l.label)}
                </button>
              ))}
            </div>
          </div>

          {/* Divider (split only) */}
          {isSplit && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">{tb('divider', 'Split position')}: {Math.round(divider * 100)}%</label>
              <input type="range" min={0.15} max={0.85} step={0.01} value={divider} onChange={(e) => setDivider(Number(e.target.value))} className="w-full accent-brand" />
            </div>
          )}

          {/* Aspect */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{tb('aspect', 'Aspect ratio')}</label>
            <select value={aspectId} onChange={(e) => setAspectId(e.target.value)} className="w-full rounded-lg border border-slate-200 p-2 text-sm">
              {ASPECTS.map((a) => <option key={a.id} value={a.id}>{tb(`aspectName.${a.id}`, a.label)}</option>)}
            </select>
          </div>

          {/* Spacing */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">{tb('spacing', 'Spacing')}: {spacing}%</label>
            <input type="range" min={0} max={10} step={0.5} value={spacing} onChange={(e) => setSpacing(Number(e.target.value))} className="w-full accent-brand" />
          </div>

          {/* Radius */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">{tb('radius', 'Corner radius')}: {radius}%</label>
            <input type="range" min={0} max={12} step={0.5} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full accent-brand" />
          </div>

          {/* Background */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">{tb('bgColor', 'Background color')}</label>
            <div className="flex items-center gap-2">
              {['#ffffff', '#000000', '#f1f5f9', '#111827'].map((c) => (
                <button key={c} type="button" onClick={() => setBgColor(c)} className={`h-7 w-7 rounded-full border-2 ${bgColor === c ? 'border-brand' : 'border-slate-200'}`} style={{ backgroundColor: c }} />
              ))}
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-7 w-10 cursor-pointer rounded border border-slate-200" />
            </div>
          </div>

          {/* Quality */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">{tb('quality', 'Quality')}: {quality}%</label>
            <input type="range" min={1} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-brand" />
          </div>

          {/* Actions */}
          <button type="button" onClick={doExport} disabled={exporting} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60">
            <Download className="h-4 w-4" /> {exporting ? tb('exporting', 'Exporting…') : tb('download', 'Download Collage')}
          </button>
          <button type="button" onClick={clearAll} className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-600">
            <Trash2 className="h-4 w-4" /> {tb('clear', 'Clear photos')}
          </button>
        </div>
      </div>
    </div>
  );
}
