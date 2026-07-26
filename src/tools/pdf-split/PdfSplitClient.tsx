'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
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

export default function PdfSplitClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'every' | 'ranges'>('every');
  const [ranges, setRanges] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [count, setCount] = useState(0);

  function parseRanges(raw: string, total: number): number[][] {
    const groups: number[][] = [];
    const parts = raw.split(',').map((s) => s.trim()).filter(Boolean);
    for (const part of parts) {
      if (part.includes('-')) {
        const [a, b] = part.split('-').map((n) => parseInt(n, 10));
        if (!a || !b || a < 1 || b > total || a > b) throw new Error(t('tools.pdf-split.ui.invalidRange', `Invalid range "${part}"`));
        const g: number[] = [];
        for (let i = a; i <= b; i++) g.push(i);
        groups.push(g);
      } else {
        const n = parseInt(part, 10);
        if (!n || n < 1 || n > total) throw new Error(t('tools.pdf-split.ui.invalidPage', `Invalid page "${part}"`));
        groups.push([n]);
      }
    }
    if (!groups.length) throw new Error(t('tools.pdf-split.ui.enterRange', 'Please enter at least one page or range'));
    return groups;
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setError('');
    setCount(0);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const total = doc.getPageCount();
      const groups =
        mode === 'every'
          ? Array.from({ length: total }, (_, i) => [i + 1])
          : parseRanges(ranges, total);

      const files: Record<string, Uint8Array> = {};
      for (const g of groups) {
        const out = await PDFDocument.create();
        const copied = await out.copyPages(doc, g.map((p) => p - 1));
        copied.forEach((p) => out.addPage(p));
        const data = await out.save();
        const label = g.length === 1 ? `page-${g[0]}` : `pages-${g[0]}-${g[g.length - 1]}`;
        files[`${label}.pdf`] = data;
        setCount((c) => c + 1);
      }
      const zipped = zipSync(files, { level: 0 });
      downloadBlob(new Blob([zipped as BlobPart], { type: 'application/zip' }), 'split-pages.zip');
    } catch (e: any) {
      setError(e?.message || t('tools.pdf-split.ui.splitFailed', 'Failed to split PDF'));
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
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" checked={mode === 'every'} onChange={() => setMode('every')} />
              {t('tools.pdf-split.ui.everyPage', 'Split every page')}
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={mode === 'ranges'} onChange={() => setMode('ranges')} />
              {t('tools.pdf-split.ui.byRanges', 'By page ranges')}
            </label>
          </div>

          {mode === 'ranges' && (
            <input
              type="text"
              value={ranges}
              onChange={(e) => setRanges(e.target.value)}
              placeholder={t('tools.pdf-split.ui.rangesPlaceholder', 'e.g. 1-3, 5, 8-10')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
          )}

          <button
            onClick={run}
            disabled={busy || (mode === 'ranges' && !ranges.trim())}
            className="rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {busy ? t('tools.pdf-split.ui.splitting', `Splitting… (${count})`) : t('tools.pdf-split.ui.split', 'Split PDF')}
          </button>

          {count > 0 && !busy && <p className="text-sm text-green-600">{t('tools.pdf-split.ui.done', 'Done — downloaded split-pages.zip')}</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </>
      )}
    </div>
  );
}
