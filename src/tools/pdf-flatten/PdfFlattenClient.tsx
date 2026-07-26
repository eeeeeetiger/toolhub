'use client';

import { useState, type ChangeEvent } from 'react';
import { PDFDocument } from 'pdf-lib';
import { useI18n } from '@/i18n';

export default function PdfFlattenClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
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
      try {
        const form = pdf.getForm();
        form.flatten();
      } catch {
        // no form fields — nothing to flatten
      }
      const out = await pdf.save();
      const blob = new Blob([out as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'flattened.pdf'; a.click();
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to flatten PDF.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <input type="file" accept="application/pdf" onChange={onPick} className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-white" />
      <button onClick={run} disabled={!file || busy} className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
        {busy ? 'Flattening…' : t('pdf.flatten.run', 'Flatten PDF')}
      </button>
      {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
      {done && <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Downloaded flattened.pdf</div>}
    </div>
  );
}
