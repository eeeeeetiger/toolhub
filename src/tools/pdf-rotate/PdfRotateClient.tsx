'use client';

import { useState, type ChangeEvent } from 'react';
import { useI18n } from '@/i18n';
import { PDFDocument, degrees } from 'pdf-lib';

const ANGLES = [90, 180, 270] as const;

export default function PdfRotateClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [angle, setAngle] = useState<number>(90);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setDone(null);
    }
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      doc.getPages().forEach((p) => {
        const cur = p.getRotation().angle;
        p.setRotation(degrees(((cur + angle) % 360 + 360) % 360));
      });
      const out = await doc.save();
      if (done) URL.revokeObjectURL(done);
      setDone(URL.createObjectURL(new Blob([out as BlobPart], { type: 'application/pdf' })));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block cursor-pointer rounded-lg border border-dashed border-brand/30 px-4 py-6 text-center text-sm text-brand hover:bg-brand/5">
        {t('tools.pdf-rotate.ui.upload', 'Choose a PDF')}
        <input type="file" accept="application/pdf" className="hidden" onChange={onFile} />
      </label>
      {file && (
        <>
          <p className="text-sm text-slate-500">{file.name}</p>
          <div>
            <label className="mb-1 block text-sm text-slate-500">{t('tools.pdf-rotate.ui.angle', 'Rotate by')}</label>
            <div className="flex gap-2">
              {ANGLES.map((a) => (
                <button
                  key={a}
                  onClick={() => setAngle(a)}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm ${angle === a ? 'bg-brand text-white' : 'border border-brand/20 text-brand'}`}
                >
                  {a}°
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={run} disabled={busy} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-50">
              {busy ? t('common.processing', 'Processing…') : t('tools.pdf-rotate.ui.run', 'Rotate pages')}
            </button>
            {done && (
              <a href={done} download={file.name.replace(/\.pdf$/i, '') + '-rotated.pdf'} className="rounded-lg border border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-brand/5 inline-block">
                {t('tools.pdf-rotate.ui.download', 'Download PDF')}
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}
