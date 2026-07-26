'use client';

import { useRef, useState, useEffect, type ChangeEvent } from 'react';
import { useI18n } from '@/i18n';
import {
  decodeGif,
  encodeGif,
  decodeWebp,
  cropFrames,
  scaleFrames,
  sampleFrames,
  reverseFrames,
  setSpeed,
  frameToCanvas,
  type DecodedGif,
  type GifFrame,
} from '@/lib/gif';
import { encodeWebp } from '@/lib/webp';

interface Options {
  speed: number; // 倍率，越大越快
  reverse: boolean;
  scale: number; // 0.1 - 1
  sampleStep: number; // 1 = 不抽帧（均匀抽帧用）
  quality: number; // 导出图片质量 1-20（越大越好）
  crop: boolean;
  cropX: number;
  cropY: number;
  cropW: number;
  cropH: number;
}

const defaultOptions = (w: number, h: number): Options => ({
  speed: 1,
  reverse: false,
  scale: 1,
  sampleStep: 1,
  quality: 20,
  crop: false,
  cropX: 0,
  cropY: 0,
  cropW: w,
  cropH: h,
});

export default function GifEditorClient() {
  const { t } = useI18n();
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [decoded, setDecoded] = useState<DecodedGif | null>(null);
  const [opts, setOpts] = useState<Options | null>(null);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [removed, setRemoved] = useState<number[]>([]);
  const [format, setFormat] = useState<'gif' | 'webp'>('gif');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const previewToken = useRef(0);
  const srcImgRef = useRef<HTMLImageElement>(null);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setError(null);
    setOutUrl(null);
    setPreviewUrl(null);
    setRemoved([]);
    setThumbs([]);
    if (f.type !== 'image/gif' && f.type !== 'image/webp') {
      setError(t('tools.gif-editor.ui.onlyGif', 'Please upload a GIF or WebP file.'));
      return;
    }
    const url = URL.createObjectURL(f);
    setSrcUrl(url);
    try {
      let d: DecodedGif;
      if (f.type === 'image/webp') {
        d = await decodeWebp(await f.arrayBuffer());
      } else {
        d = await decodeGif(await f.arrayBuffer());
      }
      if (d.frames.length === 0) {
        setError(t('tools.gif-editor.ui.decodeFail', 'Could not read this file.'));
        return;
      }
      setDecoded(d);
      setOpts(defaultOptions(d.width, d.height));
      setThumbs(generateThumbs(d));
    } catch {
      setError(t('tools.gif-editor.ui.decodeFail', 'Could not read this file.'));
    }
  };

  const generateThumbs = (d: DecodedGif): string[] => {
    const tw = 88;
    return d.frames.map((fr) => {
      const c = frameToCanvas(fr);
      const tc = document.createElement('canvas');
      tc.width = tw;
      tc.height = Math.max(1, Math.round((c.height * tw) / c.width));
      tc.getContext('2d')!.drawImage(c, 0, 0, tc.width, tc.height);
      return tc.toDataURL('image/png');
    });
  };

  const buildFrames = (removedArr: number[]): GifFrame[] => {
    if (!decoded || !opts) return [];
    let frames = decoded.frames;
    if (opts.crop) {
      frames = cropFrames(frames, {
        x: Math.max(0, Math.min(opts.cropX, decoded.width - 1)),
        y: Math.max(0, Math.min(opts.cropY, decoded.height - 1)),
        w: Math.max(1, Math.min(opts.cropW, decoded.width)),
        h: Math.max(1, Math.min(opts.cropH, decoded.height)),
      });
    }
    frames = scaleFrames(frames, opts.scale);
    // 逐帧删除：按原始帧索引过滤（crop/scale 不改变帧数量与顺序）
    frames = frames.filter((_, i) => !removedArr.includes(i));
    frames = sampleFrames(frames, opts.sampleStep);
    if (opts.reverse) frames = reverseFrames(frames);
    frames = setSpeed(frames, opts.speed);
    return frames;
  };

  const update = (patch: Partial<Options>) => {
    setOpts((prev) => (prev ? { ...prev, ...patch } : prev));
    setOutUrl(null);
  };

  const toggleRemoved = (i: number) => {
    setRemoved((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
    setOutUrl(null);
  };

  // 预览：实时编码一个缩小版动画 GIF（而非只画首帧），让预览真正动起来
  const renderPreview = async () => {
    if (!decoded || !opts) return;
    const token = ++previewToken.current;
    const frames = buildFrames(removed);
    if (!frames.length) {
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      return;
    }
    try {
      let pf = frames;
      const maxW = 280;
      if (pf[0].imageData.width > maxW) pf = scaleFrames(pf, maxW / pf[0].imageData.width);
      const blob = await encodeGif(pf, {
        width: pf[0].imageData.width,
        height: pf[0].imageData.height,
        quality: 10,
      });
      if (token !== previewToken.current) return; // 已有更新的预览，丢弃旧结果
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch {
      /* 预览失败不影响导出 */
    }
  };

  const exportResult = async () => {
    if (!decoded || !opts) return;
    setProcessing(true);
    setProgress(0);
    setOutUrl(null);
    try {
      const frames = buildFrames(removed);
      if (!frames.length) throw new Error('no frames');
      let blob: Blob;
      if (format === 'webp') {
        blob = await encodeWebp(frames, { quality: opts.quality, onProgress: setProgress });
      } else {
        blob = await encodeGif(frames, {
          width: frames[0].imageData.width,
          height: frames[0].imageData.height,
          quality: 21 - opts.quality,
          onProgress: setProgress,
        });
      }
      const url = URL.createObjectURL(blob);
      setOutUrl(url);
    } catch {
      setError(t('tools.gif-editor.ui.exportFail', 'Failed to export.'));
    } finally {
      setProcessing(false);
    }
  };

  const totalDuration = decoded && opts ? Math.round(buildFrames(removed).reduce((s, f) => s + f.delay, 0) / 10) : 0;
  const removedSig = removed.join(',');

  // 编辑参数变化（不含质量）时防抖重编码预览动画
  useEffect(() => {
    const id = setTimeout(() => {
      renderPreview();
    }, 150);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decoded, opts?.speed, opts?.reverse, opts?.scale, opts?.sampleStep, opts?.crop, opts?.cropX, opts?.cropY, opts?.cropW, opts?.cropH, removedSig]);

  return (
    <div className="space-y-4">
      <label className="block cursor-pointer rounded-lg border border-dashed border-brand/30 px-4 py-6 text-center text-sm text-brand hover:bg-brand/5">
        {t('tools.gif-editor.ui.upload', 'Choose a GIF or WebP')}
        <input type="file" accept="image/gif,image/webp" className="hidden" onChange={onFile} />
      </label>

      {error && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      {decoded && opts && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 rounded-lg border border-slate-200 p-3">
              <p className="text-sm font-medium text-slate-700">{t('tools.gif-editor.ui.original', 'Original')}</p>
              <div className="relative flex h-48 justify-center overflow-hidden rounded bg-slate-100">
                {srcUrl && (
                  <img ref={srcImgRef} src={srcUrl} alt="gif" className="h-full w-auto object-contain" />
                )}
                {srcUrl && opts.crop && (
                  <CropOverlay
                    imgRef={srcImgRef}
                    naturalWidth={decoded.width}
                    naturalHeight={decoded.height}
                    cropX={opts.cropX}
                    cropY={opts.cropY}
                    cropW={opts.cropW}
                    cropH={opts.cropH}
                    onChange={(rect) => update({ cropX: rect.x, cropY: rect.y, cropW: rect.w, cropH: rect.h })}
                  />
                )}
              </div>
              <p className="text-xs text-slate-500">
                {decoded.frames.length} {t('tools.gif-editor.ui.frames', 'frames')} · {decoded.width}×{decoded.height}px
              </p>
              {opts.crop && (
                <p className="text-xs text-slate-500">
                  {t('tools.gif-editor.ui.cropHint', 'Drag on the image to select the crop area; drag the box to move, use handles to resize.')}
                </p>
              )}
            </div>
            <div className="space-y-2 rounded-lg border border-slate-200 p-3">
              <p className="text-sm font-medium text-slate-700">{t('tools.gif-editor.ui.preview', 'Preview')}</p>
              {previewUrl ? (
                <img src={previewUrl} alt="preview" className="max-h-48 rounded bg-slate-100" />
              ) : (
                <div className="flex h-32 items-center justify-center rounded bg-slate-100 text-xs text-slate-400">
                  {t('tools.gif-editor.ui.previewEmpty', 'No frames')}
                </div>
              )}
              <p className="text-xs text-slate-500">
                ≈ {totalDuration} {t('tools.gif-editor.ui.ms', 'ms')} {t('tools.gif-editor.ui.duration', 'total')}
              </p>
            </div>
          </div>

          {/* 逐帧删除 */}
          <CollapsiblePanel title={t('tools.gif-editor.ui.removeFrames', 'Remove frames')} defaultOpen>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">{t('tools.gif-editor.ui.frameHint', 'Click a thumbnail to delete that frame; click again to restore.')}</p>
              {removed.length > 0 && (
                <button
                  onClick={() => {
                    setRemoved([]);
                    setOutUrl(null);
                  }}
                  className="text-xs text-brand hover:underline"
                >
                  {t('tools.gif-editor.ui.restoreAll', 'Restore all')}
                </button>
              )}
            </div>
            <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8 md:grid-cols-10">
              {thumbs.map((src, i) => {
                const rm = removed.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggleRemoved(i)}
                    title={`#${i}`}
                    className={`relative aspect-square overflow-hidden rounded border ${
                      rm ? 'border-red-400 opacity-40' : 'border-slate-200 hover:border-brand'
                    }`}
                  >
                    <img src={src} alt={`frame ${i}`} className="h-full w-full object-cover" />
                    {rm && <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-red-600">✕</span>}
                  </button>
                );
              })}
            </div>
            {removed.length > 0 && (
              <p className="text-xs text-slate-500">
                {t('tools.gif-editor.ui.removedText', 'Removed')} {removed.length} {t('tools.gif-editor.ui.frames', 'frames')}
              </p>
            )}
          </CollapsiblePanel>

          {/* 编辑：调速 / 反转 */}
          <div className="space-y-3 rounded-lg border border-slate-200 p-3">
            <p className="text-sm font-semibold text-slate-700">{t('tools.gif-editor.ui.edit', 'Edit')}</p>
            <Slider
              label={`${t('tools.gif-editor.ui.speed', 'Speed')}: ${opts.speed.toFixed(2)}×`}
              value={opts.speed}
              min={0.25}
              max={4}
              step={0.25}
              onChange={(v) => update({ speed: v })}
            />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={opts.reverse} onChange={(e) => update({ reverse: e.target.checked })} />
              {t('tools.gif-editor.ui.reverse', 'Reverse animation')}
            </label>
          </div>

          {/* 压缩 */}
          <CollapsiblePanel title={t('tools.gif-editor.ui.compress', 'Compress (smaller file)')} defaultOpen>
            <Slider
              label={`${t('tools.gif-editor.ui.scale', 'Resize')}: ${Math.round(opts.scale * 100)}%`}
              value={opts.scale}
              min={0.1}
              max={1}
              step={0.05}
              onChange={(v) => update({ scale: v })}
            />
            <Slider
              label={`${t('tools.gif-editor.ui.sample', 'Keep 1 of every')} ${opts.sampleStep} ${t('tools.gif-editor.ui.framesUnit', 'frames')}`}
              value={opts.sampleStep}
              min={1}
              max={10}
              step={1}
              onChange={(v) => update({ sampleStep: v })}
            />
            <Slider
              label={`${t('tools.gif-editor.ui.quality', 'Export image quality')}: ${opts.quality}`}
              value={opts.quality}
              min={1}
              max={20}
              step={1}
              onChange={(v) => update({ quality: v })}
            />
            <p className="text-xs text-slate-500">
              {t('tools.gif-editor.ui.qualityHintGif', 'Export image quality: higher = better & larger file; lower = smaller file. Default is set to the highest quality.')}
            </p>
          </CollapsiblePanel>

          {/* 裁剪 */}
          <div className="space-y-3 rounded-lg border border-slate-200 p-3">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={opts.crop} onChange={(e) => update({ crop: e.target.checked })} />
              {t('tools.gif-editor.ui.crop', 'Crop')}
            </label>
            {opts.crop && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <NumberField label="X" value={opts.cropX} max={decoded.width} onChange={(v) => update({ cropX: v })} />
                <NumberField label="Y" value={opts.cropY} max={decoded.height} onChange={(v) => update({ cropY: v })} />
                <NumberField label="W" value={opts.cropW} max={decoded.width} onChange={(v) => update({ cropW: v })} />
                <NumberField label="H" value={opts.cropH} max={decoded.height} onChange={(v) => update({ cropH: v })} />
              </div>
            )}
          </div>

          {/* 导出格式（置于裁剪下方） */}
          <div className="space-y-3 rounded-lg border border-slate-200 p-3">
            <p className="text-sm font-semibold text-slate-700">{t('tools.gif-editor.ui.format', 'Export format')}</p>
            <div className="flex gap-2">
              {(['gif', 'webp'] as const).map((fm) => (
                <button
                  key={fm}
                  onClick={() => {
                    setFormat(fm);
                    setOutUrl(null);
                  }}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                    format === fm ? 'border-brand bg-brand/10 text-brand' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {t(`tools.gif-editor.ui.${fm}`, fm.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportResult}
              disabled={processing}
              className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-50"
            >
              {processing
                ? t('tools.gif-editor.ui.processing', 'Processing…')
                : `${t('tools.gif-editor.ui.generate', 'Generate')} ${format.toUpperCase()}`}
            </button>
            <button
              onClick={() => setOpts(defaultOptions(decoded.width, decoded.height))}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              {t('tools.gif-editor.ui.reset', 'Reset')}
            </button>
            {outUrl && (
              <>
                <img src={outUrl} alt="result" className="max-h-24 rounded bg-slate-100" />
                <a
                  href={outUrl}
                  download={format === 'webp' ? 'edited.webp' : 'edited.gif'}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  {t('tools.gif-editor.ui.download', 'Download')}
                </a>
                <button
                  onClick={() => downloadBlobURL(outUrl, format === 'webp' ? 'edited.webp' : 'edited.gif')}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  {t('tools.gif-editor.ui.save', 'Save')}
                </button>
              </>
            )}
          </div>
          {processing && (
            <div className="h-2 w-full overflow-hidden rounded bg-slate-100">
              <div className="h-full bg-brand transition-all" style={{ width: `${Math.round(progress * 100)}%` }} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CropOverlay({
  imgRef,
  naturalWidth,
  naturalHeight,
  cropX,
  cropY,
  cropW,
  cropH,
  onChange,
}: {
  imgRef: React.RefObject<HTMLImageElement | null>;
  naturalWidth: number;
  naturalHeight: number;
  cropX: number;
  cropY: number;
  cropW: number;
  cropH: number;
  onChange: (rect: { x: number; y: number; w: number; h: number }) => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [imgRect, setImgRect] = useState<{
    left: number;
    top: number;
    w: number;
    h: number;
    scaleX: number;
    scaleY: number;
  } | null>(null);
  const dragRef = useRef<{
    mode: string;
    startX: number;
    startY: number;
    startRect: { x: number; y: number; w: number; h: number };
  } | null>(null);

  const refresh = () => {
    const img = imgRef.current;
    const overlay = overlayRef.current;
    if (!img || !overlay) return;
    const oRect = overlay.getBoundingClientRect();
    const iRect = img.getBoundingClientRect();
    setImgRect({
      left: iRect.left - oRect.left,
      top: iRect.top - oRect.top,
      w: iRect.width,
      h: iRect.height,
      scaleX: naturalWidth / iRect.width,
      scaleY: naturalHeight / iRect.height,
    });
  };

  useEffect(() => {
    refresh();
    const img = imgRef.current;
    const handleResize = () => refresh();
    const handleLoad = () => refresh();
    window.addEventListener('resize', handleResize);
    if (img) img.addEventListener('load', handleLoad);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (img) img.removeEventListener('load', handleLoad);
    };
  }, [imgRef, naturalWidth, naturalHeight]);

  const toNat = (px: number, py: number) => {
    if (!imgRect) return { x: 0, y: 0 };
    return {
      x: Math.round((px - imgRect.left) * imgRect.scaleX),
      y: Math.round((py - imgRect.top) * imgRect.scaleY),
    };
  };

  const toPx = (rect: { x: number; y: number; w: number; h: number }) => {
    if (!imgRect) return { x: 0, y: 0, w: 0, h: 0 };
    return {
      x: imgRect.left + rect.x / imgRect.scaleX,
      y: imgRect.top + rect.y / imgRect.scaleY,
      w: rect.w / imgRect.scaleX,
      h: rect.h / imgRect.scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const overlay = overlayRef.current;
    if (!overlay || !imgRect) return;
    const oRect = overlay.getBoundingClientRect();
    const px = e.clientX - oRect.left;
    const py = e.clientY - oRect.top;
    // 只在图片实际显示区域内响应
    if (px < imgRect.left || px > imgRect.left + imgRect.w || py < imgRect.top || py > imgRect.top + imgRect.h) return;
    const pxRect = toPx({ x: cropX, y: cropY, w: cropW, h: cropH });
    const handle = getHandle(px, py, pxRect, 8);
    const mode = handle || (pointInRect(px, py, pxRect) ? 'move' : 'create');
    dragRef.current = { mode, startX: px, startY: py, startRect: { x: cropX, y: cropY, w: cropW, h: cropH } };

    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current || !overlayRef.current || !imgRect) return;
      const oRect2 = overlayRef.current.getBoundingClientRect();
      const px2 = ev.clientX - oRect2.left;
      const py2 = ev.clientY - oRect2.top;
      const { mode, startX, startY, startRect } = dragRef.current;
      const n1 = toNat(startX, startY);
      const n2 = toNat(px2, py2);
      let next = { ...startRect };
      if (mode === 'create') {
        next.x = Math.min(n1.x, n2.x);
        next.y = Math.min(n1.y, n2.y);
        next.w = Math.abs(n2.x - n1.x);
        next.h = Math.abs(n2.y - n1.y);
      } else if (mode === 'move') {
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        next.x = Math.max(0, Math.min(startRect.x + dx, naturalWidth - startRect.w));
        next.y = Math.max(0, Math.min(startRect.y + dy, naturalHeight - startRect.h));
      } else {
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        next = applyResize(mode, startRect, dx, dy, naturalWidth, naturalHeight);
      }
      onChange({
        x: Math.round(next.x),
        y: Math.round(next.y),
        w: Math.round(Math.max(1, next.w)),
        h: Math.round(Math.max(1, next.h)),
      });
    };

    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const pxRect = toPx({ x: cropX, y: cropY, w: cropW, h: cropH });
  if (!imgRect) return <div ref={overlayRef} className="absolute inset-0" />;
  return (
    <div ref={overlayRef} className="absolute inset-0 cursor-crosshair" onMouseDown={handleMouseDown}>
      {/* 暗色遮罩（4 块拼成） */}
      <div className="pointer-events-none absolute bg-black/40" style={{ left: 0, top: 0, width: pxRect.x, height: '100%' }} />
      <div className="pointer-events-none absolute bg-black/40" style={{ left: pxRect.x + pxRect.w, top: 0, right: 0, bottom: 0 }} />
      <div className="pointer-events-none absolute bg-black/40" style={{ left: pxRect.x, top: 0, width: pxRect.w, height: pxRect.y }} />
      <div
        className="pointer-events-none absolute bg-black/40"
        style={{ left: pxRect.x, top: pxRect.y + pxRect.h, width: pxRect.w, height: `calc(100% - ${pxRect.y + pxRect.h}px)` }}
      />
      {/* 选框 */}
      <div
        className="pointer-events-none absolute border-2 border-white shadow-sm"
        style={{ left: pxRect.x, top: pxRect.y, width: pxRect.w, height: pxRect.h }}
      />
      {/* 8 个手柄 */}
      {(['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'] as const).map((h) => {
        const pos = handlePos(h, pxRect);
        return (
          <div
            key={h}
            className="pointer-events-none absolute h-2 w-2 rounded-full border border-white bg-brand"
            style={{ left: pos.x - 4, top: pos.y - 4 }}
          />
        );
      })}
    </div>
  );
}

function handlePos(mode: string, rect: { x: number; y: number; w: number; h: number }) {
  const { x, y, w, h } = rect;
  switch (mode) {
    case 'nw':
      return { x, y };
    case 'n':
      return { x: x + w / 2, y };
    case 'ne':
      return { x: x + w, y };
    case 'w':
      return { x, y: y + h / 2 };
    case 'e':
      return { x: x + w, y: y + h / 2 };
    case 'sw':
      return { x, y: y + h };
    case 's':
      return { x: x + w / 2, y: y + h };
    case 'se':
      return { x: x + w, y: y + h };
    default:
      return { x, y };
  }
}

function getHandle(px: number, py: number, rect: { x: number; y: number; w: number; h: number }, size: number) {
  const hs = size;
  const handles = [
    { name: 'nw', x: rect.x - hs / 2, y: rect.y - hs / 2 },
    { name: 'n', x: rect.x + rect.w / 2 - hs / 2, y: rect.y - hs / 2 },
    { name: 'ne', x: rect.x + rect.w - hs / 2, y: rect.y - hs / 2 },
    { name: 'w', x: rect.x - hs / 2, y: rect.y + rect.h / 2 - hs / 2 },
    { name: 'e', x: rect.x + rect.w - hs / 2, y: rect.y + rect.h / 2 - hs / 2 },
    { name: 'sw', x: rect.x - hs / 2, y: rect.y + rect.h - hs / 2 },
    { name: 's', x: rect.x + rect.w / 2 - hs / 2, y: rect.y + rect.h - hs / 2 },
    { name: 'se', x: rect.x + rect.w - hs / 2, y: rect.y + rect.h - hs / 2 },
  ];
  for (const h of handles) {
    if (px >= h.x && px <= h.x + hs && py >= h.y && py <= h.y + hs) return h.name;
  }
  return null;
}

function pointInRect(px: number, py: number, rect: { x: number; y: number; w: number; h: number }) {
  return px >= rect.x && px <= rect.x + rect.w && py >= rect.y && py <= rect.y + rect.h;
}

function applyResize(
  mode: string,
  start: { x: number; y: number; w: number; h: number },
  dx: number,
  dy: number,
  maxW: number,
  maxH: number,
) {
  let x = start.x;
  let y = start.y;
  let w = start.w;
  let h = start.h;
  if (mode.includes('e')) w = Math.max(1, start.w + dx);
  if (mode.includes('s')) h = Math.max(1, start.h + dy);
  if (mode.includes('w')) {
    x = Math.min(start.x + dx, start.x + start.w - 1);
    w = start.x + start.w - x;
  }
  if (mode.includes('n')) {
    y = Math.min(start.y + dy, start.y + start.h - 1);
    h = start.y + start.h - y;
  }
  if (x < 0) {
    w += x;
    x = 0;
  }
  if (y < 0) {
    h += y;
    y = 0;
  }
  if (w < 1) w = 1;
  if (h < 1) h = 1;
  if (x + w > maxW) w = maxW - x;
  if (y + h > maxH) h = maxH - y;
  return { x, y, w, h };
}

function downloadBlobURL(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}

function Slider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-slate-500">{label}</label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
    </div>
  );
}

function NumberField({ label, value, max, onChange }: { label: string; value: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-slate-500">{label}</label>
      <input
        type="number"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Math.max(0, Math.min(max, Number(e.target.value) || 0)))}
        className="w-full rounded border border-slate-200 px-2 py-1 text-sm"
      />
    </div>
  );
}

function CollapsiblePanel({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 p-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-sm font-semibold text-slate-700"
      >
        <span>{title}</span>
        <span className="text-slate-400">{open ? '▾' : '▸'}</span>
      </button>
      {open && <div className="space-y-3">{children}</div>}
    </div>
  );
}
