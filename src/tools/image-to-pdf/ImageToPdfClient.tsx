'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { useI18n } from '@/i18n';

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

interface ImgEntry {
  id: number;
  file: File;
  name: string;
}

export default function ImageToPdfClient() {
  const { t } = useI18n();
  const [imgs, setImgs] = useState<ImgEntry[]>([]);
  const [size, setSize] = useState<'original' | 'a4'>('original');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function add(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files || []).filter((f) => /image\/(png|jpeg)/.test(f.type));
    if (!picked.length) {
      setError(t('tools.image-to-pdf.ui.errorFormat', 'Only JPG and PNG images are supported'));
      return;
    }
    setError('');
    setImgs((prev) => [
      ...prev,
      ...picked.map((f, i) => ({ id: Date.now() + prev.length + i, file: f, name: f.name })),
    ]);
  }

  function remove(id: number) {
    setImgs((prev) => prev.filter((x) => x.id !== id));
  }
  function move(id: number, dir: -1 | 1) {
    setImgs((prev) => {
      const i = prev.findIndex((x) => x.id === id);
      const next = [...prev];
      const j = i + dir;
      if (i < 0 || j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  async function run() {
    if (imgs.length === 0) return;
    setBusy(true);
    setError('');
    try {
      const out = await PDFDocument.create();
      for (const entry of imgs) {
        const bytes = await entry.file.arrayBuffer();
        const embedded =
          entry.file.type === 'image/png' ? await out.embedPng(bytes) : await out.embedJpg(bytes);
        const iw = embedded.width;
        const ih = embedded.height;

        let pw: number;
        let ph: number;
        let dw: number;
        let dh: number;
        let x = 0;
        let y = 0;

        if (size === 'original') {
          const scale = Math.min(1, 1440 / Math.max(iw, ih));
          pw = iw * scale;
          ph = ih * scale;
          dw = pw;
          dh = ph;
        } else {
          const A4w = 595.28;
          const A4h = 841.89;
          const landscape = iw > ih;
          const W = landscape ? A4h : A4w;
          const H = landscape ? A4w : A4h;
          const s = Math.min(W / iw, H / ih);
          pw = W;
          ph = H;
          dw = iw * s;
          dh = ih * s;
          x = (W - dw) / 2;
          y = (H - dh) / 2;
        }

        const page = out.addPage([pw, ph]);
        page.drawImage(embedded, { x, y, width: dw, height: dh });
      }
      const data = await out.save();
      downloadBlob(new Blob([data as BlobPart], { type: 'application/pdf' }), 'images.pdf');
    } catch (e: any) {
      setError(e?.message || t('tools.image-to-pdf.ui.buildFailed', 'Failed to build PDF'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/png,image/jpeg"
        multiple
        onChange={add}
        className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-white hover:file:bg-brand-dark"
      />

      {imgs.length > 0 && (
        <>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-500">{t('tools.image-to-pdf.ui.pageSize', 'Page size')}</span>
            <label className="flex items-center gap-2">
              <input type="radio" checked={size === 'original'} onChange={() => setSize('original')} />
              {t('tools.image-to-pdf.ui.original', 'Original')}
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={size === 'a4'} onChange={() => setSize('a4')} />
              {t('tools.image-to-pdf.ui.fitA4', 'Fit A4')}
            </label>
          </div>

          <ul className="space-y-2">
            {imgs.map((img, i) => (
              <li key={img.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <span className="truncate text-slate-700">
                  {i + 1}. {img.name}
                </span>
                <span className="flex items-center gap-1">
                  <button onClick={() => move(img.id, -1)} className="rounded px-2 text-slate-400 hover:text-slate-700">↑</button>
                  <button onClick={() => move(img.id, 1)} className="rounded px-2 text-slate-400 hover:text-slate-700">↓</button>
                  <button onClick={() => remove(img.id)} className="rounded px-2 text-red-400 hover:text-red-600">✕</button>
                </span>
              </li>
            ))}
          </ul>

          <button
            onClick={run}
            disabled={busy}
            className="rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {busy ? t('tools.image-to-pdf.ui.building', 'Building…') : t('tools.image-to-pdf.ui.create', 'Create PDF')}
          </button>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </>
      )}
    </div>
  );
}
