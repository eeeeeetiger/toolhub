'use client';

import { useRef, useState, useEffect, type ChangeEvent } from 'react';
import { useI18n } from '@/i18n';

export default function ImageFilterClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [blur, setBlur] = useState(0);
  const [invert, setInvert] = useState(false);
  const [compare, setCompare] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  const urlRef = useRef<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  const buildFilter = () =>
    `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px) ${
      invert ? 'invert(1)' : ''
    }`;

  const draw = (useFilter: boolean) => {
    const img = imgRef.current;
    const c = canvasRef.current;
    if (!img || !c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.filter = useFilter ? buildFilter() : 'none';
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, c.width, c.height);
  };

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setError(null);
    setLoaded(false);
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    if (!f) return;
    const url = URL.createObjectURL(f);
    urlRef.current = url;
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      if (canvasRef.current) {
        canvasRef.current.width = img.naturalWidth;
        canvasRef.current.height = img.naturalHeight;
      }
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setLoaded(true);
    };
    img.onerror = () => setError(t('image-filter.ui.loadFail', 'Could not load this image.'));
    img.src = url;
  };

  // 滤镜 / 对比 变化时实时重绘
  useEffect(() => {
    if (loaded) draw(!compare);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brightness, contrast, grayscale, sepia, blur, invert, compare, loaded]);

  // 滚轮缩放（非被动监听，便于阻止页面滚动）
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      setZoom((z) => Math.min(8, Math.max(0.2, z * factor)));
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    dragRef.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
    const move = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      setPan({
        x: dragRef.current.px + (ev.clientX - dragRef.current.x),
        y: dragRef.current.py + (ev.clientY - dragRef.current.y),
      });
    };
    const up = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const download = () => {
    const c = canvasRef.current;
    if (!c) return;
    draw(true); // 始终导出滤镜后的结果
    const stem = file?.name ? file.name.replace(/\.[^.]+$/, '') : 'image';
    c.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${stem}-enhanced.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }, 'image/png');
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setGrayscale(0);
    setSepia(0);
    setBlur(0);
    setInvert(false);
  };

  const labelCls = 'mb-1 block text-sm text-slate-600';
  const sliders: [string, number, (v: number) => void, number, number, string][] = [
    ['brightness', brightness, setBrightness, 0, 200, '%'],
    ['contrast', contrast, setContrast, 0, 200, '%'],
    ['grayscale', grayscale, setGrayscale, 0, 100, '%'],
    ['sepia', sepia, setSepia, 0, 100, '%'],
    ['blur', blur, setBlur, 0, 20, 'px'],
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <label className="mb-2 block text-sm font-medium text-slate-700">{t('image-filter.ui.pick', 'Choose an image')}</label>
        <input
          type="file"
          accept="image/*"
          onChange={onPick}
          className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand"
        />
        <p className="mt-2 text-xs text-slate-500">{t('image-filter.ui.local', 'Processed locally in your browser.')}</p>
      </div>

      {file && (
        <>
          {/* 预览视口：滚轮缩放 + 拖拽平移 */}
          <div
            ref={containerRef}
            onMouseDown={onMouseDown}
            className="relative flex h-[520px] items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
          >
            <canvas
              ref={canvasRef}
              className="max-h-full max-w-full cursor-grab select-none active:cursor-grabbing"
              style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center' }}
            />
            {!loaded && (
              <div className="absolute text-sm text-slate-400">{t('image-filter.ui.loading', 'Loading…')}</div>
            )}
          </div>

          {/* 缩放控制 */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setZoom((z) => Math.min(8, z * 1.2))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              ＋
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.2, z / 1.2))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              －
            </button>
            <button
              onClick={resetView}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              {t('image-filter.ui.fit', 'Fit')}
            </button>
            <span className="ml-1 text-sm text-slate-500">{Math.round(zoom * 100)}%</span>
            <span className="ml-2 text-xs text-slate-400">{t('image-filter.ui.zoomHint', 'Scroll to zoom · drag to pan')}</span>
          </div>

          {/* 滤镜调节 */}
          <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-5">
            {sliders.map(([key, v, setV, min, max, unit]) => (
              <div key={key}>
                <label className={labelCls}>
                  {t(`image-filter.ui.${key}`, key)}: {v}
                  {unit}
                </label>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={v}
                  onChange={(e) => setV(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            ))}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={invert} onChange={(e) => setInvert(e.target.checked)} />
              {t('image-filter.ui.invert', 'Invert colors')}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} />
              {t('image-filter.ui.compare', 'Show original (compare)')}
            </label>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={download}
              className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90"
            >
              {t('image-filter.ui.download', 'Download')}
            </button>
            <button
              onClick={resetFilters}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              {t('image-filter.ui.reset', 'Reset filters')}
            </button>
          </div>
        </>
      )}

      {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
    </div>
  );
}
