'use client';

import { useCallback, useEffect, useRef, useState, type DragEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { Upload, Trash2, Download, Image as ImageIcon, Undo2, Square, Brush } from 'lucide-react';
import { useI18n } from '@/i18n';

type EffectType = 'blur' | 'pixelate' | 'block';
type ToolMode = 'rect' | 'brush';
type ExportFormat = 'image/png' | 'image/jpeg' | 'image/webp';

interface Loaded {
  base: string;
  width: number;
  height: number;
  url: string;
  el: HTMLImageElement;
}

// A redaction op in IMAGE pixel coordinates.
interface RectOp { kind: 'rect'; effect: EffectType; strength: number; blockColor: string; x: number; y: number; w: number; h: number }
interface BrushOp { kind: 'brush'; effect: EffectType; strength: number; blockColor: string; radius: number; points: { x: number; y: number }[] }
type Op = RectOp | BrushOp;

function makeBlurredCanvas(src: CanvasImageSource, w: number, h: number, blurPx: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d')!;
  ctx.filter = `blur(${blurPx}px)`;
  ctx.drawImage(src, 0, 0, w, h);
  ctx.filter = 'none';
  return c;
}

function makePixelatedCanvas(src: CanvasImageSource, w: number, h: number, blockSize: number): HTMLCanvasElement {
  const small = document.createElement('canvas');
  const sw = Math.max(1, Math.round(w / blockSize));
  const sh = Math.max(1, Math.round(h / blockSize));
  small.width = sw; small.height = sh;
  const sctx = small.getContext('2d')!;
  sctx.imageSmoothingEnabled = true;
  sctx.drawImage(src, 0, 0, sw, sh);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(small, 0, 0, sw, sh, 0, 0, w, h);
  return c;
}

export default function RedactClient() {
  const { t } = useI18n();
  const tb = (k: string, f: string) => t(`tools.image-redact.ui.${k}`, f);

  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [mode, setMode] = useState<ToolMode>('rect');
  const [effect, setEffect] = useState<EffectType>('pixelate');
  const [strength, setStrength] = useState(50); // 0..100
  const [brushSize, setBrushSize] = useState(40); // px in image space (approx)
  const [blockColor, setBlockColor] = useState('#000000');
  const [format, setFormat] = useState<ExportFormat>('image/png');
  const [quality, setQuality] = useState(92);

  const [ops, setOps] = useState<Op[]>([]);
  // In-progress op while dragging.
  const draftRef = useRef<Op | null>(null);
  const drawing = useRef(false);
  const startPt = useRef<{ x: number; y: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadFile = useCallback((file: File | null) => {
    if (!file || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return;
    const url = URL.createObjectURL(file);
    const el = new Image();
    el.onload = () => {
      setLoaded((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { base: file.name.replace(/\.[^.]+$/, ''), width: el.naturalWidth, height: el.naturalHeight, url, el };
      });
      setOps([]);
    };
    el.onerror = () => URL.revokeObjectURL(url);
    el.src = url;
  }, []);

  // Convert an op's effect into a strength-scaled parameter.
  const effectParam = useCallback((op: Op, dim: number) => {
    // Larger dim → larger blur/blocks for visible effect.
    if (op.effect === 'blur') return Math.max(2, (op.strength / 100) * (dim * 0.06));
    if (op.effect === 'pixelate') return Math.max(2, (op.strength / 100) * (dim * 0.12));
    return 0;
  }, []);

  // Apply a single op onto ctx (which already has the base image drawn).
  const applyOp = useCallback((ctx: CanvasRenderingContext2D, op: Op, img: HTMLImageElement, W: number, H: number) => {
    const minDim = Math.min(W, H);
    if (op.effect === 'block') {
      ctx.save();
      ctx.fillStyle = op.blockColor;
      if (op.kind === 'rect') {
        ctx.fillRect(op.x, op.y, op.w, op.h);
      } else {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = op.blockColor;
        ctx.lineWidth = op.radius * 2;
        ctx.beginPath();
        op.points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
        ctx.stroke();
      }
      ctx.restore();
      return;
    }

    // For blur/pixelate: build a full-image processed layer, then clip to the op region and draw.
    const param = effectParam(op, minDim);
    const processed = op.effect === 'blur' ? makeBlurredCanvas(img, W, H, param) : makePixelatedCanvas(img, W, H, param);

    ctx.save();
    ctx.beginPath();
    if (op.kind === 'rect') {
      ctx.rect(op.x, op.y, op.w, op.h);
    } else {
      // Build a fat stroke path as clip using round caps.
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      // Use path of circles along points for reliable clip region.
      for (const p of op.points) {
        ctx.moveTo(p.x + op.radius, p.y);
        ctx.arc(p.x, p.y, op.radius, 0, Math.PI * 2);
      }
      // Also connect consecutive points with rectangles (approx via wide line) — simpler: rely on dense points.
    }
    ctx.clip();
    ctx.drawImage(processed, 0, 0);
    ctx.restore();
  }, [effectParam]);

  // Full render: base + all ops + draft.
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !loaded) return;
    const { width: W, height: H } = loaded;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(loaded.el, 0, 0, W, H);
    const allOps = draftRef.current ? [...ops, draftRef.current] : ops;
    for (const op of allOps) applyOp(ctx, op, loaded.el, W, H);
  }, [loaded, ops, applyOp]);

  useEffect(() => { render(); }, [render]);

  // Pointer → image coordinates.
  const toImageCoords = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!loaded) return;
    drawing.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const pt = toImageCoords(e);
    startPt.current = pt;
    if (mode === 'rect') {
      draftRef.current = { kind: 'rect', effect, strength, blockColor, x: pt.x, y: pt.y, w: 0, h: 0 };
    } else {
      const r = (brushSize / 100) * Math.min(loaded.width, loaded.height) * 0.5 + 4;
      draftRef.current = { kind: 'brush', effect, strength, blockColor, radius: r, points: [pt] };
    }
    render();
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !draftRef.current || !startPt.current) return;
    const pt = toImageCoords(e);
    const d = draftRef.current;
    if (d.kind === 'rect') {
      d.x = Math.min(startPt.current.x, pt.x);
      d.y = Math.min(startPt.current.y, pt.y);
      d.w = Math.abs(pt.x - startPt.current.x);
      d.h = Math.abs(pt.y - startPt.current.y);
    } else {
      // Add densely to make the clip continuous.
      const last = d.points[d.points.length - 1];
      const dist = Math.hypot(pt.x - last.x, pt.y - last.y);
      const step = d.radius * 0.5;
      if (dist > step) {
        const n = Math.floor(dist / step);
        for (let i = 1; i <= n; i++) {
          d.points.push({ x: last.x + ((pt.x - last.x) * i) / n, y: last.y + ((pt.y - last.y) * i) / n });
        }
      }
      d.points.push(pt);
    }
    render();
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    drawing.current = false;
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* ignore */ }
    const d = draftRef.current;
    draftRef.current = null;
    if (d) {
      if (d.kind === 'rect' && (d.w < 3 || d.h < 3)) { render(); return; }
      setOps((prev) => [...prev, d]);
    }
  };

  const undo = () => setOps((prev) => prev.slice(0, -1));
  const clearOps = () => setOps([]);

  const doExport = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !loaded) return;
    setExporting(true);
    try {
      const q = format === 'image/png' ? undefined : quality / 100;
      const blob: Blob = await new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('fail'))), format, q));
      const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${loaded.base}-redacted.${ext}`; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } finally {
      setExporting(false);
    }
  };

  const clearAll = () => {
    if (loaded) URL.revokeObjectURL(loaded.url);
    setLoaded(null);
    setOps([]);
  };

  const onDrop = (e: DragEvent) => { e.preventDefault(); setDragOver(false); loadFile(e.dataTransfer.files?.[0] ?? null); };

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
          <p className="text-[11px] text-slate-400">{tb('privacy', 'Your image is processed locally and never uploaded.')}</p>
        </div>
      )}

      {loaded && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Canvas */}
          <div className="space-y-2">
            <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-3">
              <canvas
                ref={canvasRef}
                className="max-h-[62vh] w-auto max-w-full cursor-crosshair rounded-lg shadow-sm"
                style={{ touchAction: 'none' }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
              />
            </div>
            <p className="text-center text-xs text-slate-500">{mode === 'rect' ? tb('hintRect', 'Drag on the image to draw a redaction box.') : tb('hintBrush', 'Paint over the areas you want to hide.')}</p>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Tool mode */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">{tb('tool', 'Tool')}</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setMode('rect')} className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium ${mode === 'rect' ? 'border-brand bg-brand/[0.06] text-brand' : 'border-slate-200 text-slate-600 hover:border-brand/30'}`}>
                  <Square className="h-4 w-4" /> {tb('rectTool', 'Rectangle')}
                </button>
                <button type="button" onClick={() => setMode('brush')} className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium ${mode === 'brush' ? 'border-brand bg-brand/[0.06] text-brand' : 'border-slate-200 text-slate-600 hover:border-brand/30'}`}>
                  <Brush className="h-4 w-4" /> {tb('brushTool', 'Brush')}
                </button>
              </div>
            </div>

            {mode === 'brush' && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">{tb('brushSize', 'Brush size')}: {brushSize}</label>
                <input type="range" min={5} max={100} value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-full accent-brand" />
              </div>
            )}

            {/* Effect */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">{tb('effect', 'Effect')}</label>
              <div className="flex gap-2">
                {(['pixelate', 'blur', 'block'] as EffectType[]).map((ef) => (
                  <button key={ef} type="button" onClick={() => setEffect(ef)} className={`flex-1 rounded-lg border px-2 py-2 text-xs font-medium ${effect === ef ? 'border-brand bg-brand/[0.06] text-brand' : 'border-slate-200 text-slate-600 hover:border-brand/30'}`}>
                    {tb(`effect.${ef}`, ef === 'pixelate' ? 'Pixelate' : ef === 'blur' ? 'Blur' : 'Block')}
                  </button>
                ))}
              </div>
            </div>

            {effect !== 'block' ? (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">{tb('strength', 'Strength')}: {strength}</label>
                <input type="range" min={5} max={100} value={strength} onChange={(e) => setStrength(Number(e.target.value))} className="w-full accent-brand" />
                <p className="mt-1 text-[11px] text-slate-400">{tb('strengthNote', 'Applies to new redactions you draw.')}</p>
              </div>
            ) : (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">{tb('blockColor', 'Block color')}</label>
                <div className="flex items-center gap-2">
                  {['#000000', '#ffffff', '#ef4444'].map((c) => (
                    <button key={c} type="button" onClick={() => setBlockColor(c)} className={`h-7 w-7 rounded-full border-2 ${blockColor === c ? 'border-brand' : 'border-slate-200'}`} style={{ backgroundColor: c }} />
                  ))}
                  <input type="color" value={blockColor} onChange={(e) => setBlockColor(e.target.value)} className="h-7 w-10 cursor-pointer rounded border border-slate-200" />
                </div>
              </div>
            )}

            {/* Undo / clear ops */}
            <div className="flex gap-2">
              <button type="button" onClick={undo} disabled={!ops.length} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-40">
                <Undo2 className="h-3.5 w-3.5" /> {tb('undo', 'Undo')}
              </button>
              <button type="button" onClick={clearOps} disabled={!ops.length} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-40">
                {tb('clearOps', 'Clear marks')} ({ops.length})
              </button>
            </div>

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

            <button type="button" onClick={doExport} disabled={exporting} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60">
              <Download className="h-4 w-4" /> {exporting ? tb('exporting', 'Exporting…') : tb('download', 'Download')}
            </button>
            <button type="button" onClick={clearAll} className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-600">
              <Trash2 className="h-4 w-4" /> {tb('clear', 'Choose another')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
