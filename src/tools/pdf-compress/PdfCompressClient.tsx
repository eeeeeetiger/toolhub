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

function fmt(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

const PRESETS: Record<'low' | 'medium' | 'high', { scale: number; q: number }> = {
  low: { scale: 1, q: 0.5 },
  medium: { scale: 1.5, q: 0.7 },
  high: { scale: 2, q: 0.85 },
};

export default function PdfCompressClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [before, setBefore] = useState(0);
  const [after, setAfter] = useState(0);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError('');
    setBefore(file.size);
    setAfter(0);
    try {
      const pdfjsLib: any = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;

      const { scale, q } = PRESETS[quality];
      const out = await PDFDocument.create();

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const orig = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), 'image/jpeg', q));
        const jpg = new Uint8Array(await blob.arrayBuffer());
        const img = await out.embedJpg(jpg);
        const p = out.addPage([orig.width, orig.height]);
        p.drawImage(img, { x: 0, y: 0, width: orig.width, height: orig.height });
      }
      await pdf.destroy();

      const data = await out.save();
      setAfter(data.byteLength);
      downloadBlob(new Blob([data as BlobPart], { type: 'application/pdf' }), 'compressed.pdf');
    } catch (e: any) {
      setError(e?.message || t('tools.pdf-compress.ui.compressFailed', 'Failed to compress PDF'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          setFile(e.target.files?.[0] ?? null);
          setError('');
          setBefore(0);
          setAfter(0);
        }}
        className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-white hover:file:bg-brand-dark"
      />

      {file && (
        <>
          <div className="text-sm">
            <label className="mr-2 text-slate-500">{t('tools.pdf-compress.ui.quality', 'Quality')}</label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value as 'low' | 'medium' | 'high')}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-brand focus:outline-none"
            >
              <option value="low">{t('tools.pdf-compress.ui.low', 'Low (smallest)')}</option>
              <option value="medium">{t('tools.pdf-compress.ui.medium', 'Medium (balanced)')}</option>
              <option value="high">{t('tools.pdf-compress.ui.high', 'High (sharpest)')}</option>
            </select>
          </div>

          <button
            onClick={run}
            disabled={busy}
            className="rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {busy ? t('tools.pdf-compress.ui.compressing', 'Compressing…') : t('tools.pdf-compress.ui.compress', 'Compress PDF')}
          </button>

          {before > 0 && after > 0 && !busy && (
            <p className="text-sm text-green-600">
              {fmt(before)} → {fmt(after)} ({t('tools.pdf-compress.ui.saved', 'saved')} {Math.max(0, 100 - Math.round((after / before) * 100))}%)
            </p>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <p className="text-xs text-slate-400">
            {t('tools.pdf-compress.ui.note', 'Note: compression rasterizes pages, so text becomes part of the image and is no longer selectable. Best for scanned or image-heavy PDFs.')}
          </p>
        </>
      )}
    </div>
  );
}
