'use client';

import { useEffect, useRef, useState, type DragEvent, type ReactNode } from 'react';
import { Upload, FolderOpen, Trash2, Download, FileImage, X, CheckCircle2, Loader2, AlertCircle, Sparkles, Wand2, Info } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';
import { useI18n } from '@/i18n';
import { removeBackground } from '@imgly/background-removal';

type Status = 'pending' | 'processing' | 'done' | 'error';
type UsedMode = 'solid' | 'smart';
type ForceMode = 'solid' | 'smart';

interface Item {
  id: string;
  file: File;
  name: string;
  dir: string;
  base: string;
  originalSize: number;
  thumbUrl: string;
  status: Status;
  resultUrl?: string;
  resultSize?: number;
  bytes?: Uint8Array;
  usedMode?: UsedMode;
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

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('图片解码失败'));
    };
    img.src = url;
  });
}

// ─── 背景检测：用成熟算法推断背景色，并计算「边缘匹配度」 ───
// 边缘匹配度 = 四条边像素中「接近背景色」的比例。
// < 55% → 判断为非纯色背景 → auto 模式 fallback 到智能。
// ≥ 55% → 走成熟纯色算法（魔棒+洪水填充，见 background-remove.worker.ts）。
import { inferBackgroundColor } from './background-remove.worker';

function edgeMatchRatio(imgData: ImageData): { bg: [number, number, number]; ratio: number } {
  const { data, width, height } = imgData;
  const bg = inferBackgroundColor(imgData);
  const tol = 48;
  let edgeTotal = 0;
  let near = 0;
  const consider = (x: number, y: number) => {
    const i = (y * width + x) * 4;
    if (data[i + 3] < 128) return;
    edgeTotal++;
    const d = Math.max(
      Math.abs(data[i] - bg[0]),
      Math.abs(data[i + 1] - bg[1]),
      Math.abs(data[i + 2] - bg[2]),
    );
    if (d < tol) near++;
  };
  for (let x = 0; x < width; x++) { consider(x, 0); consider(x, height - 1); }
  for (let y = 0; y < height; y++) { consider(0, y); consider(width - 1, y); }
  return { bg, ratio: edgeTotal ? near / edgeTotal : 0 };
}

async function imageDataToPngBlob(imgData: ImageData): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = imgData.width;
  canvas.height = imgData.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('无法创建画布');
  ctx.putImageData(imgData, 0, 0);
  return await new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG 编码失败'))), 'image/png');
  });
}

export default function ImageBackgroundRemoverClient() {
  const { t } = useI18n();
  const [items, setItems] = useState<Item[]>([]);
  const [tolerance, setTolerance] = useState(45);
  const [forceMode, setForceMode] = useState<ForceMode>('solid'); // 默认纯色，上传后自动检测修正
  const [detectedMode, setDetectedMode] = useState<ForceMode | null>(null); // 上传后检测结果
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<Item[]>([]);
  itemsRef.current = items;

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

  // 上传图片后自动检测所有图片的背景类型，设置推荐模式
  useEffect(() => {
    if (!items.length) { setDetectedMode(null); return; }
    let cancelled = false;
    (async () => {
      let hasComplex = false;
      for (const it of items) {
        try {
          const img = await loadImageElement(it.file);
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const match = edgeMatchRatio(imgData);
          // 边缘匹配度 < 55% → 判为非纯色背景（复杂），推荐智能
          if (match.ratio < 0.55) { hasComplex = true; break; }
        } catch { /* 单张分析失败不影响整体 */ }
      }
      if (!cancelled) {
        const recommended: ForceMode = hasComplex ? 'smart' : 'solid';
        setDetectedMode(recommended);
        setForceMode(recommended);
      }
    })();
    return () => { cancelled = true; };
  }, [items]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const imgs = Array.from(list).filter((f) => f.type.startsWith('image/'));
    if (!imgs.length) return;
    const parsed = imgs.map(parseFile);
    setItems((prev) => [...prev, ...parsed]);
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
    setDetectedMode(null);
  };

  // 手动切换去背景模式：重置已完成的图片，使其能用新方式重新处理，并给出反馈。
  const switchMode = (mode: ForceMode) => {
    setForceMode(mode);
    setItems((prev) => {
      const hadDone = prev.some((it) => it.status === 'done');
      if (!hadDone) return prev;
      return prev.map((it) =>
        it.status === 'done'
          ? { ...it, status: 'pending', resultUrl: undefined, resultSize: undefined, bytes: undefined, usedMode: undefined, error: undefined }
          : it,
      );
    });
    setFeedback(
      mode === 'smart'
        ? t(
            'tools.batch-background-remover.ui.switchedSmart',
            '已切换至智能模式（AI 抠图）。已把之前处理好的图片重置为待处理，点击「一键去背景」即可用智能方式重新抠图。',
          )
        : t(
            'tools.batch-background-remover.ui.switchedSolid',
            '已切换至纯色模式（离线色键）。已把之前处理好的图片重置为待处理，点击「一键去背景」即可重新处理。',
          ),
    );
  };

  const updateItem = (id: string, patch: Partial<Item>) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  async function processItem(
    it: Item,
    mode: ForceMode,
    tol: number,
  ): Promise<{ bytes: Uint8Array; url: string; size: number; mode: UsedMode }> {
    const img = await loadImageElement(it.file);
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('无法创建画布');
    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, w, h);

    // 本次处理使用开始处理前快照的 mode，处理过程中不会被用户切换或自动修改。
    let blob: Blob;
    if (mode === 'solid') {
      const { removeSolidBackground } = await import('./background-remove.worker');
      const result = removeSolidBackground(imgData, { tolerance: tol, feather: 1 });
      blob = await imageDataToPngBlob(result.data);
    } else {
      blob = await removeBackground(it.file, { output: { format: 'image/png' } });
    }

    const buf = new Uint8Array(await blob.arrayBuffer());
    const url = URL.createObjectURL(blob);
    return { bytes: buf, url, size: blob.size, mode };
  }

  const processAll = async () => {
    if (processing || !items.length) return;
    // 快照当前模式与容差，确保一批图片处理过程中模式一致，不受用户中途切换影响。
    const currentMode = forceMode;
    const currentTolerance = tolerance;
    setProcessing(true);
    setFeedback(null);
    try {
      for (const it of itemsRef.current) {
        if (it.status === 'done') continue;
        updateItem(it.id, { status: 'processing', error: undefined });
        try {
          const res = await processItem(it, currentMode, currentTolerance);
          updateItem(it.id, {
            status: 'done',
            resultUrl: res.url,
            resultSize: res.size,
            bytes: res.bytes,
            usedMode: res.mode,
            error: undefined,
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
      let name = `${it.dir}${it.base}_nobg.png`;
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
    const zipped = zipSync(map, { level: 6 });
    const blob = new Blob([zipped as unknown as BlobPart], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'background-removed.zip';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const total = items.length;
  const processed = items.filter((it) => it.status === 'done' || it.status === 'error').length;
  const percent = total ? Math.round((processed / total) * 100) : 0;
  const doneItems = items.filter((it) => it.status === 'done');
  const canZip = doneItems.length > 0;

  const showTolerance = forceMode === 'solid'; // 容差滑块只在纯色模式时显示

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  // 检测结果文案
  const detectionLabel = detectedMode === 'solid'
    ? t('tools.batch-background-remover.ui.detectedSolid', 'Detected: solid/simple background')
    : detectedMode === 'smart'
      ? t('tools.batch-background-remover.ui.detectedSmart', 'Detected: complex background')
      : '';

  return (
    <div className="space-y-5">
      {/* 上传区 */}
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
        <p className="text-sm text-slate-500">{t('tools.batch-background-remover.ui.dropHint', 'Drag & drop images here, or use the buttons below')}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
          >
            <Upload className="h-4 w-4" /> {t('tools.batch-background-remover.ui.addFiles', 'Add Images')}
          </button>
          <button
            type="button"
            onClick={() => folderInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <FolderOpen className="h-4 w-4" /> {t('tools.batch-background-remover.ui.addFolder', 'Add Folder')}
          </button>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />
        <input ref={folderInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />
      </div>

      {/* 模式选择 + 参数 */}
      {items.length > 0 && (
        <div className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-white p-4">
          {/* 模式选择器：只有两个选项，上传后自动落在检测结果上 */}
          <div className="min-w-[220px] flex-1">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {t('tools.batch-background-remover.ui.modeLabel', 'Background removal mode')}
              {detectedMode && (
                <span className="ml-2 font-normal text-emerald-600">
                  ({detectionLabel})
                </span>
              )}
            </label>
            <div className="flex gap-1.5">
              <button
                type="button"
                disabled={processing}
                onClick={() => switchMode('solid')}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  forceMode === 'solid'
                    ? 'bg-brand text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={t('tools.batch-background-remover.ui.modeSolidDesc', 'Fast, offline — best for solid/simple backgrounds')}
              >
                {t('tools.batch-background-remover.ui.modeSolidOpt', 'Solid mode')}
              </button>
              <button
                type="button"
                disabled={processing}
                onClick={() => switchMode('smart')}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  forceMode === 'smart'
                    ? 'bg-violet-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={t('tools.batch-background-remover.ui.modeSmartDesc', 'AI matting is more accurate; downloads a model on first use')}
              >
                {t('tools.batch-background-remover.ui.modeSmartOpt', 'Smart mode')}
              </button>
            </div>

            {/* 智能模式的 40MB 提示 */}
            {forceMode === 'smart' && (
              <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                {t(
                  'tools.batch-background-remover.ui.smartWarning',
                  '智能模式首次使用需下载约 40MB 的 AI 模型（仅一次，之后浏览器缓存）。适合复杂背景或需要精确抠图的场景。',
                )}
              </p>
            )}

            {/* 纯色模式的说明 */}
            {forceMode === 'solid' && (
              <p className="mt-1.5 text-xs text-slate-400">
                <Sparkles className="mr-1 inline h-3.5 w-3.5 text-sky-500" />
                {t('tools.batch-background-remover.ui.solidNote', 'Fast color-key removal, fully offline — no model download')}
              </p>
            )}
          </div>

          {/* 纯色容差滑块 — 仅在纯色模式下显示 */}
          {showTolerance && (
            <div className="min-w-[240px] flex-1">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {t('tools.batch-background-remover.ui.tolerance', 'Solid background tolerance')}: {tolerance}
              </label>
              <input
                type="range"
                min={10}
                max={120}
                value={tolerance}
                disabled={processing}
                onChange={(e) => setTolerance(Number(e.target.value))}
                className="w-full accent-brand disabled:opacity-50"
              />
              <p className="mt-1 text-xs text-slate-400">
                {t('tools.batch-background-remover.ui.toleranceNote', 'Larger = more area near the background color is removed. Tip: 30-50 for clean solid backdrops, 60-90 for noisy ones')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 模式切换反馈提示 */}
      {feedback && (
        <div className="flex items-start gap-2 rounded-xl border border-brand/30 bg-brand/[0.06] px-4 py-3 text-sm text-slate-700">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
          <span>{feedback}</span>
        </div>
      )}

      {items.length > 0 && (
        <>
          {/* 操作栏 + 进度 */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={processAll}
              disabled={processing}
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              {processing ? t('tools.batch-background-remover.ui.processing', 'Processing…') : t('tools.batch-background-remover.ui.removeAll', 'Remove Background (All)')}
            </button>
            <button
              type="button"
              onClick={downloadZip}
              disabled={!canZip}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40"
            >
              <Download className="h-4 w-4" /> {t('tools.batch-background-remover.ui.downloadZip', 'Download All (ZIP)')}
            </button>
            <button
              type="button"
              onClick={clearAll}
              disabled={processing}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:text-red-600 disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" /> {t('tools.batch-background-remover.ui.clear', 'Clear')}
            </button>
            <span className="ml-auto text-sm text-slate-500">
              {t('tools.batch-background-remover.ui.total', 'Total')} {total} {t('tools.batch-background-remover.ui.images', 'images')}
            </span>
          </div>

          {/* 总进度 */}
          <div>
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>{t('tools.batch-background-remover.ui.processed', 'Processed')}: {processed}/{total}</span>
              <span>{percent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${percent}%` }} />
            </div>
          </div>

          {/* 列表：已完成显示对比预览卡片，未完成显示紧凑行 */}
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
            {items.map((it) =>
              it.status === 'done' && it.resultUrl ? (
                // ── 完成状态：对比预览卡片 ──
                <li key={it.id} className="bg-white p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                    {/* 左侧：原图 + 结果对比 */}
                    <div className="flex flex-shrink-0 gap-3">
                      {/* 原图 */}
                      <div className="text-center">
                        <p className="mb-1 text-xs text-slate-400">{t('tools.batch-background-remover.ui.previewOriginal', 'Original')}</p>
                        <div className="overflow-hidden rounded-lg border border-slate-200">
                          <img src={it.thumbUrl} alt="" className="h-28 w-28 object-cover sm:h-32 sm:w-32" />
                        </div>
                      </div>
                      {/* 结果（透明棋盘格底） */}
                      <div className="text-center">
                        <p className="mb-1 text-xs text-slate-400">{t('tools.batch-background-remover.ui.previewResult', 'Transparent')}</p>
                        <div
                          className="overflow-hidden rounded-lg border border-slate-200"
                          style={{
                            backgroundImage:
                              'linear-gradient(45deg,#e2e8f0 25%,transparent 25%),linear-gradient(-45deg,#e2e8f0 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e2e8f0 75%),linear-gradient(-45deg,transparent 75%,#e2e8f0)',
                            backgroundSize: '12px 12px',
                            backgroundPosition: '0 0,0 6px,6px -6px,-6px 0',
                          }}
                        >
                          <img src={it.resultUrl} alt="" className="h-28 w-28 object-contain sm:h-32 sm:w-32" />
                        </div>
                      </div>
                    </div>

                    {/* 右侧：信息 + 操作 */}
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium text-slate-800" title={it.name}>
                            {it.name}
                          </span>
                          {it.usedMode && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                it.usedMode === 'solid' ? 'bg-sky-100 text-sky-700' : 'bg-violet-100 text-violet-700'
                              }`}
                            >
                              {it.usedMode === 'solid'
                                ? t('tools.batch-background-remover.ui.modeSolid', 'Solid')
                                : t('tools.batch-background-remover.ui.modeSmart', 'Smart')}
                            </span>
                          )}
                        </div>
                        {it.resultSize != null && (
                          <p className="mt-1 text-xs text-slate-500">
                            {formatFileSize(it.originalSize)}{' '}
                            <span className="mx-1 text-slate-300">→</span>{' '}
                            <span className="font-medium text-emerald-600">{formatFileSize(it.resultSize)}</span>
                          </p>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <StatusBadge status={it.status} t={t} />
                        <a
                          href={it.resultUrl}
                          download={`${it.base}_nobg.png`}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-brand"
                        >
                          <Download className="h-3.5 w-3.5" />
                          {t('common.download', '下载')}
                        </a>
                        <button
                          type="button"
                          onClick={() => removeItem(it.id)}
                          disabled={processing}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 disabled:opacity-40"
                          title={t('tools.batch-background-remover.ui.remove', 'Remove')}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ) : (
                // ── 未完成/处理中/错误：紧凑行 ──
                <li key={it.id} className="flex items-center gap-3 bg-white p-3">
                  <img src={it.thumbUrl} alt="" className="h-10 w-10 flex-shrink-0 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-slate-800">{it.name}</span>
                    </div>
                    <div className="text-xs text-slate-500">{formatFileSize(it.originalSize)}</div>
                    {it.status === 'error' && <div className="text-xs text-red-600">{it.error}</div>}
                  </div>
                  <StatusBadge status={it.status} t={t} />
                  {it.status !== 'processing' && (
                    <button
                      type="button"
                      onClick={() => removeItem(it.id)}
                      disabled={processing}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 disabled:opacity-40"
                      title={t('tools.batch-background-remover.ui.remove', 'Remove')}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </li>
              )
            )}
          </ul>
        </>
      )}

      <p className="flex items-center gap-1.5 text-center text-xs text-slate-400">
        <Sparkles className="h-3.5 w-3.5" />
        {t('tools.batch-background-remover.ui.privacyNote', 'All processing happens locally in your browser. Images are never uploaded.')}
      </p>

      {items.length === 0 && (
        <p className="text-center text-sm text-slate-400">
          {t('tools.batch-background-remover.ui.empty', 'No images yet. Add files or a whole folder to begin.')}
        </p>
      )}
    </div>
  );
}

function StatusBadge({ status, t }: { status: Status; t: (k: string, f?: string) => string }) {
  const map: Record<Status, { label: string; cls: string; icon: ReactNode }> = {
    pending: { label: t('tools.batch-background-remover.ui.statusPending', 'Waiting'), cls: 'bg-slate-100 text-slate-500', icon: null },
    processing: { label: t('tools.batch-background-remover.ui.statusProcessing', 'Processing'), cls: 'bg-amber-100 text-amber-700', icon: <Loader2 className="h-3 w-3 animate-spin" /> },
    done: { label: t('tools.batch-background-remover.ui.statusDone', 'Done'), cls: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 className="h-3 w-3" /> },
    error: { label: t('tools.batch-background-remover.ui.statusError', 'Failed'), cls: 'bg-red-100 text-red-700', icon: <AlertCircle className="h-3 w-3" /> },
  };
  const m = map[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${m.cls}`}>
      {m.icon}
      {m.label}
    </span>
  );
}
