'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { useI18n } from '@/i18n';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

type Pos = 'bottom-center' | 'bottom-left' | 'bottom-right' | 'top-center';

const POSITIONS: { value: Pos; label: string }[] = [
  { value: 'bottom-center', label: 'Bottom center' },
  { value: 'bottom-left', label: 'Bottom left' },
  { value: 'bottom-right', label: 'Bottom right' },
  { value: 'top-center', label: 'Top center' },
];

export default function PdfPageNumbersClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [pos, setPos] = useState<Pos>('bottom-center');
  const [start, setStart] = useState(1);
  const [size, setSize] = useState(12);
  const [color, setColor] = useState('#000000');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setDone(null);
    }
  };

  const hexToRgb = (h: string) => {
    const n = parseInt(h.slice(1), 16);
    return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const c = hexToRgb(color);
      const pages = doc.getPages();
      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const num = String(start + i);
        const tw = font.widthOfTextAtSize(num, size);
        let x = width / 2 - tw / 2;
        let y = 24;
        if (pos === 'bottom-left') x = 24;
        else if (pos === 'bottom-right') x = width - tw - 24;
        else if (pos === 'top-center') {
          x = width / 2 - tw / 2;
          y = height - 24 - size;
        }
        page.drawText(num, { x, y, size, font, color: c });
      });
      const out = await doc.save();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = URL.createObjectURL(new Blob([out as BlobPart], { type: 'application/pdf' }));
      setDone(urlRef.current);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block cursor-pointer rounded-lg border border-dashed border-brand/30 px-4 py-6 text-center text-sm text-brand hover:bg-brand/5">
        {t('tools.pdf-page-numbers.ui.upload', 'Choose a PDF')}
        <input type="file" accept="application/pdf" className="hidden" onChange={onFile} />
      </label>
      {file && (
        <>
          <p className="text-sm text-slate-500">{file.name}</p>
          <div>
            <label className="mb-1 block text-sm text-slate-500">{t('tools.pdf-page-numbers.ui.position', 'Position')}</label>
            <select value={pos} onChange={(e) => setPos(e.target.value as Pos)} className="input">
              {POSITIONS.map((p) => (
                <option key={p.value} value={p.value}>{t(`tools.pdf-page-numbers.ui.pos.${p.value}`, p.label)}</option>
              ))}
            </select>
          </div>
          <Slider label={`${t('tools.pdf-page-numbers.ui.start', 'Start number')}: ${start}`} value={start} min={0} max={100} onChange={setStart} />
          <Slider label={`${t('tools.pdf-page-numbers.ui.size', 'Font size')}: ${size}`} value={size} min={8} max={36} onChange={setSize} />
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{t('tools.pdf-page-numbers.ui.color', 'Color')}</span>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-16 rounded border border-brand/20" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={run} disabled={busy} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-50">
              {busy ? t('common.processing', 'Processing…') : t('tools.pdf-page-numbers.ui.run', 'Add page numbers')}
            </button>
            {done && (
              <a href={done} download={file.name.replace(/\.pdf$/i, '') + '-numbered.pdf'} className="rounded-lg border border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-brand/5 inline-block">
                {t('tools.pdf-page-numbers.ui.download', 'Download PDF')}
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-slate-500">{label}</label>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
    </div>
  );
}
