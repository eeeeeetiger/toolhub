'use client';

import { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { useI18n } from '@/i18n';

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function PdfReorganizeClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [total, setTotal] = useState(0);
  const [order, setOrder] = useState<number[]>([]); // original 0-based indices, in desired order
  const [rotation, setRotation] = useState<number[]>([]); // per original index, degrees
  const [deleted, setDeleted] = useState<boolean[]>([]); // per original index
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setError('');
    setTotal(0);
    setOrder([]);
    setRotation([]);
    setDeleted([]);
    if (!f) return;
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer());
      const n = doc.getPageCount();
      setTotal(n);
      setOrder(Array.from({ length: n }, (_, i) => i));
      setRotation(Array(n).fill(0));
      setDeleted(Array(n).fill(false));
    } catch (err: any) {
      setError(err?.message || t('tools.pdf-reorganize.ui.readFailed', 'Could not read PDF'));
    }
  }

  function move(pos: number, dir: -1 | 1) {
    setOrder((prev) => {
      const next = [...prev];
      const j = pos + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[pos], next[j]] = [next[j], next[pos]];
      return next;
    });
  }
  function rotate(origIdx: number) {
    setRotation((prev) => prev.map((r, idx) => (idx === origIdx ? (r + 90) % 360 : r)));
  }
  function toggleDelete(origIdx: number) {
    setDeleted((prev) => prev.map((d, idx) => (idx === origIdx ? !d : d)));
  }

  async function apply() {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const out = await PDFDocument.create();
      for (const origIdx of order) {
        if (deleted[origIdx]) continue;
        const [copied] = await out.copyPages(doc, [origIdx]);
        copied.setRotation(degrees(rotation[origIdx]));
        out.addPage(copied);
      }
      const data = await out.save();
      downloadBlob(new Blob([data as BlobPart], { type: 'application/pdf' }), 'reorganized.pdf');
    } catch (e: any) {
      setError(e?.message || t('tools.pdf-reorganize.ui.applyFailed', 'Failed to reorganize PDF'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={onFile}
        className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-white hover:file:bg-brand-dark"
      />

      {file && total > 0 && (
        <>
          <p className="text-sm text-slate-500">
            {order.length} {t('tools.pdf-reorganize.ui.pages', 'pages')} · {deleted.filter(Boolean).length} {t('tools.pdf-reorganize.ui.markedDelete', 'marked for deletion')}
          </p>

          <ul className="space-y-2">
            {order.map((origIdx, pos) => (
              <li
                key={origIdx}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                  deleted[origIdx] ? 'border-red-200 bg-red-50 opacity-60' : 'border-slate-200'
                }`}
              >
                <span className="text-slate-700">
                  {t('tools.pdf-reorganize.ui.page', 'Page')} {origIdx + 1}
                  {rotation[origIdx] ? ` · ${t('tools.pdf-reorganize.ui.rotated', 'rotated')} ${rotation[origIdx]}°` : ''}
                  {deleted[origIdx] ? ` · ${t('tools.pdf-reorganize.ui.deleted', 'deleted')}` : ''}
                </span>
                <span className="flex items-center gap-1">
                  <button onClick={() => move(pos, -1)} className="rounded px-2 text-slate-400 hover:text-slate-700">↑</button>
                  <button onClick={() => move(pos, 1)} className="rounded px-2 text-slate-400 hover:text-slate-700">↓</button>
                  <button onClick={() => rotate(origIdx)} className="rounded px-2 text-slate-400 hover:text-slate-700" title={t('tools.pdf-reorganize.ui.rotate90', 'Rotate 90°')}>⟳</button>
                  <button
                    onClick={() => toggleDelete(origIdx)}
                    className={`rounded px-2 ${deleted[origIdx] ? 'text-red-600' : 'text-slate-400 hover:text-red-500'}`}
                  >
                    ✕
                  </button>
                </span>
              </li>
            ))}
          </ul>

          <button
            onClick={apply}
            disabled={busy}
            className="rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {busy ? t('tools.pdf-reorganize.ui.applying', 'Applying…') : t('tools.pdf-reorganize.ui.apply', 'Apply & download')}
          </button>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </>
      )}
    </div>
  );
}
