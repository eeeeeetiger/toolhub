'use client';

import { useCallback, useRef, useState } from 'react';
import { useI18n } from '@/i18n';
import { Upload, FolderOpen, X, Download, Trash2, Archive, Loader2 } from 'lucide-react';

type Fmt = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';
type FormatKey = 'jpg' | 'png' | 'webp' | 'avif';
const FORMATS: { key: FormatKey; mime: Fmt; label: string }[] = [
  { key: 'jpg', mime: 'image/jpeg', label: 'JPG' },
  { key: 'png', mime: 'image/png', label: 'PNG' },
  { key: 'webp', mime: 'image/webp', label: 'WebP' },
  { key: 'avif', mime: 'image/avif', label: 'AVIF' },
];

interface ImageEntry {
  id: string;
  file: File;
  name: string;
  base: string;
  width: number;
  height: number;
  mimeType: string;
  url: string;
  relPath?: string;
}

const makeId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : String(Math.random()).slice(2);

function outName(entry: ImageEntry, ext: string): string {
  if (entry.relPath) {
    const dot = entry.relPath.lastIndexOf('.');
    return entry.relPath.slice(0, dot) + '.' + ext;
  }
  return `${entry.base}.${ext}`;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: Fmt, quality?: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (b) => resolve(b),
      type,
      type === 'image/png' ? undefined : quality,
    );
  });
}

// 解析 SVG 的渲染尺寸（优先 viewBox / 宽高属性，缺失时回退默认）
async function svgSize(file: File): Promise<{ w: number; h: number }> {
  try {
    const text = await file.text();
    const vb = text.match(/viewBox=["']([^"']+)["']/i);
    if (vb) {
      const p = vb[1].split(/[\s,]+/).map(Number);
      if (p.length === 4 && p[2] > 0 && p[3] > 0) return { w: p[2], h: p[3] };
    }
    const wm = text.match(/width=["']([\d.]+)/i);
    const hm = text.match(/height=["']([\d.]+)/i);
    const w = wm ? parseFloat(wm[1]) : 0;
    const h = hm ? parseFloat(hm[1]) : 0;
    if (w > 0 && h > 0) return { w, h };
  } catch {
    /* ignore */
  }
  return { w: 800, h: 600 };
}

function isAcceptedImage(f: File): boolean {
  const ext = (f.name.split('.').pop() || '').toLowerCase();
  return f.type.startsWith('image/') || ext === 'heic' || ext === 'heif';
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export default function ImageConverterClient({ lockedTarget }: { lockedTarget?: FormatKey }) {
  const { t } = useI18n();
  const lockedMime = lockedTarget ? FORMATS.find((f) => f.key === lockedTarget)?.mime : undefined;
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [target, setTarget] = useState<Fmt>(lockedMime ?? 'image/png');
  const [quality, setQuality] = useState(92);
  const [converting, setConverting] = useState(false);
  const [adding, setAdding] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const imgCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());

  const loadImageMeta = useCallback((file: File): Promise<ImageEntry> => {
    return new Promise((resolve, reject) => {
      const ext = (file.name.split('.').pop() || '').toLowerCase();
      const isHeic = ext === 'heic' || ext === 'heif' || file.type === 'image/heic' || file.type === 'image/heif';
      const isSvg = ext === 'svg' || file.type === 'image/svg+xml';

      const finalize = (opts: { url: string; width: number; height: number; mimeType: string; img: HTMLImageElement }) => {
        const entry: ImageEntry = {
          id: makeId(),
          file,
          name: file.name,
          base: file.name.replace(/\.[^.]+$/, ''),
          width: opts.width,
          height: opts.height,
          mimeType: opts.mimeType,
          url: opts.url,
          relPath: file.webkitRelativePath || undefined,
        };
        imgCacheRef.current.set(entry.id, opts.img);
        resolve(entry);
      };

      // HEIC / HEIF 浏览器无法原生渲染，先用 heic2any 解码为 JPEG
      if (isHeic) {
        const origUrl = URL.createObjectURL(file);
        import('heic2any')
          .then(({ default: heic2any }) => heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 }))
          .then((res) => {
            const blob = Array.isArray(res) ? res[0] : res;
            const decUrl = URL.createObjectURL(blob as Blob);
            URL.revokeObjectURL(origUrl);
            const img = new Image();
            img.onload = () =>
              finalize({ url: decUrl, width: img.naturalWidth, height: img.naturalHeight, mimeType: 'image/jpeg', img });
            img.onerror = () => {
              URL.revokeObjectURL(decUrl);
              reject(new Error('bad image'));
            };
            img.src = decUrl;
          })
          .catch(() => {
            URL.revokeObjectURL(origUrl);
            reject(new Error('bad heic'));
          });
        return;
      }

      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = async () => {
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if ((!w || !h) && isSvg) {
          const size = await svgSize(file);
          w = size.w;
          h = size.h;
        }
        finalize({
          url,
          width: w || img.width || 1,
          height: h || img.height || 1,
          mimeType: file.type || (isSvg ? 'image/svg+xml' : 'application/octet-stream'),
          img,
        });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('bad image'));
      };
      img.src = url;
    });
  }, []);

  const addFiles = useCallback(
    async (list: FileList | null) => {
      if (!list || !list.length) return;
      const imgs = Array.from(list).filter(isAcceptedImage);
      if (!imgs.length) return;
      setAdding(true);
      try {
        const entries = await Promise.all(imgs.map(loadImageMeta));
        setImages((prev) => [...prev, ...entries]);
      } finally {
        setAdding(false);
      }
    },
    [loadImageMeta],
  );

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const targetEntry = prev.find((i) => i.id === id);
      if (targetEntry) {
        URL.revokeObjectURL(targetEntry.url);
        imgCacheRef.current.delete(id);
      }
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    for (const it of images) {
      URL.revokeObjectURL(it.url);
      imgCacheRef.current.delete(it.id);
    }
    setImages([]);
    setProgress(null);
    setNote(null);
  }, [images]);

  const convertOne = useCallback(
    async (entry: ImageEntry): Promise<{ name: string; blob: Blob; note?: string }> => {
      const img = imgCacheRef.current.get(entry.id);
      if (!img) throw new Error('image missing');
      const w = entry.width || img.naturalWidth || img.width || 1;
      const h = entry.height || img.naturalHeight || img.height || 1;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      if (target === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0, w, h);
      const fmtKey = FORMATS.find((f) => f.mime === target)!.key;
      const blob = await canvasToBlob(canvas, target, quality / 100);
      if (blob) return { name: outName(entry, fmtKey), blob };
      // 浏览器不支持 AVIF 编码 → 回退 PNG
      if (target === 'image/avif') {
        const pngBlob = await canvasToBlob(canvas, 'image/png', undefined);
        if (pngBlob) return { name: outName(entry, 'png'), blob: pngBlob, note: 'avif-unsupported' };
      }
      throw new Error('toBlob failed');
    },
    [target, quality],
  );

  const downloadOne = useCallback(
    async (entry: ImageEntry) => {
      const r = await convertOne(entry);
      triggerDownload(URL.createObjectURL(r.blob), r.name);
    },
    [convertOne],
  );

  const doExport = useCallback(async () => {
    if (!images.length || converting) return;
    setConverting(true);
    setProgress({ done: 0, total: images.length });
    setNote(null);
    try {
      const notes: string[] = [];
      const results = await Promise.all(
        images.map(async (entry, i) => {
          const r = await convertOne(entry);
          if (r.note) notes.push(r.note);
          setProgress({ done: i + 1, total: images.length });
          return r;
        }),
      );

      if (results.length === 1) {
        const { name, blob } = results[0];
        triggerDownload(URL.createObjectURL(blob), name);
      } else {
        const { zipSync } = await import('fflate');
        const used = new Set<string>();
        const map: Record<string, Uint8Array> = {};
        for (const r of results) {
          let name = r.name;
          if (used.has(name)) {
            const dot = name.lastIndexOf('.');
            let n = 1;
            while (used.has(`${name.slice(0, dot)}_${n}${name.slice(dot)}`)) n++;
            name = `${name.slice(0, dot)}_${n}${name.slice(dot)}`;
          }
          used.add(name);
          map[name] = new Uint8Array(await r.blob.arrayBuffer());
        }
        const zipped = zipSync(map, { level: 9 });
        const blob = new Blob([zipped as unknown as BlobPart], { type: 'application/zip' });
        triggerDownload(URL.createObjectURL(blob), 'converted-images.zip');
      }

      if (notes.includes('avif-unsupported')) {
        setNote(
          t(
            'tools.image-converter.avifFallback',
            'Your browser does not support AVIF encoding; those files were saved as PNG instead.',
          ),
        );
      }
    } catch {
      setNote(t('tools.image-converter.fail', 'Some files could not be converted.'));
    } finally {
      setConverting(false);
      setTimeout(() => setProgress(null), 600);
    }
  }, [images, converting, convertOne, t]);

  const isLossy = target === 'image/jpeg' || target === 'image/webp' || target === 'image/avif';

  return (
    <div className="space-y-5">
      {/* Upload */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragOver ? 'border-brand bg-brand/5' : 'border-slate-300 bg-slate-50'
        }`}
      >
        <Upload className="h-8 w-8 text-slate-400" />
        <p className="text-sm text-slate-500">
          {t('tools.image-converter.dropHint', 'Drag & drop images, or pick files / a folder below')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={adding}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload className="h-4 w-4" />
            {t('tools.image-converter.addFiles', 'Add Images')}
          </button>
          <button
            type="button"
            onClick={() => folderInputRef.current?.click()}
            disabled={adding}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FolderOpen className="h-4 w-4" />
            {t('tools.image-converter.addFolder', 'Add Folder')}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.heic,.heif,.svg"
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = '';
          }}
        />
        <input
          ref={folderInputRef}
          type="file"
          accept="image/*,.heic,.heif,.svg"
          multiple
          hidden
          {...({ webkitdirectory: '' } as Record<string, string>)}
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {adding && (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin text-brand" />
          {t('tools.image-converter.decoding', 'Decoding images, please wait…')}
        </div>
      )}

      {images.length > 0 && (
        <>
          {/* Settings + actions */}
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
            {lockedMime ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">
                  {t('tools.image-converter.convertTo', 'Convert to')}
                </span>
                <span className="rounded-lg border border-brand bg-brand/[0.06] px-3 py-1.5 text-sm font-medium text-brand">
                  {FORMATS.find((f) => f.mime === lockedMime)?.label}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">
                  {t('tools.image-converter.convertTo', 'Convert to')}
                </span>
                {FORMATS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setTarget(f.mime)}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                      target === f.mime
                        ? 'border-brand bg-brand/[0.06] text-brand'
                        : 'border-slate-200 text-slate-600 hover:border-brand/30'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}

            {isLossy && (
              <label className="flex items-center gap-2 text-sm text-slate-600">
                {t('tools.image-converter.quality', 'Quality')}
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="accent-brand"
                />
                <span className="w-9 tabular-nums text-slate-500">{quality}%</span>
              </label>
            )}

            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:border-red-300 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                {t('tools.image-converter.clear', 'Clear')}
              </button>
              <button
                type="button"
                onClick={doExport}
                disabled={converting}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
              >
                {converting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : images.length === 1 ? (
                  <Download className="h-4 w-4" />
                ) : (
                  <Archive className="h-4 w-4" />
                )}
                {images.length === 1
                  ? t('tools.image-converter.downloadOne', 'Download')
                  : `${t('tools.image-converter.downloadZip', 'Download ZIP')} (${images.length})`}
              </button>
            </div>
          </div>

          {note && <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">{note}</div>}

          {progress && (
            <div className="text-sm text-slate-500">
              {t('tools.image-converter.converting', 'Converting')} {progress.done}/{progress.total}…
            </div>
          )}

          {/* Gallery */}
          <div>
            <p className="mb-2 text-xs font-medium text-slate-500">
              {t('tools.image-converter.gallery', 'Images')} ({images.length})
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {images.map((entry) => (
                <div
                  key={entry.id}
                  className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white"
                >
                  <div className="aspect-square w-full bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={entry.url}
                      alt={entry.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-1 px-2 py-1.5">
                    <span className="truncate text-xs text-slate-500" title={entry.name}>
                      {entry.name}
                    </span>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => downloadOne(entry)}
                        title={t('tools.image-converter.downloadOne', 'Download')}
                        className="rounded p-1 text-slate-400 hover:bg-brand/10 hover:text-brand"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(entry.id)}
                        title={t('tools.image-converter.remove', 'Remove')}
                        className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
