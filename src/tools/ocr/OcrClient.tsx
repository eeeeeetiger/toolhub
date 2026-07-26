'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useI18n } from '@/i18n';

export default function OcrClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setText('');
    setError(null);
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setPreviewUrl(null);
    if (f) {
      const url = URL.createObjectURL(f);
      urlRef.current = url;
      setPreviewUrl(url);
    }
  };

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setProgress(0);
    try {
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('eng', undefined, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'recognizing text') setProgress(m.progress);
        },
      });
      const { data } = await worker.recognize(file);
      setText(data.text);
      await worker.terminate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OCR failed.');
    } finally {
      setBusy(false);
    }
  }

  const downloadTxt = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ocr-result.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {t('ocr.pick', 'Choose an image with text')}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={onPick}
          className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand"
        />
        {file && <p className="mt-2 text-xs text-slate-500">{file.name}</p>}
      </div>

      {previewUrl && (
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="mb-2 text-sm font-medium text-slate-700">{t('ocr.preview', 'Preview')}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="preview" className="max-h-80 rounded bg-slate-50" />
        </div>
      )}

      <button
        onClick={run}
        disabled={!file || busy}
        className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
      >
        {busy ? `${t('ocr.extract', 'Extract text')}… ${Math.round(progress * 100)}%` : t('ocr.extract', 'Extract text')}
      </button>

      {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      {text && (
        <div className="space-y-2">
          <div className="flex justify-end gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(text)}
              className="rounded-lg bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand"
            >
              {t('ocr.copy', 'Copy')}
            </button>
            <button
              onClick={downloadTxt}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              {t('ocr.downloadTxt', 'Download TXT')}
            </button>
          </div>
          <textarea
            readOnly
            value={text}
            className="h-64 w-full rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-sm text-slate-800"
          />
        </div>
      )}

      {/* 说明：实现方式、限制与替代方案 */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <p className="mb-1 font-semibold">{t('ocr.noteTitle', 'About accuracy')}</p>
        <p className="leading-relaxed">{t('ocr.noteBody', 'This tool runs Tesseract.js OCR locally in your browser.')}</p>
        <p className="mt-2 text-xs text-amber-700">{t('ocr.langNote', 'Current model: English (eng).')}</p>
      </div>
    </div>
  );
}
