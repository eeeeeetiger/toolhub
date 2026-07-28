'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { useI18n } from '@/i18n';

export default function PdfMergeClient() {
  const { t } = useI18n();
  const [files, setFiles] = useState<File[]>([]);
  const [merging, setMerging] = useState(false);
  const [done, setDone] = useState(false);

  const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...picked]);
    setDone(false);
  };

  const remove = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) =>
    setFiles((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const merge = async () => {
    if (files.length < 2) return;
    setMerging(true);
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const out = await merged.save();
      const blob = new Blob([out as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      a.click();
      setDone(true);
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className="space-y-4">
      <input type="file" accept="application/pdf" multiple onChange={addFiles} className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-white hover:file:bg-brand-dark" />

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <span className="truncate text-slate-700">{i + 1}. {f.name}</span>
              <span className="flex items-center gap-1">
                <button onClick={() => move(i, -1)} className="rounded px-2 text-slate-400 hover:text-slate-700">↑</button>
                <button onClick={() => move(i, 1)} className="rounded px-2 text-slate-400 hover:text-slate-700">↓</button>
                <button onClick={() => remove(i)} className="rounded px-2 text-red-400 hover:text-red-600">✕</button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={merge}
        disabled={files.length < 2 || merging}
        className="rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {merging ? t('tools.pdf-merge.ui.merging', 'Merging…') : done ? t('tools.pdf-merge.ui.done', 'Downloaded! Merge again') : t('tools.pdf-merge.ui.mergeN', `Merge {n} PDFs`, { n: files.length })}
      </button>
    </div>
  );
}
