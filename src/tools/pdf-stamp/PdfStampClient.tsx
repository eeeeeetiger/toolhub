'use client';

import { useState, type ChangeEvent } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { useI18n } from '@/i18n';

type Pos = 'tl' | 'tr' | 'bl' | 'br';

export default function PdfStampClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [stampImg, setStampImg] = useState<File | null>(null);
  const [text, setText] = useState('APPROVED');
  const [pos, setPos] = useState<Pos>('br');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
    setDone(false); setError(null);
  };
  const onStamp = (e: ChangeEvent<HTMLInputElement>) => {
    setStampImg(e.target.files?.[0] ?? null);
    setDone(false);
  };

  async function run() {
    if (!file) return;
    setBusy(true); setError(null);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = pdf.getPages();
      let embedded: Awaited<ReturnType<typeof pdf.embedPng>> | null = null;
      if (stampImg) {
        const sb = await stampImg.arrayBuffer();
        embedded = stampImg.type === 'image/png' ? await pdf.embedPng(sb) : await pdf.embedJpg(sb);
      }
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const stampW = embedded ? Math.min(120, embedded.width) : 0;
      const stampH = embedded ? (stampW / embedded.width) * embedded.height : 0;
      for (const page of pages) {
        const { width, height } = page.getSize();
        const m = 24;
        const x = pos === 'tl' || pos === 'bl' ? m : width - m - stampW;
        const y = pos === 'tl' || pos === 'tr' ? height - m - Math.max(stampH, 20) : m;
        if (embedded) {
          page.drawImage(embedded, { x, y, width: stampW, height: stampH });
        } else {
          page.drawText(text || 'STAMP', { x: x === m ? m : width - m - 100, y: y + 4, size: 16, font, color: rgb(0.8, 0.1, 0.1) });
        }
      }
      const out = await pdf.save();
      const blob = new Blob([out as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'stamped.pdf'; a.click();
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stamp PDF.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <input type="file" accept="application/pdf" onChange={onPick} className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-white" />
      <div>
        <label className="mb-1 block text-sm text-slate-600">Stamp image (optional PNG/JPG)</label>
        <input type="file" accept="image/png,image/jpeg" onChange={onStamp} className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="mb-1 block text-sm text-slate-600">Or text stamp</label><input value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" /></div>
        <div><label className="mb-1 block text-sm text-slate-600">Position</label><select value={pos} onChange={(e) => setPos(e.target.value as Pos)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="tl">Top-left</option><option value="tr">Top-right</option><option value="bl">Bottom-left</option><option value="br">Bottom-right</option>
        </select></div>
      </div>
      <button onClick={run} disabled={!file || busy} className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
        {busy ? 'Stamping…' : t('pdf.stamp.run', 'Add stamp')}
      </button>
      {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
      {done && <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Downloaded stamped.pdf</div>}
    </div>
  );
}
