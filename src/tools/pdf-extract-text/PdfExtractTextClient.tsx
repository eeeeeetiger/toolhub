'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function PdfExtractTextClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [empty, setEmpty] = useState(false);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError('');
    setText('');
    setEmpty(false);
    try {
      const pdfjsLib: any = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;

      let out = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const line = (content.items as any[]).map((it) => it.str ?? '').join(' ');
        out += line + '\n\n';
      }
      await pdf.destroy();

      const trimmed = out.trim();
      setText(trimmed);
      if (!trimmed) setEmpty(true);
    } catch (e: any) {
      setError(e?.message || t('tools.pdf-extract-text.ui.extractFailed', 'Failed to extract text'));
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!text) return;
    downloadBlob(new Blob([text], { type: 'text/plain' }), 'extracted-text.txt');
  }
  async function copy() {
    if (!text) return;
    await navigator.clipboard.writeText(text);
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          setFile(e.target.files?.[0] ?? null);
          setError('');
          setText('');
          setEmpty(false);
        }}
        className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-white hover:file:bg-brand-dark"
      />

      {file && (
        <>
          <button
            onClick={run}
            disabled={busy}
            className="rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {busy ? t('tools.pdf-extract-text.ui.extracting', 'Extracting…') : t('tools.pdf-extract-text.ui.extract', 'Extract text')}
          </button>

          {empty && !busy && (
            <p className="text-sm text-amber-600">
              {t('tools.pdf-extract-text.ui.noText', 'No text found. This PDF may be a scanned image without a text layer (OCR is out of scope for this tool).')}
            </p>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {text && (
            <>
              <div className="flex gap-2">
                <button
                  onClick={copy}
                  className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {t('common.copy', 'Copy')}
                </button>
                <button
                  onClick={download}
                  className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {t('tools.pdf-extract-text.ui.downloadTxt', 'Download .txt')}
                </button>
              </div>
              <textarea
                readOnly
                value={text}
                className="h-64 w-full rounded-lg border border-slate-200 p-3 text-sm text-slate-700 focus:outline-none"
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
