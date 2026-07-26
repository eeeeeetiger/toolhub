'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useI18n } from '@/i18n';

export default function ImageBorderClient() {
  const { t } = useI18n();
  const [src, setSrc] = useState<string | null>(null);
  const [radius, setRadius] = useState(24);
  const [borderWidth, setBorderWidth] = useState(12);
  const [borderColor, setBorderColor] = useState('#6366f1');
  const [gradient, setGradient] = useState(false);
  const [bg, setBg] = useState('#ffffff');
  const [transparent, setTransparent] = useState(true);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const rafRef = useRef<number | null>(null);

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setSrc(URL.createObjectURL(f));
      setOutUrl(null);
    }
  };

  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  };

  const render = () => {
    const img = imgRef.current;
    if (!img || !img.complete) return;
    setBusy(true);
    requestAnimationFrame(() => {
      // 边框宽度直接决定可见边框的粗细：画布 = 原图 + 边框*2
      const W = img.naturalWidth + borderWidth * 2;
      const H = img.naturalHeight + borderWidth * 2;
      const cv = document.createElement('canvas');
      cv.width = W;
      cv.height = H;
      const ctx = cv.getContext('2d')!;
      // 背景：透明模式则留空（圆角外侧保持透明），否则填充背景色
      if (!transparent) {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);
      }
      // 边框层：整张画布带圆角
      ctx.save();
      roundRect(ctx, 0, 0, W, H, radius);
      ctx.clip();
      if (gradient) {
        const g = ctx.createLinearGradient(0, 0, W, H);
        g.addColorStop(0, borderColor);
        g.addColorStop(1, transparent ? 'rgba(0,0,0,0)' : bg);
        ctx.fillStyle = g;
      } else {
        ctx.fillStyle = borderColor;
      }
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
      // 原图层：从 borderWidth 起，圆角 = radius - borderWidth
      ctx.save();
      roundRect(ctx, borderWidth, borderWidth, W - borderWidth * 2, H - borderWidth * 2, Math.max(0, radius - borderWidth));
      ctx.clip();
      ctx.drawImage(img, borderWidth, borderWidth, img.naturalWidth, img.naturalHeight);
      ctx.restore();
      cv.toBlob((b) => {
        if (b) {
          setOutUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(b);
          });
        }
        setBusy(false);
      }, 'image/png');
    });
  };

  useEffect(() => {
    if (!src) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => render());
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, radius, borderWidth, borderColor, gradient, bg, transparent]);

  return (
    <div className="space-y-4">
      <label className="block cursor-pointer rounded-lg border border-dashed border-brand/30 px-4 py-6 text-center text-sm text-brand hover:bg-brand/5">
        {t('tools.image-border.ui.upload', 'Choose an image')}
        <input type="file" accept="image/*" className="hidden" onChange={onFile} />
      </label>
      {src && (
        <>
          <img ref={imgRef} src={src} alt="src" className="hidden" onLoad={render} />

          {/* 实时预览（位于设置项上方） */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
              {t('tools.image-border.ui.preview', 'Preview')}
              {busy && <span className="text-xs font-normal text-slate-400">{t('tools.image-border.ui.rendering', 'Rendering…')}</span>}
            </p>
            <div
              className="flex min-h-[140px] items-center justify-center overflow-hidden rounded-lg border border-slate-200"
              style={
                transparent
                  ? {
                      backgroundImage:
                        'linear-gradient(45deg,#cbd5e1 25%,transparent 25%),linear-gradient(-45deg,#cbd5e1 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#cbd5e1 75%),linear-gradient(-45deg,transparent 75%,#cbd5e1 75%)',
                      backgroundSize: '16px 16px',
                      backgroundPosition: '0 0,0 8px,8px -8px,-8px 0',
                    }
                  : { backgroundColor: '#ffffff' }
              }
            >
              {outUrl ? (
                <img src={outUrl} alt="preview" className="max-h-[60vh] w-auto object-contain" />
              ) : (
                <span className="text-xs text-slate-400">{t('tools.image-border.ui.rendering', 'Rendering…')}</span>
              )}
            </div>
            {outUrl && (
              <a
                href={outUrl}
                download="bordered.png"
                className="mt-3 inline-block w-full rounded-lg bg-brand px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand/90"
              >
                {t('tools.image-border.ui.download', 'Download')}
              </a>
            )}
          </div>

          {/* 设置项（位于预览下方） */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Slider label={t('tools.image-border.ui.radius', 'Corner radius')} value={radius} min={0} max={200} onChange={setRadius} />
            <Slider label={t('tools.image-border.ui.thickness', 'Border width')} value={borderWidth} min={0} max={60} onChange={setBorderWidth} />
            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm text-slate-500">{t('tools.image-border.ui.color', 'Border color')}</label>
              <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="h-9 w-full rounded border border-brand/20" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={gradient} onChange={(e) => setGradient(e.target.checked)} />
            {t('tools.image-border.ui.gradient', 'Use gradient border')}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} />
            {t('tools.image-border.ui.transparent', 'Transparent background')}
          </label>
          {(!transparent || gradient) && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">
                {gradient ? t('tools.image-border.ui.bgGradient', 'Gradient end') : t('tools.image-border.ui.bg', 'Background')}
              </span>
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-9 w-16 rounded border border-brand/20" />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-slate-500">
        {label}: {value}px
      </label>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
    </div>
  );
}
