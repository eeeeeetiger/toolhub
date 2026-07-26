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

export default function PdfExtractPagesClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<boolean[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setError('');
    setSelected([]);
    setTotal(0);
    if (!f) return;
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer());
      const n = doc.getPageCount();
      setTotal(n);
      setSelected(Array(n).fill(true));
    } catch (err: any) {
      setError(err?.message || t('tools.pdf-extract-pages.ui.readFailed', 'Could not read PDF'));
    }
  }

  function toggle(i: number) {
    setSelected((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  async function extract() {
    if (!file) return;
    const pages = selected.map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
    if (!pages.length) {
      setError(t('tools.pdf-extract-pages.ui.selectOne', 'Select at least one page'));
      return;
    }
    setBusy(true);
    setError('');
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const out = await PDFDocument.create();
      const copied = await out.copyPages(doc, pages);
      copied.forEach((p) => out.addPage(p));
      const data = await out.save();
      downloadBlob(new Blob([data as BlobPart], { type: 'application/pdf' }), 'extracted-pages.pdf');
    } catch (e: any) {
      setError(e?.message || t('tools.pdf-extract-pages.ui.extractFailed', 'Failed to extract pages'));
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
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">
              {total} {t('tools.pdf-extract-pages.ui.pages', 'pages')} · {selected.filter(Boolean).length} {t('tools.pdf-extract-pages.ui.selected', 'selected')}
            </span>
            <div className="flex gap-3">
              <button onClick={() => setSelected(Array(total).fill(true))} className="text-brand hover:underline">
                {t('common.ui.all', 'All')}
              </button>
              <button onClick={() => setSelected(Array(total).fill(false))} className="text-brand hover:underline">
                {t('tools.pdf-extract-pages.ui.none', 'None')}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                onClick={() => toggle(i)}
                className={`h-9 w-9 rounded-lg border text-sm ${
                  selected[i] ? 'border-brand bg-brand text-white' : 'border-slate-200 text-slate-500'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={extract}
            disabled={busy}
            className="rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {busy ? t('tools.pdf-extract-pages.ui.extracting', 'Extracting…') : t('tools.pdf-extract-pages.ui.extract', 'Extract selected pages')}
          </button>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </>
      )}
    </div>
  );
}
