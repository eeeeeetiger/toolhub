'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent, type PointerEvent as ReactPointerEvent } from 'react';
import {
  Upload,
  FolderOpen,
  X,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Download,
  Trash2,
  SlidersHorizontal,
  Layers,
  Image as ImageIcon,
  Maximize,
  Crop as CropIcon,
} from 'lucide-react';
import { useI18n } from '@/i18n';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FitMode = 'cover' | 'contain' | 'blur';
type ExportFormat = 'original' | 'image/jpeg' | 'image/png' | 'image/webp';
type BackgroundMode = 'white' | 'black' | 'transparent' | 'custom';

interface Transform {
  nx: number; // normalized pan X in [-1, 1]
  ny: number; // normalized pan Y in [-1, 1]
  z: number; // zoom multiplier over the base fit scale (>=1 for cover)
  rotation: number; // degrees, multiple of 90
  flipX: boolean;
  flipY: boolean;
}

interface ImageEntry {
  id: string;
  file: File;
  name: string;
  base: string;
  width: number;
  height: number;
  mimeType: string;
  hasAlpha: boolean;
  url: string;
  transform: Transform;
}

interface CropOverride {
  nx: number;
  ny: number;
  z: number;
}

interface SizePreset {
  id: string;
  label: string;
  w: number;
  h: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PRESETS: SizePreset[] = [
  { id: 'original', label: 'Original Size', w: 0, h: 0 },
  { id: 'ig-square', label: 'Instagram Square', w: 1080, h: 1080 },
  { id: 'ig-portrait', label: 'Instagram Portrait', w: 1080, h: 1350 },
  { id: 'ig-story', label: 'Instagram Story / Reels / TikTok', w: 1080, h: 1920 },
  { id: 'yt-thumb', label: 'YouTube Thumbnail', w: 1280, h: 720 },
  { id: 'pinterest', label: 'Pinterest Pin', w: 1000, h: 1500 },
  { id: 'linkedin', label: 'LinkedIn Post', w: 1200, h: 1200 },
  { id: 'og', label: 'Facebook / Open Graph', w: 1200, h: 630 },
  { id: 'twitter', label: 'X / Twitter Post', w: 1600, h: 900 },
  { id: 'avatar', label: 'Profile Picture', w: 800, h: 800 },
  { id: 'custom', label: 'Custom Size', w: 0, h: 0 },
];

const FIT_MODES: { id: FitMode; labelKey: string; descKey: string }[] = [
  { id: 'cover', labelKey: 'fitCover', descKey: 'fitCoverDesc' },
  { id: 'contain', labelKey: 'fitContain', descKey: 'fitContainDesc' },
  { id: 'blur', labelKey: 'fitBlur', descKey: 'fitBlurDesc' },
];

const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

function makeId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function defaultTransform(): Transform {
  return { nx: 0, ny: 0, z: 1, rotation: 0, flipX: false, flipY: false };
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

// ---------------------------------------------------------------------------
// Render engine
// ---------------------------------------------------------------------------

interface RenderOpts {
  iw: number;
  ih: number;
  W: number;
  H: number;
  fitMode: FitMode;
  transform: Transform;
  background: { mode: BackgroundMode; color: string };
  blur: { strength: number; brightness: number; darken: boolean };
  exportFormat: ExportFormat;
  sourceMime: string;
  quality: number;
}

// Returns the effective output MIME type (resolves "original").
function resolveOutputType(format: ExportFormat, sourceMime: string): string {
  if (format === 'original') return sourceMime || 'image/png';
  return format;
}

// Whether the chosen output supports transparency.
function supportsAlpha(outType: string): boolean {
  return outType === 'image/png' || outType === 'image/webp';
}

// Background color to paint before drawing (handles JPG flattening).
function resolveBgColor(
  bg: { mode: BackgroundMode; color: string },
  outType: string,
  hasAlpha: boolean
): string | null {
  // Transparent output: never paint a solid background (let canvas stay clear).
  if (supportsAlpha(outType)) {
    if (bg.mode === 'transparent') return null;
    if (bg.mode === 'white') return '#ffffff';
    if (bg.mode === 'black') return '#000000';
    if (bg.mode === 'custom') return bg.color || '#ffffff';
  }
  // Opaque output (JPG) — must paint something.
  if (bg.mode === 'transparent' || bg.mode === 'custom') {
    return bg.mode === 'custom' && bg.color ? bg.color : '#ffffff';
  }
  return bg.mode === 'white' ? '#ffffff' : '#000000';
}

// Compute absolute scale + offset (canvas px) from normalized transform.
function computePlacement(iw: number, ih: number, W: number, H: number, fitMode: FitMode, t: Transform) {
  const base = fitMode === 'cover' ? Math.max(W / iw, H / ih) : Math.min(W / iw, H / ih);
  const scale = base * t.z;
  const maxOffX = Math.max(0, (iw * scale - W) / 2);
  const maxOffY = Math.max(0, (ih * scale - H) / 2);
  const offX = clamp(t.nx, -1, 1) * maxOffX;
  const offY = clamp(t.ny, -1, 1) * maxOffY;
  return { scale, offX, offY, maxOffX, maxOffY, base };
}

function drawImageTransformed(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  W: number,
  H: number,
  iw: number,
  ih: number,
  fitMode: FitMode,
  t: Transform
) {
  const { scale, offX, offY } = computePlacement(iw, ih, W, H, fitMode, t);
  ctx.translate(W / 2 + offX, H / 2 + offY);
  if (t.rotation) ctx.rotate((t.rotation * Math.PI) / 180);
  ctx.scale(t.flipX ? -1 : 1, t.flipY ? -1 : 1);
  ctx.scale(scale, scale);
  ctx.drawImage(img, -iw / 2, -ih / 2, iw, ih);
}

function renderToCanvas(img: HTMLImageElement, opts: RenderOpts): HTMLCanvasElement {
  const { iw, ih, W, H, fitMode, transform, background, blur, exportFormat, sourceMime, quality } = opts;
  const outType = resolveOutputType(exportFormat, sourceMime);
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Base background.
  const bg = resolveBgColor(background, outType, img ? true : true);
  if (bg) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
  }

  if (fitMode === 'blur') {
    // Blurred, enlarged background fills the whole canvas.
    const bScale = Math.max(W / iw, H / ih) * 1.25;
    ctx.save();
    ctx.filter = `blur(${blur.strength}px) brightness(${blur.brightness}%)`;
    ctx.translate(W / 2, H / 2);
    ctx.scale(bScale, bScale);
    ctx.drawImage(img, -iw / 2, -ih / 2, iw, ih);
    ctx.restore();
    if (blur.darken) {
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(0, 0, W, H);
    }
    // Sharp foreground, contained.
    ctx.save();
    drawImageTransformed(ctx, img, W, H, iw, ih, 'contain', transform);
    ctx.restore();
  } else {
    ctx.save();
    drawImageTransformed(ctx, img, W, H, iw, ih, fitMode, transform);
    ctx.restore();
  }

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

export default function ImageResizeCropClient() {
  const { t } = useI18n();

  const [images, setImages] = useState<ImageEntry[]>([]);
  const [sampleId, setSampleId] = useState<string | null>(null);

  const [presetId, setPresetId] = useState<string>('ig-square');
  const [customW, setCustomW] = useState<number>(1080);
  const [customH, setCustomH] = useState<number>(1080);
  const [lockRatio, setLockRatio] = useState<boolean>(false);
  const [fitMode, setFitMode] = useState<FitMode>('cover');

  const [background, setBackground] = useState<{ mode: BackgroundMode; color: string }>({
    mode: 'white',
    color: '#ffffff',
  });

  const [blur, setBlur] = useState({ strength: 20, brightness: 100, darken: false });

  const [exportFormat, setExportFormat] = useState<ExportFormat>('original');
  const [quality, setQuality] = useState<number>(90);

  const [advancedOpen, setAdvancedOpen] = useState<boolean>(false);

  // P2-01 multi-size export
  const [multiSize, setMultiSize] = useState<{ enabled: boolean; selected: string[]; cropOverrides: Record<string, CropOverride | null> }>({
    enabled: false,
    selected: [],
    cropOverrides: {},
  });
  // When editing a specific size's crop in cover mode.
  const [activeCropSizeId, setActiveCropSizeId] = useState<string | null>(null);

  const [dragOver, setDragOver] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const imgCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // -------------------------------------------------------------------------
  // Derived target size
  // -------------------------------------------------------------------------
  const sample = useMemo(() => images.find((i) => i.id === sampleId) ?? null, [images, sampleId]);

  const targetSize = useMemo(() => {
    if (presetId === 'custom') return { w: Math.max(1, Math.round(customW)), h: Math.max(1, Math.round(customH)) };
    if (presetId === 'original' && sample) return { w: sample.width, h: sample.height };
    const p = PRESETS.find((x) => x.id === presetId);
    if (p) return { w: p.w, h: p.h };
    return { w: 1080, h: 1080 };
  }, [presetId, customW, customH, sample]);

  // Size currently shown in the preview canvas (per-size crop editing overrides target).
  const previewSize = useMemo(() => {
    if (activeCropSizeId) {
      const p = PRESETS.find((x) => x.id === activeCropSizeId);
      if (p && p.id !== 'custom' && p.id !== 'original') return { w: p.w, h: p.h };
      if (p && p.id === 'original' && sample) return { w: sample.width, h: sample.height };
    }
    return targetSize;
  }, [activeCropSizeId, targetSize, sample]);

  // The transform the preview edits: per-size override if active, else sample's own.
  const editingTransform = useMemo<Transform>(() => {
    if (!sample) return defaultTransform();
    if (activeCropSizeId && multiSize.cropOverrides[activeCropSizeId]) {
      const o = multiSize.cropOverrides[activeCropSizeId]!;
      return { ...sample.transform, ...o };
    }
    return sample.transform;
  }, [sample, activeCropSizeId, multiSize.cropOverrides]);

  const showBackground = fitMode === 'contain' || (exportFormat !== 'original' && !supportsAlpha(resolveOutputType(exportFormat, sample?.mimeType ?? ''))) || (sample?.hasAlpha ?? false);
  const showQuality = exportFormat === 'image/jpeg' || exportFormat === 'image/webp' || (exportFormat === 'original' && sample && (sample.mimeType === 'image/jpeg' || sample.mimeType === 'image/webp'));
  const showCustomColor = showBackground && background.mode === 'custom';
  const showBlurOptions = fitMode === 'blur';
  const showSampleStrip = images.length > 1;
  const showPerSizeCrop = multiSize.enabled && fitMode === 'cover';

  // -------------------------------------------------------------------------
  // Image loading
  // -------------------------------------------------------------------------
  const loadImageMeta = useCallback((file: File): Promise<ImageEntry> => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const base = file.name.replace(/\.[^.]+$/, '');
        const entry: ImageEntry = {
          id: makeId(),
          file,
          name: file.name,
          base,
          width: img.naturalWidth,
          height: img.naturalHeight,
          mimeType: file.type,
          hasAlpha: file.type === 'image/png' || file.type === 'image/webp',
          url,
          transform: defaultTransform(),
        };
        imgCacheRef.current.set(entry.id, img);
        resolve(entry);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Cannot read image'));
      };
      img.src = url;
    });
  }, []);

  const addFiles = useCallback(
    async (list: FileList | null) => {
      if (!list || !list.length) return;
      const imgs = Array.from(list).filter((f) => f.type === 'image/jpeg' || f.type === 'image/png' || f.type === 'image/webp');
      if (!imgs.length) return;
      const entries = await Promise.all(imgs.map(loadImageMeta));
      setImages((prev) => {
        const next = [...prev, ...entries];
        // Default sample = first image of the batch.
        setSampleId((sid) => sid ?? next[0]?.id ?? null);
        return next;
      });
    },
    [loadImageMeta]
  );

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
        imgCacheRef.current.delete(id);
      }
      const next = prev.filter((i) => i.id !== id);
      setSampleId((sid) => (sid === id ? next[0]?.id ?? null : sid));
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    for (const it of images) {
      URL.revokeObjectURL(it.url);
      imgCacheRef.current.delete(it.id);
    }
    setImages([]);
    setSampleId(null);
    setMultiSize((m) => ({ ...m, cropOverrides: {} }));
    setActiveCropSizeId(null);
  }, [images]);

  // Update the active transform (sample or per-size override).
  const patchTransform = useCallback(
    (patch: Partial<Transform>) => {
      if (!sample) return;
      if (activeCropSizeId) {
        setMultiSize((m) => {
          const existing = m.cropOverrides[activeCropSizeId];
          const base: CropOverride = existing ?? { nx: sample.transform.nx, ny: sample.transform.ny, z: sample.transform.z };
          return {
            ...m,
            cropOverrides: {
              ...m.cropOverrides,
              [activeCropSizeId]: { ...base, ...patch },
            },
          };
        });
      } else {
        setImages((prev) => prev.map((i) => (i.id === sample.id ? { ...i, transform: { ...i.transform, ...patch } } : i)));
      }
    },
    [sample, activeCropSizeId]
  );

  useEffect(() => {
    const el = folderInputRef.current;
    if (el) {
      el.setAttribute('webkitdirectory', '');
      el.setAttribute('directory', '');
    }
  }, []);

  // Revoke URLs on unmount.
  useEffect(() => {
    return () => {
      for (const [id, img] of imgCacheRef.current) {
        void id;
        void img;
      }
      // images state may be stale here; rely on individual revocations.
    };
  }, []);

  // -------------------------------------------------------------------------
  // Preview rendering
  // -------------------------------------------------------------------------
  const renderPreview = useCallback(() => {
    if (!sample) return;
    const img = imgCacheRef.current.get(sample.id);
    if (!img) return;
    const canvas = previewRef.current;
    if (!canvas) return;
    const out = renderToCanvas(img, {
      iw: sample.width,
      ih: sample.height,
      W: previewSize.w,
      H: previewSize.h,
      fitMode,
      transform: editingTransform,
      background,
      blur,
      exportFormat,
      sourceMime: sample.mimeType,
      quality,
    });
    const ctx = canvas.getContext('2d')!;
    canvas.width = out.width;
    canvas.height = out.height;
    ctx.clearRect(0, 0, out.width, out.height);
    ctx.drawImage(out, 0, 0);
  }, [sample, previewSize, fitMode, editingTransform, background, blur, exportFormat, quality]);

  useEffect(() => {
    renderPreview();
  }, [renderPreview]);

  // -------------------------------------------------------------------------
  // Drag to pan
  // -------------------------------------------------------------------------
  const dragging = useRef(false);
  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!sample) return;
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!dragging.current || !sample) return;
    const canvas = previewRef.current;
    if (!canvas) return;
    const displayScale = canvas.clientWidth / previewSize.w;
    const dOffX = (e.movementX / displayScale);
    const dOffY = (e.movementY / displayScale);
    const { maxOffX, maxOffY } = computePlacement(sample.width, sample.height, previewSize.w, previewSize.h, fitMode, editingTransform);
    const curOffX = clamp(editingTransform.nx, -1, 1) * maxOffX + dOffX;
    const curOffY = clamp(editingTransform.ny, -1, 1) * maxOffY + dOffY;
    const nx = maxOffX > 0 ? clamp(curOffX / maxOffX, -1, 1) : 0;
    const ny = maxOffY > 0 ? clamp(curOffY / maxOffY, -1, 1) : 0;
    patchTransform({ nx, ny });
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    dragging.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  // Zoom slider: z multiplier.
  const onZoom = (z: number) => {
    const min = fitMode === 'cover' ? 1 : 0.1;
    patchTransform({ z: clamp(z, min, 5) });
  };

  // -------------------------------------------------------------------------
  // Reset behaviours
  // -------------------------------------------------------------------------
  const transformChanged = sample ? sample.transform.nx !== 0 || sample.transform.ny !== 0 || sample.transform.z !== 1 || sample.transform.rotation !== 0 || sample.transform.flipX || sample.transform.flipY : false;
  const sizeChanged = presetId !== 'original' || customW !== sample?.width || customH !== sample?.height;

  const resetPosition = () => {
    if (activeCropSizeId) {
      patchTransform({ nx: 0, ny: 0, z: 1 });
    } else if (sample) {
      setImages((prev) => prev.map((i) => (i.id === sample.id ? { ...i, transform: { ...i.transform, nx: 0, ny: 0, z: 1, rotation: 0, flipX: false, flipY: false } } : i)));
    }
  };
  const resetSize = () => setPresetId('original');
  const resetAll = () => {
    setPresetId('original');
    setFitMode('cover');
    setBackground({ mode: 'white', color: '#ffffff' });
    setBlur({ strength: 20, brightness: 100, darken: false });
    setExportFormat('original');
    setQuality(90);
    setMultiSize({ enabled: false, selected: [], cropOverrides: {} });
    setActiveCropSizeId(null);
    if (sample) setImages((prev) => prev.map((i) => (i.id === sample.id ? { ...i, transform: defaultTransform() } : i)));
  };

  // -------------------------------------------------------------------------
  // Export
  // -------------------------------------------------------------------------
  const getImg = (entry: ImageEntry): HTMLImageElement | null => imgCacheRef.current.get(entry.id) ?? null;

  const buildExportList = useCallback((): { entry: ImageEntry; W: number; H: number; override: CropOverride | null }[] => {
    const sizes: { W: number; H: number; id: string }[] = [];
    if (multiSize.enabled && multiSize.selected.length) {
      for (const id of multiSize.selected) {
        const p = PRESETS.find((x) => x.id === id);
        if (!p) continue;
        if (p.id === 'custom') sizes.push({ W: Math.max(1, Math.round(customW)), H: Math.max(1, Math.round(customH)), id });
        else if (p.id === 'original') sizes.push({ W: 0, H: 0, id }); // filled per image
        else sizes.push({ W: p.w, H: p.h, id });
      }
    } else {
      sizes.push({ W: previewSize.w, H: previewSize.h, id: presetId });
    }

    const list: { entry: ImageEntry; W: number; H: number; override: CropOverride | null }[] = [];
    for (const entry of images) {
      for (const s of sizes) {
        const W = s.W === 0 && s.id === 'original' ? entry.width : s.W;
        const H = s.H === 0 && s.id === 'original' ? entry.height : s.H;
        const override = showPerSizeCrop && s.id !== 'custom' && s.id !== 'original' ? multiSize.cropOverrides[s.id] ?? null : null;
        list.push({ entry, W, H, override });
      }
    }
    return list;
  }, [images, multiSize, presetId, previewSize, customW, customH, showPerSizeCrop]);

  const doExport = async () => {
    if (!images.length) return;
    setExporting(true);
    try {
      const jobs = buildExportList();
      const blobs: { name: string; blob: Blob }[] = [];
      for (const job of jobs) {
        const img = getImg(job.entry);
        if (!img) continue;
        const transform: Transform = job.override
          ? { ...job.entry.transform, ...job.override }
          : job.entry.transform;
        const canvas = renderToCanvas(img, {
          iw: job.entry.width,
          ih: job.entry.height,
          W: job.W,
          H: job.H,
          fitMode,
          transform,
          background,
          blur,
          exportFormat,
          sourceMime: job.entry.mimeType,
          quality,
        });
        const outType = resolveOutputType(exportFormat, job.entry.mimeType);
        const blob = await canvasToBlob(canvas, outType, quality);
        const ext = EXT[outType] ?? 'png';
        blobs.push({ name: `${job.entry.base}-${job.W}x${job.H}.${ext}`, blob });
      }

      if (blobs.length === 1) {
        const { name, blob } = blobs[0];
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      } else {
        const { zipSync } = await import('fflate');
        const map: Record<string, Uint8Array> = {};
        const used = new Set<string>();
        for (const b of blobs) {
          let name = b.name;
          if (used.has(name)) {
            const dot = name.lastIndexOf('.');
            const base = name.slice(0, dot);
            const tail = name.slice(dot);
            let n = 1;
            while (used.has(`${base}_${n}${tail}`)) n++;
            name = `${base}_${n}${tail}`;
          }
          used.add(name);
          map[name] = new Uint8Array(await b.blob.arrayBuffer());
        }
        const zipped = zipSync(map, { level: 9 });
        const blob = new Blob([zipped as unknown as BlobPart], { type: 'application/zip' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'toolhub-images.zip';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }
    } finally {
      setExporting(false);
    }
  };

  // -------------------------------------------------------------------------
  // UI
  // -------------------------------------------------------------------------
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const previewStyle: React.CSSProperties = {
    maxWidth: '100%',
    maxHeight: '60vh',
    width: 'auto',
    aspectRatio: `${previewSize.w} / ${previewSize.h}`,
    touchAction: 'none',
  };

  const tb = (k: string, f: string) => t(`tools.image-resize-crop.ui.${k}`, f);

  return (
    <div className="space-y-5">
      {/* Upload zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragOver ? 'border-brand bg-brand/5' : 'border-slate-300 bg-slate-50'
        }`}
      >
        <ImageIcon className="h-8 w-8 text-slate-400" />
        <p className="text-sm text-slate-500">{tb('dropHint', 'Drag & drop images here, or use the buttons below')}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
          >
            <Upload className="h-4 w-4" /> {tb('addFiles', 'Add Images')}
          </button>
          <button
            type="button"
            onClick={() => folderInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <FolderOpen className="h-4 w-4" /> {tb('addFolder', 'Add Folder')}
          </button>
        </div>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => addFiles(e.target.files)} />
        <input ref={folderInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => addFiles(e.target.files)} />
      </div>

      {images.length > 0 && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Preview + sample strip */}
          <div>
            <div className="space-y-3 lg:sticky lg:top-20">
            <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4">
              {sample ? (
                <canvas ref={previewRef} style={previewStyle} className="rounded-lg shadow-sm" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} />
              ) : (
                <p className="py-10 text-sm text-slate-400">{tb('noSample', 'No image selected')}</p>
              )}
            </div>

            {/* Per-size crop editor hint */}
            {showPerSizeCrop && activeCropSizeId && (
              <div className="rounded-lg border border-brand/30 bg-brand/[0.04] p-3 text-sm text-slate-600">
                <CropIcon className="mr-1.5 inline h-4 w-4 text-brand" />
                {tb('editingSizeCrop', 'Editing crop for')}: <span className="font-medium text-slate-800">{PRESETS.find((p) => p.id === activeCropSizeId)?.label}</span>
                <button type="button" className="ml-2 text-xs text-brand underline" onClick={() => setActiveCropSizeId(null)}>
                  {tb('doneSizeCrop', 'Done')}
                </button>
              </div>
            )}

            {/* Zoom + reset position (inline, always useful) */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex min-w-[200px] flex-1 items-center gap-2">
                <Maximize className="h-4 w-4 text-slate-400" />
                <input
                  type="range"
                  min={fitMode === 'cover' ? 1 : 0.1}
                  max={5}
                  step={0.01}
                  value={editingTransform.z}
                  onChange={(e) => onZoom(Number(e.target.value))}
                  className="w-full accent-brand"
                />
                <span className="w-12 text-right text-xs text-slate-500">{Math.round(editingTransform.z * 100)}%</span>
              </div>
              {transformChanged && (
                <button type="button" onClick={resetPosition} className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:text-brand">
                  {tb('resetPosition', 'Reset Position')}
                </button>
              )}
            </div>

            {/* Sample strip */}
            {showSampleStrip && (
              <div>
                <p className="mb-2 text-xs font-medium text-slate-500">{tb('sampleStrip', 'Sample images (click to edit)')}</p>
                <div className="flex flex-wrap gap-2">
                  {images.map((it) => (
                    <div key={it.id} className="group relative h-14 w-14">
                      <button
                        type="button"
                        onClick={() => {
                          setSampleId(it.id);
                          setActiveCropSizeId(null);
                        }}
                        className={`h-14 w-14 overflow-hidden rounded-lg border-2 ${
                          it.id === sampleId ? 'border-brand ring-2 ring-brand/30' : 'border-slate-200 hover:border-brand/40'
                        }`}
                        title={it.name}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={it.url} alt="" className="h-full w-full object-cover" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(it.id)}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-slate-800/80 text-white opacity-0 shadow transition-opacity group-hover:opacity-100"
                        title={tb('removeSample', 'Remove image')}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Target size preset */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">{tb('targetSize', 'Target size')}</label>
              <select
                value={presetId}
                onChange={(e) => setPresetId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-sm"
              >
                {PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {tb(`preset.${p.id}`, p.label)}
                    {p.id !== 'original' && p.id !== 'custom' ? ` (${p.w}x${p.h})` : ''}
                  </option>
                ))}
              </select>
              {presetId === 'custom' && (
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={customW}
                    onChange={(e) => {
                      const v = Math.max(1, Number(e.target.value) || 1);
                      if (lockRatio && sample) {
                        const ratio = sample.height / sample.width;
                        setCustomH(Math.round(v * ratio));
                      }
                      setCustomW(v);
                    }}
                    className="w-full rounded-lg border border-slate-200 p-2 text-sm"
                  />
                  <button type="button" onClick={() => { setCustomW(customH); setCustomH(customW); }} className="rounded-lg border border-slate-200 px-2 py-2 text-xs text-slate-500 hover:bg-slate-100" title={tb('swap', 'Swap')}>
                    ⇄
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={customH}
                    onChange={(e) => {
                      const v = Math.max(1, Number(e.target.value) || 1);
                      if (lockRatio && sample) {
                        const ratio = sample.width / sample.height;
                        setCustomW(Math.round(v * ratio));
                      }
                      setCustomH(v);
                    }}
                    className="w-full rounded-lg border border-slate-200 p-2 text-sm"
                  />
                  <label className="flex items-center gap-1 text-xs text-slate-500">
                    <input type="checkbox" checked={lockRatio} onChange={(e) => setLockRatio(e.target.checked)} />
                    {tb('lockRatio', 'Lock')}
                  </label>
                </div>
              )}
              <p className="mt-1 text-xs text-slate-400">
                {tb('currentOutput', 'Output')}: {previewSize.w} × {previewSize.h}
              </p>
            </div>

            {/* Fit mode */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">{tb('fitMode', 'Fit mode')}</label>
              <div className="space-y-1.5">
                {FIT_MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setFitMode(m.id)}
                    className={`flex w-full flex-col rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                      fitMode === m.id ? 'border-brand bg-brand/[0.06] text-brand' : 'border-slate-200 text-slate-600 hover:border-brand/30'
                    }`}
                  >
                    <span className="font-medium">{tb(`fit.${m.labelKey}`, m.labelKey)}</span>
                    <span className="text-xs text-slate-400">{tb(`fit.${m.descKey}`, m.descKey)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Background (conditional) */}
            {showBackground && (
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">{tb('background', 'Background')}</label>
                <div className="flex flex-wrap gap-2">
                  {(['white', 'black', 'transparent'] as BackgroundMode[]).map((mode) => {
                    const disabled = mode === 'transparent' && !supportsAlpha(resolveOutputType(exportFormat, sample?.mimeType ?? ''));
                    return (
                      <button
                        key={mode}
                        type="button"
                        disabled={disabled}
                        onClick={() => setBackground((b) => ({ ...b, mode }))}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 ${
                          background.mode === mode ? 'border-brand bg-brand/[0.06] text-brand' : 'border-slate-200 text-slate-600 hover:border-brand/30'
                        }`}
                      >
                        {tb(`bg.${mode}`, mode)}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setBackground((b) => ({ ...b, mode: 'custom' }))}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                      background.mode === 'custom' ? 'border-brand bg-brand/[0.06] text-brand' : 'border-slate-200 text-slate-600 hover:border-brand/30'
                    }`}
                  >
                    {tb('bg.custom', 'Custom')}
                  </button>
                </div>
                {showCustomColor && (
                  <input
                    type="color"
                    value={background.color}
                    onChange={(e) => setBackground((b) => ({ ...b, color: e.target.value }))}
                    className="mt-2 h-9 w-full cursor-pointer rounded-lg border border-slate-200"
                  />
                )}
              </div>
            )}

            {/* Advanced options */}
            <div className="rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setAdvancedOpen((o) => !o)}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-slate-400" />
                  {tb('advanced', 'Advanced Options')}
                </span>
                <span className="text-slate-400">{advancedOpen ? '−' : '+'}</span>
              </button>
              {advancedOpen && (
                <div className="space-y-4 border-t border-slate-100 p-4">
                  {/* Export format */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">{tb('exportFormat', 'Export format')}</label>
                    <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value as ExportFormat)} className="w-full rounded-lg border border-slate-200 p-2 text-sm">
                      <option value="original">{tb('fmt.original', 'Original format')}</option>
                      <option value="image/jpeg">JPG</option>
                      <option value="image/png">PNG</option>
                      <option value="image/webp">WebP</option>
                    </select>
                  </div>

                  {/* Quality */}
                  {showQuality && (
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">{tb('quality', 'Quality')}: {quality}%</label>
                      <input type="range" min={1} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-brand" />
                    </div>
                  )}

                  {/* Blur options */}
                  {showBlurOptions && (
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">{tb('blur.strength', 'Blur strength')}: {blur.strength}</label>
                        <input type="range" min={1} max={40} value={blur.strength} onChange={(e) => setBlur((b) => ({ ...b, strength: Number(e.target.value) }))} className="w-full accent-brand" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">{tb('blur.brightness', 'Background brightness')}: {blur.brightness}%</label>
                        <input type="range" min={30} max={150} value={blur.brightness} onChange={(e) => setBlur((b) => ({ ...b, brightness: Number(e.target.value) }))} className="w-full accent-brand" />
                      </div>
                      <label className="flex items-center gap-2 text-xs text-slate-600">
                        <input type="checkbox" checked={blur.darken} onChange={(e) => setBlur((b) => ({ ...b, darken: e.target.checked }))} />
                        {tb('blur.darken', 'Darken background')}
                      </label>
                    </div>
                  )}

                  {/* Rotate & flip */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">{tb('rotateFlip', 'Rotate & flip')}</label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => patchTransform({ rotation: (editingTransform.rotation - 90 + 360) % 360 })} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-100">
                        <RotateCcw className="h-3.5 w-3.5" /> {tb('rotLeft', 'Left')}
                      </button>
                      <button type="button" onClick={() => patchTransform({ rotation: (editingTransform.rotation + 90) % 360 })} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-100">
                        <RotateCw className="h-3.5 w-3.5" /> {tb('rotRight', 'Right')}
                      </button>
                      <button type="button" onClick={() => patchTransform({ flipX: !editingTransform.flipX })} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-100">
                        <FlipHorizontal className="h-3.5 w-3.5" /> {tb('flipH', 'H')}
                      </button>
                      <button type="button" onClick={() => patchTransform({ flipY: !editingTransform.flipY })} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-100">
                        <FlipVertical className="h-3.5 w-3.5" /> {tb('flipV', 'V')}
                      </button>
                    </div>
                    {(editingTransform.rotation !== 0 || editingTransform.flipX || editingTransform.flipY) && (
                      <button type="button" onClick={() => patchTransform({ rotation: 0, flipX: false, flipY: false })} className="mt-2 text-xs text-brand underline">
                        {tb('resetRotateFlip', 'Reset rotation & flip')}
                      </button>
                    )}
                  </div>

                  {/* Reset all */}
                  <div className="border-t border-slate-100 pt-3">
                    <button type="button" onClick={resetAll} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100">
                      <Trash2 className="h-3.5 w-3.5" /> {tb('resetAll', 'Reset All')}
                    </button>
                    {sizeChanged && (
                      <button type="button" onClick={resetSize} className="ml-2 inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100">
                        {tb('resetSize', 'Reset Size')}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* P2-01 Multi-size export */}
            <div className="rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setMultiSize((m) => ({ ...m, enabled: !m.enabled }))}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <span className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-slate-400" />
                  {tb('multiSize', 'Multi-size Export')}
                </span>
                <span className="text-slate-400">{multiSize.enabled ? '−' : '+'}</span>
              </button>
              {multiSize.enabled && (
                <div className="space-y-3 border-t border-slate-100 p-4">
                  <p className="text-xs text-slate-500">{tb('multiSizeHint', 'Select one or more sizes to export at once.')}</p>
                  <div className="flex flex-wrap gap-2">
                    {PRESETS.filter((p) => p.id !== 'custom').map((p) => {
                      const checked = multiSize.selected.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() =>
                            setMultiSize((m) => ({
                              ...m,
                              selected: checked ? m.selected.filter((s) => s !== p.id) : [...m.selected, p.id],
                            }))
                          }
                          className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                            checked ? 'border-brand bg-brand/[0.06] text-brand' : 'border-slate-200 text-slate-600 hover:border-brand/30'
                          }`}
                        >
                          {tb(`preset.${p.id}`, p.label)}
                          {p.id !== 'original' ? ` (${p.w}x${p.h})` : ''}
                        </button>
                      );
                    })}
                  </div>

                  {/* Per-size crop editor (cover only) */}
                  {showPerSizeCrop && multiSize.selected.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-medium text-slate-500">{tb('perSizeCrop', 'Crop area per size (cover mode)')}</p>
                      <div className="flex flex-wrap gap-2">
                        {multiSize.selected
                          .filter((id) => id !== 'original')
                          .map((id) => {
                            const p = PRESETS.find((x) => x.id === id)!;
                            const active = activeCropSizeId === id;
                            return (
                              <button
                                key={id}
                                type="button"
                                onClick={() => setActiveCropSizeId(active ? null : id)}
                                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                                  active ? 'border-brand bg-brand/[0.06] text-brand' : 'border-slate-200 text-slate-600 hover:border-brand/30'
                                }`}
                              >
                                <CropIcon className="h-3.5 w-3.5" />
                                {tb(`preset.${id}`, p.label)}
                                {multiSize.cropOverrides[id] ? ' •' : ''}
                              </button>
                            );
                          })}
                      </div>
                      <p className="mt-1 text-xs text-slate-400">{tb('perSizeCropHint', 'Select a size, then drag the preview to set its crop. Each size is independent.')}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Export button */}
            <button
              type="button"
              onClick={doExport}
              disabled={exporting || !images.length}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
            >
              <Download className="h-4 w-4" />
              {exporting ? tb('exporting', 'Exporting…') : multiSize.enabled && multiSize.selected.length > 1 ? tb('exportMulti', 'Export All Sizes') : tb('download', 'Download')}
            </button>
            <button
              type="button"
              onClick={clearAll}
              disabled={exporting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-600 disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" /> {tb('clear', 'Clear')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
