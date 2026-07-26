'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/i18n';

type ECLevel = 'L' | 'M' | 'Q' | 'H';

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function QrCodeGeneratorClient() {
  const { t } = useI18n();
  const [text, setText] = useState('https://');
  const [ec, setEc] = useState<ECLevel>('M');
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const [scale, setScale] = useState(8);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [matrix, setMatrix] = useState<boolean[][] | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!text.trim()) {
      setMatrix(null);
      setError('');
      return;
    }
    (async () => {
      try {
        // 动态加载成熟、经过验证的 qrcode 库（纯算法、跨平台）。
        // 不顶层 import，避免预渲染期求值（遵守项目约定）。
        const mod: any = await import('qrcode');
        const QRCode = mod.default ?? mod;
        const qr = QRCode.create(text, { errorCorrectionLevel: ec });
        const size = qr.modules.size;
        const m: boolean[][] = [];
        for (let r = 0; r < size; r++) {
          const row: boolean[] = [];
          for (let c = 0; c < size; c++) row.push(!!qr.modules.data[r * size + c]);
          m.push(row);
        }
        if (!cancelled) {
          setMatrix(m);
          setError('');
        }
      } catch (e) {
        if (!cancelled) {
          setMatrix(null);
          setError((e as Error).message || t('tools.qr-code-generator.ui.errorFallback', 'Failed to generate QR code'));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [text, ec]);

  const quiet = 4; // quiet zone modules

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !matrix) return;
    const size = matrix.length;
    const px = scale;
    const dim = (size + quiet * 2) * px;
    canvas.width = dim;
    canvas.height = dim;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, dim, dim);
    ctx.fillStyle = fg;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (matrix[r][c]) {
          ctx.fillRect((c + quiet) * px, (r + quiet) * px, px, px);
        }
      }
    }
  }, [matrix, scale, fg, bg]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => { if (blob) downloadBlob(blob, 'qrcode.png'); }, 'image/png');
  };

  const downloadSvg = () => {
    if (!matrix) return;
    const size = matrix.length;
    const total = size + quiet * 2;
    let rects = '';
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (matrix[r][c]) rects += `<rect x="${c + quiet}" y="${r + quiet}" width="1" height="1"/>`;
      }
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" shape-rendering="crispEdges"><rect width="${total}" height="${total}" fill="${bg}"/><g fill="${fg}">${rects}</g></svg>`;
    downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), 'qrcode.svg');
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              {t('tools.qr-code-generator.ui.content', 'Text or URL')}
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('tools.qr-code-generator.ui.placeholder', 'Enter a link, text, Wi-Fi info…')}
              className="h-28 w-full resize-y rounded-lg border border-slate-200 p-3 text-sm text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                {t('tools.qr-code-generator.ui.ecLevel', 'Error correction')}
              </label>
              <select
                value={ec}
                onChange={(e) => setEc(e.target.value as ECLevel)}
                className="w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-700 outline-none focus:border-brand"
              >
                <option value="L">L — {t('tools.qr-code-generator.ui.ecLow', 'Low')} (7%)</option>
                <option value="M">M — {t('tools.qr-code-generator.ui.ecMedium', 'Medium')} (15%)</option>
                <option value="Q">Q — {t('tools.qr-code-generator.ui.ecQuartile', 'Quartile')} (25%)</option>
                <option value="H">H — {t('tools.qr-code-generator.ui.ecHigh', 'High')} (30%)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                {t('tools.qr-code-generator.ui.size', 'Size')}: {scale}×
              </label>
              <input
                type="range" min={4} max={16} value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="mt-2 w-full accent-brand"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                {t('tools.qr-code-generator.ui.fg', 'Foreground')}
              </label>
              <input type="color" value={fg} onChange={(e) => setFg(e.target.value)}
                className="h-10 w-full cursor-pointer rounded-lg border border-slate-200" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                {t('tools.qr-code-generator.ui.bg', 'Background')}
              </label>
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)}
                className="h-10 w-full cursor-pointer rounded-lg border border-slate-200" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          {error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : matrix ? (
            <>
              <canvas ref={canvasRef} className="max-w-full rounded bg-white" style={{ imageRendering: 'pixelated', maxHeight: 320, width: 'auto' }} />
              <div className="flex gap-2">
                <button onClick={downloadPng}
                  className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
                  {t('tools.qr-code-generator.ui.downloadPng', 'Download PNG')}
                </button>
                <button onClick={downloadSvg}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand">
                  {t('tools.qr-code-generator.ui.downloadSvg', 'Download SVG')}
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-400">{t('tools.qr-code-generator.ui.empty', 'Enter text to generate a QR code')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
