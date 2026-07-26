'use client';

import { useState, type ChangeEvent } from 'react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { useI18n } from '@/i18n';

export default function PdfWatermarkClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('DRAFT');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
    setDone(false); setError(null);
  };

  async function run() {
    if (!file) return;
    setBusy(true); setError(null);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      for (const page of pages) {
        const { width, height } = page.getSize();
        // tile the watermark across the page
        for (let y = 80; y < height; y += 160) {
          for (let x = 40; x < width; x += 260) {
            page.drawText(text || 'DRAFT', {
              x, y,
              size: 40,
              font,
              color: rgb(0.6, 0.6, 0.6),
              opacity: 0.18,
              rotate: degrees(-30),
            });
          }
        }
      }
      const out = await pdf.save();
      const blob = new Blob([out as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'watermarked.pdf'; a.click();
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to watermark PDF.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <input type="file" accept="application/pdf" onChange={onPick} className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-white" />
      <div>
        <label className="mb-1 block text-sm text-slate-600">Watermark text</label>
        <input value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      </div>
      <button onClick={run} disabled={!file || busy} className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
        {busy ? 'Adding watermark…' : t('pdf.wm.run', 'Add watermark')}
      </button>
      {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
      {done && <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Downloaded watermarked.pdf</div>}
    </div>
  );
}
