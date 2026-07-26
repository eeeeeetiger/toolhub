'use client';

import { useState } from 'react';
import { PDFDocument } from '@cantoo/pdf-lib';
import { useI18n } from '@/i18n';

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function PdfDecryptClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function run() {
    if (!file) return;
    if (!pw) {
      setError(t('tools.pdf-decrypt.ui.pwRequired', 'Enter the open password'));
      return;
    }
    setBusy(true);
    setError('');
    setDone(false);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer(), { password: pw });
      const data = await doc.save(); // saved without encryption → unlocked copy
      downloadBlob(new Blob([data as BlobPart], { type: 'application/pdf' }), 'unlocked.pdf');
      setDone(true);
    } catch (e: any) {
      const msg = e?.message || '';
      if (/password/i.test(msg)) {
        setError(t('tools.pdf-decrypt.ui.badPw', 'Incorrect password, or this PDF is not protected as expected.'));
      } else {
        setError(msg);
      }
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
          setDone(false);
        }}
        className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-white hover:file:bg-brand-dark"
      />

      {file && (
        <>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder={t('tools.pdf-decrypt.ui.openPw', 'Open password')}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />

          <button
            onClick={run}
            disabled={busy || !pw}
            className="rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {busy ? t('tools.pdf-decrypt.ui.unlocking', 'Unlocking…') : t('tools.pdf-decrypt.ui.remove', 'Remove password & download')}
          </button>

          {done && !busy && <p className="text-sm text-green-600">{t('tools.pdf-decrypt.ui.done', 'Done — downloaded unlocked.pdf')}</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </>
      )}
    </div>
  );
}
