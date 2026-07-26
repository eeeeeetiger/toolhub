'use client';

import { useEffect, useRef, useState, type DragEvent, type ReactNode } from 'react';
import { Upload, FolderOpen, Zap, Trash2, Download, FileImage, X, CheckCircle2, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';
import { useI18n } from '@/i18n';
import type { WorkerFormat, PngMode, WorkerRequest, WorkerResult } from '@/workers/image-worker';

type Status = 'pending' | 'processing' | 'done' | 'error';

interface Item {
  id: string;
  file: File;
  name: string;
  dir: string;
  base: string;
  originalSize: number;
  thumbUrl: string;
  status: Status;
  // Result (after exact compression)
  resultUrl?: string;
  resultSize?: number;
  outExt?: string;
  bytes?: Uint8Array;
  // Estimate (from worker estimate job)
  estSize?: number;
  error?: string;
}

function makeId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function parseFile(file: File): Item {
  const rel = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
  const slash = rel.lastIndexOf('/');
  const dir = slash >= 0 ? rel.slice(0, slash + 1) : '';
  const fname = slash >= 0 ? rel.slice(slash + 1) : rel;
  const base = fname.replace(/\.[^.]+$/, '');
  return {
    id: makeId(),
    file,
    name: file.name,
    dir,
    base,
    originalSize: file.size,
    thumbUrl: URL.createObjectURL(file),
    status: 'pending',
  };
}

export default function ImageCompressorClient() {
  const { t } = useI18n();
  const [items, setItems] = useState<Item[]>([]);
  const [format, setFormat] = useState<WorkerFormat>('image/webp'); // default WebP
  const [quality, setQuality] = useState(80);
  const [pngMode, setPngMode] = useState<PngMode>('quant'); // quant by default
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const reqSeq = useRef(0);
  const jobMap = useRef(new Map<string, { itemId: string; resolve: (r: WorkerResult) => void; reject: (e: Error) => void }>());
  const estimateTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const itemsRef = useRef<Item[]>([]);
  itemsRef.current = items;

  // Spawn the compression worker once. Next.js/webpack bundles the worker as a
  // CLASSIC worker (it uses importScripts internally to lazy-load codec chunks),
  // so we must NOT pass { type: 'module' } — doing so breaks importScripts and
  // the worker fails silently.
  useEffect(() => {
    const worker = new Worker(new URL('../../workers/image-worker.ts', import.meta.url));
    workerRef.current = worker;
    worker.onmessage = (e: MessageEvent<WorkerResult>) => {
      const res = e.data;
      const entry = jobMap.current.get(res.id);
      if (entry) {
        jobMap.current.delete(res.id);
        if (res.ok) entry.resolve(res);
        else entry.reject(new Error(res.error || 'worker error'));
      }
    };
    worker.onerror = (e) => {
      // Surface worker load/runtime errors instead of swallowing them.
      console.error('[image-compressor] worker error:', e.message, e.filename, e.lineno);
    };
    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  // Revoke object URLs on unmount.
  useEffect(() => {
    return () => {
      for (const it of itemsRef.current) {
        if (it.thumbUrl) URL.revokeObjectURL(it.thumbUrl);
        if (it.resultUrl) URL.revokeObjectURL(it.resultUrl);
      }
    };
  }, []);

  // Make the folder input behave like a directory picker.
  useEffect(() => {
    const el = folderInputRef.current;
    if (el) {
      el.setAttribute('webkitdirectory', '');
      el.setAttribute('directory', '');
    }
  }, []);

  function callWorker(req: Omit<WorkerRequest, 'id'>): Promise<WorkerResult> {
    return new Promise((resolve, reject) => {
      const worker = workerRef.current;
      if (!worker) return reject(new Error('worker unavailable'));
      const id = `r${++reqSeq.current}`;
      jobMap.current.set(id, { itemId: '', resolve, reject });
      const buffer = req.buffer;
      worker.postMessage({ ...req, id } as WorkerRequest, [buffer]);
    });
  }

  async function runJob(item: Item, job: 'compress' | 'estimate'): Promise<WorkerResult> {
    const buf = await item.file.arrayBuffer();
    const res = await callWorker({
      buffer: buf,
      name: item.name,
      type: item.file.type,
      format,
      quality,
      pngMode,
      job,
    });
    return res;
  }

  // When format / quality / pngMode changes, refresh estimates for all items
  // (debounced). Exact results are recomputed on compress.
  useEffect(() => {
    if (!items.length) return;
    for (const it of itemsRef.current) {
      const prev = estimateTimers.current.get(it.id);
      if (prev) clearTimeout(prev);
      const timer = setTimeout(async () => {
        try {
          const res = await runJob(it, 'estimate');
          if (res.ok) {
            updateItem(it.id, { estSize: res.size, error: undefined });
          }
        } catch {
          /* ignore estimate errors */
        }
      }, 150);
      estimateTimers.current.set(it.id, timer);
    }
    return () => {
      for (const tm of estimateTimers.current.values()) clearTimeout(tm);
    };
  }, [format, quality, pngMode, items.length]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const imgs = Array.from(list).filter((f) => f.type.startsWith('image/'));
    if (!imgs.length) return;
    const parsed = imgs.map(parseFile);
    setItems((prev) => [...prev, ...parsed]);
    // The debounced effect (keyed on items.length) refreshes estimates for all
    // items whenever new files are added, so no extra kickoff is needed here.
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((it) => it.id === id);
      if (target) {
        if (target.thumbUrl) URL.revokeObjectURL(target.thumbUrl);
        if (target.resultUrl) URL.revokeObjectURL(target.resultUrl);
      }
      return prev.filter((it) => it.id !== id);
    });
  };

  const clearAll = () => {
    for (const it of itemsRef.current) {
      if (it.thumbUrl) URL.revokeObjectURL(it.thumbUrl);
      if (it.resultUrl) URL.revokeObjectURL(it.resultUrl);
    }
    setItems([]);
  };

  const updateItem = (id: string, patch: Partial<Item>) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const compressAll = async () => {
    if (processing || !items.length) return;
    setProcessing(true);
    try {
      for (const it of itemsRef.current) {
        updateItem(it.id, { status: 'processing', error: undefined });
        try {
          const res = await runJob(it, 'compress');
          if (!res.ok) throw new Error(res.error || 'failed');
          const bytes = res.bytes ? new Uint8Array(res.bytes) : undefined;
          const url = bytes ? URL.createObjectURL(new Blob([bytes as BlobPart], { type: `image/${res.outExt}` })) : undefined;
          updateItem(it.id, {
            status: 'done',
            resultUrl: url,
            resultSize: res.size,
            outExt: res.outExt,
            bytes,
            estSize: undefined,
          });
        } catch (e) {
          updateItem(it.id, { status: 'error', error: e instanceof Error ? e.message : String(e) });
        }
        await new Promise((r) => setTimeout(r, 0));
      }
    } finally {
      setProcessing(false);
    }
  };

  const downloadZip = async () => {
    const done = itemsRef.current.filter((it) => it.status === 'done' && it.bytes);
    if (!done.length) return;
    const { zipSync } = await import('fflate');
    const map: Record<string, Uint8Array> = {};
    const used = new Set<string>();
    for (const it of done) {
      const ext = it.outExt || 'bin';
      let name = `${it.dir}${it.base}_compressed.${ext}`;
      if (used.has(name)) {
        const dot = name.lastIndexOf('.');
        const base = name.slice(0, dot);
        const tail = name.slice(dot);
        let n = 1;
        while (used.has(`${base}_${n}${tail}`)) n++;
        name = `${base}_${n}${tail}`;
      }
      used.add(name);
      map[name] = it.bytes!;
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
  };

  const pngActive = format === 'original';
  // Only surface the PNG-mode selector when there is at least one PNG source
  // image among the uploaded files (PNG mode only matters for "original"
  // output where the source is a PNG).
  const hasPng = items.some(
    (it) => /\.png$/i.test(it.name) || it.file.type === 'image/png'
  );
  const showPngMode = pngActive && hasPng;
  const total = items.length;
  const processed = items.filter((it) => it.status === 'done' || it.status === 'error').length;
  const percent = total ? Math.round((processed / total) * 100) : 0;
  const doneItems = items.filter((it) => it.status === 'done');
  const totalOriginal = doneItems.reduce((s, it) => s + it.originalSize, 0);
  const totalCompressed = doneItems.reduce((s, it) => s + (it.resultSize || 0), 0);
  const totalSaved = totalOriginal ? Math.round((1 - totalCompressed / totalOriginal) * 100) : 0;
  const canZip = doneItems.length > 0;

  // Aggregate estimate for not-yet-compressed items.
  const pendingItems = items.filter((it) => it.status !== 'done');
  const estOriginal = pendingItems.reduce((s, it) => s + it.originalSize, 0) + totalOriginal;
  const estCompressed =
    totalCompressed + pendingItems.reduce((s, it) => s + (it.estSize || it.originalSize), 0);
  const estSaved = estOriginal ? Math.round((1 - estCompressed / estOriginal) * 100) : 0;

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

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
        <FileImage className="h-8 w-8 text-slate-400" />
        <p className="text-sm text-slate-500">{t('tools.image-compressor.ui.dropHint', 'Drag & drop images here, or use the buttons below')}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
          >
            <Upload className="h-4 w-4" /> {t('tools.image-compressor.ui.addFiles', 'Add Images')}
          </button>
          <button
            type="button"
            onClick={() => folderInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <FolderOpen className="h-4 w-4" /> {t('tools.image-compressor.ui.addFolder', 'Add Folder')}
          </button>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />
        <input ref={folderInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />
      </div>

      {/* Options (below upload) */}
      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-white p-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">{t('tools.image-compressor.ui.format', 'Output format')}</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as WorkerFormat)}
            className="rounded-lg border border-slate-200 p-2 text-sm"
          >
            <option value="original">{t('tools.image-compressor.ui.originalLabel', 'Original format')}</option>
            <option value="image/jpeg">{t('tools.image-compressor.ui.jpgLabel', 'JPG')}</option>
            <option value="image/webp">{t('tools.image-compressor.ui.webpLabel', 'WebP')}</option>
          </select>
        </div>

        {showPngMode && (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{t('tools.image-compressor.ui.pngMode', 'PNG mode')}</label>
            <select
              value={pngMode}
              onChange={(e) => setPngMode(e.target.value as PngMode)}
              className="rounded-lg border border-slate-200 p-2 text-sm"
            >
              <option value="quant">{t('tools.image-compressor.ui.pngQuant', 'High compression (lossy)')}</option>
              <option value="lossless">{t('tools.image-compressor.ui.pngLossless', 'Lossless (oxipng)')}</option>
            </select>
          </div>
        )}

        <div className="min-w-[180px] flex-1">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {t('tools.image-compressor.ui.quality', 'Quality')}: {quality}%
          </label>
          <input
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-brand"
          />
          <p className="mt-1 text-xs text-slate-400">
            {showPngMode && pngMode === 'lossless'
              ? t('tools.image-compressor.ui.qualityLosslessNote', 'Lossless mode ignores quality — pixel-perfect')
              : t('tools.image-compressor.ui.qualityNote', 'Lower quality = smaller file')}
          </p>
        </div>
      </div>

      {items.length > 0 && (
        <>
          {/* Action bar + progress */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={compressAll}
              disabled={processing}
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              {processing ? t('tools.image-compressor.ui.compressing', 'Compressing…') : t('tools.image-compressor.ui.compressAll', 'Compress All')}
            </button>
            <button
              type="button"
              onClick={downloadZip}
              disabled={!canZip}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40"
            >
              <Download className="h-4 w-4" /> {t('tools.image-compressor.ui.downloadZip', 'Download All (ZIP)')}
            </button>
            <button
              type="button"
              onClick={clearAll}
              disabled={processing}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:text-red-600 disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" /> {t('tools.image-compressor.ui.clear', 'Clear')}
            </button>
            <span className="ml-auto text-sm text-slate-500">
              {t('tools.image-compressor.ui.total', 'Total')}: {total} {t('tools.image-compressor.ui.images', 'images')}
            </span>
          </div>

          {/* Overall progress */}
          <div>
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>{t('tools.image-compressor.ui.processed', 'Processed')}: {processed}/{total}</span>
              <span>{percent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${percent}%` }} />
            </div>
          </div>

          {/* Summary (estimate-aware) */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-3 text-center">
              <div className="text-lg font-semibold text-slate-900">{formatFileSize(estOriginal)}</div>
              <div className="text-xs text-slate-500">{t('tools.image-compressor.ui.original', 'Original')}</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 text-center">
              <div className="text-lg font-semibold text-brand">
                {formatFileSize(estCompressed)}
                {pendingItems.length > 0 && <span className="ml-1 text-xs font-normal text-slate-400">~</span>}
              </div>
              <div className="text-xs text-slate-500">{t('tools.image-compressor.ui.estCompressed', 'Estimated')}</div>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3 text-center">
              <div className="text-lg font-semibold text-emerald-600">
                -{estSaved}%
                {pendingItems.length > 0 && <span className="ml-1 text-xs font-normal text-emerald-400">~</span>}
              </div>
              <div className="text-xs text-slate-500">{t('tools.image-compressor.ui.saved', 'Saved')}</div>
            </div>
          </div>

          {/* Item list */}
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
            {items.map((it) => {
              const displaySize = it.resultSize ?? it.estSize;
              const saved = displaySize ? Math.round((1 - displaySize / it.originalSize) * 100) : 0;
              const grew = saved < 0;
              const isEstimate = it.estSize != null && it.resultSize == null;
              const sizeLine = displaySize != null ? (
                <span className="text-xs text-slate-500">
                  {formatFileSize(it.originalSize)} →{' '}
                  <span className="text-brand">{formatFileSize(displaySize)}</span>{' '}
                  <span className={grew ? 'text-red-500' : 'text-emerald-600'}>
                    {grew ? `(+${Math.abs(saved)}%)` : `(-${saved}%)`}
                    {isEstimate && <span className="text-slate-400"> ~</span>}
                  </span>
                </span>
              ) : it.status !== 'error' ? (
                <span className="text-xs text-slate-400">
                  {formatFileSize(it.originalSize)} {t('tools.image-compressor.ui.estimating', 'estimating…')}
                </span>
              ) : (
                <span className="text-xs text-slate-400">{formatFileSize(it.originalSize)}</span>
              );
              return (
                <li key={it.id} className="flex items-center gap-3 bg-white p-3">
                  <img src={it.thumbUrl} alt="" className="h-10 w-10 flex-shrink-0 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-slate-800">{it.name}</div>
                    <div className="text-xs text-slate-500">{sizeLine}</div>
                    {it.status === 'error' && <div className="text-xs text-red-600">{it.error}</div>}
                  </div>
                  <StatusBadge status={it.status} t={t} />
                  {it.status === 'done' && it.resultUrl && (
                    <a
                      href={it.resultUrl}
                      download={`${it.base}_compressed.${it.outExt}`}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand"
                      title={t('common.download', 'Download')}
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => removeItem(it.id)}
                    disabled={processing}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 disabled:opacity-40"
                    title={t('tools.image-compressor.ui.remove', 'Remove')}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <p className="flex items-center gap-1.5 text-center text-xs text-slate-400">
        <Sparkles className="h-3.5 w-3.5" />
        {t('tools.image-compressor.ui.workerNote', 'Compression runs in a background worker — the UI never freezes.')}
      </p>

      {items.length === 0 && (
        <p className="text-center text-sm text-slate-400">{t('tools.image-compressor.ui.empty', 'No images yet. Add files or a folder to begin.')}</p>
      )}
    </div>
  );
}

function StatusBadge({ status, t }: { status: Status; t: (k: string, f?: string) => string }) {
  const map: Record<Status, { label: string; cls: string; icon: ReactNode }> = {
    pending: { label: t('tools.image-compressor.ui.statusPending', 'Waiting'), cls: 'bg-slate-100 text-slate-500', icon: null },
    processing: { label: t('tools.image-compressor.ui.statusProcessing', 'Processing'), cls: 'bg-amber-100 text-amber-700', icon: <Loader2 className="h-3 w-3 animate-spin" /> },
    done: { label: t('tools.image-compressor.ui.statusDone', 'Done'), cls: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 className="h-3 w-3" /> },
    error: { label: t('tools.image-compressor.ui.statusError', 'Failed'), cls: 'bg-red-100 text-red-700', icon: <AlertCircle className="h-3 w-3" /> },
  };
  const m = map[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${m.cls}`}>
      {m.icon}
      {m.label}
    </span>
  );
}
