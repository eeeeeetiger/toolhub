'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { useI18n } from '@/i18n';

const SIZES = [16, 32, 48, 180, 192, 512];

function drawFavicon(
  size: number,
  bg: string,
  render: (ctx: CanvasRenderingContext2D, s: number) => void,
): Promise<Blob> {
  const cv = document.createElement('canvas');
  cv.width = size;
  cv.height = size;
  const ctx = cv.getContext('2d')!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);
  render(ctx, size);
  return new Promise((res) => cv.toBlob((b) => res(b!), 'image/png'));
}

export default function FaviconGeneratorClient() {
  const { t } = useI18n();
  const [mode, setMode] = useState<'image' | 'text'>('text');
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [text, setText] = useState('A');
  const [bg, setBg] = useState('#4f46e5');
  const [busy, setBusy] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const onImg = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setImgSrc(URL.createObjectURL(f));
  };

  const renderContent = (ctx: CanvasRenderingContext2D, s: number) => {
    if (mode === 'image' && imgRef.current) {
      const img = imgRef.current;
      const side = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = (img.naturalWidth - side) / 2;
      const sy = (img.naturalHeight - side) / 2;
      ctx.drawImage(img, sx, sy, side, side, 0, 0, s, s);
    } else {
      const txt = (text || 'A').slice(0, 2).toUpperCase();
      ctx.fillStyle = pickTextColor(bg);
      ctx.font = `bold ${Math.floor(s * 0.62)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(txt, s / 2, s / 2 + s * 0.02);
    }
  };

  const download = async () => {
    setBusy(true);
    try {
      const { zipSync } = await import('fflate');
      const files: Record<string, Uint8Array> = {};
      for (const size of SIZES) {
        const blob = await drawFavicon(size, bg, renderContent);
        files[`favicon-${size}x${size}.png`] = new Uint8Array(await blob.arrayBuffer());
      }
      const zipped = zipSync(files, { level: 0 });
      const url = URL.createObjectURL(new Blob([zipped], { type: 'application/zip' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'favicons.zip';
      a.click();
    } finally {
      setBusy(false);
    }
  };

  const htmlCode = SIZES.map((s) =>
    s >= 180
      ? `  <link rel="apple-touch-icon" sizes="${s}x${s}" href="/favicon-${s}x${s}.png">`
      : `  <link rel="icon" type="image/png" sizes="${s}x${s}" href="/favicon-${s}x${s}.png">`,
  ).join('\n');

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {(['text', 'image'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-lg px-4 py-1.5 text-sm ${
              mode === m ? 'bg-brand text-white' : 'border border-brand/20 text-brand'
            }`}
          >
            {m === 'text' ? t('tools.favicon-generator.ui.textMode', 'Text / Emoji') : t('tools.favicon-generator.ui.imageMode', 'Upload image')}
          </button>
        ))}
      </div>

      {mode === 'text' ? (
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-sm text-slate-500">
              {t('tools.favicon-generator.ui.content', 'Letter, initials or emoji')}
            </label>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={2}
              className="input"
              placeholder="A"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-500">
              {t('tools.favicon-generator.ui.background', 'Background')}
            </label>
            <input
              type="color"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="h-10 w-16 rounded border border-brand/20"
            />
          </div>
        </div>
      ) : (
        <label className="block cursor-pointer rounded-lg border border-dashed border-brand/30 px-4 py-6 text-center text-sm text-brand hover:bg-brand/5">
          {t('tools.favicon-generator.ui.chooseImage', 'Choose an image')}
          <input type="file" accept="image/*" className="hidden" onChange={onImg} />
        </label>
      )}

      {imgSrc && <img ref={imgRef} src={imgSrc} alt="src" className="hidden" />}

      <button
        onClick={download}
        disabled={busy}
        className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-50"
      >
        {busy ? t('tools.favicon-generator.ui.processing', 'Processing…') : t('tools.favicon-generator.ui.downloadZip', 'Download ZIP')}
      </button>

      <div className="rounded-xl border border-brand/15 bg-slate-50 p-4 dark:bg-slate-900">
        <p className="mb-2 text-sm font-semibold">{t('tools.favicon-generator.ui.htmlTags', 'HTML link tags')}</p>
        <pre className="overflow-x-auto text-xs">{htmlCode}</pre>
      </div>
    </div>
  );
}

function pickTextColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? '#111827' : '#ffffff';
}
