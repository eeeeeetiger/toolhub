'use client';

import { useState } from 'react';
import { zipSync } from 'fflate';
import { useI18n } from '@/i18n';

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const ZOOMS: { label: string; value: number }[] = [
  { label: '1x (72 dpi)', value: 1 },
  { label: '1.5x', value: 1.5 },
  { label: '2x', value: 2 },
  { label: '3x (sharp)', value: 3 },
];

export default function PdfToImageClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [zoom, setZoom] = useState(2);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [count, setCount] = useState(0);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError('');
    setCount(0);
    try {
      const pdfjsLib: any = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;

      const files: Record<string, Uint8Array> = {};
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: zoom });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), 'image/png'));
        files[`page-${i}.png`] = new Uint8Array(await blob.arrayBuffer());
        setCount(i);
      }
      await pdf.destroy();

      const zipped = zipSync(files, { level: 0 });
      downloadBlob(new Blob([zipped as BlobPart], { type: 'application/zip' }), 'pdf-images.zip');
    } catch (e: any) {
      setError(e?.message || t('tools.pdf-to-image.ui.renderFailed', 'Failed to render PDF'));
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
          setCount(0);
        }}
        className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-white hover:file:bg-brand-dark"
      />

      {file && (
        <>
          <div className="text-sm">
            <label className="mr-2 text-slate-500">{t('tools.pdf-to-image.ui.zoom', 'Zoom')}</label>
            <select
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-brand focus:outline-none"
            >
              {ZOOMS.map((z) => (
                <option key={z.value} value={z.value}>
                  {z.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={run}
            disabled={busy}
            className="rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {busy ? t('tools.pdf-to-image.ui.rendering', `Rendering… (${count})`) : t('tools.pdf-to-image.ui.render', 'Render to images')}
          </button>

          {count > 0 && !busy && <p className="text-sm text-green-600">{t('tools.pdf-to-image.ui.done', 'Done — downloaded pdf-images.zip')}</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </>
      )}
    </div>
  );
}
