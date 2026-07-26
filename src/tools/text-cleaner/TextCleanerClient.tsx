'use client';

import { useMemo, useState } from 'react';
import { useI18n } from '@/i18n';

export default function TextCleanerClient() {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [trimLines, setTrimLines] = useState(true);
  const [collapseBlank, setCollapseBlank] = useState(true);
  const [normalizeQuotes, setNormalizeQuotes] = useState(true);
  const [normalizeDashes, setNormalizeDashes] = useState(true);
  const [singleParagraph, setSingleParagraph] = useState(false);

  const cleaned = useMemo(() => {
    let out = text;
    if (trimLines) out = out.split('\n').map((l) => l.replace(/^\s+|\s+$/g, '')).join('\n');
    if (collapseBlank) out = out.replace(/\n{3,}/g, '\n\n');
    if (normalizeQuotes) out = out.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
    if (normalizeDashes) out = out.replace(/[—–]/g, '-');
    if (singleParagraph) out = out.replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ');
    return out;
  }, [text, trimLines, collapseBlank, normalizeQuotes, normalizeDashes, singleParagraph]);

  const copy = () => {
    if (cleaned) navigator.clipboard?.writeText(cleaned);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Toggle label={t('tools.text-cleaner.ui.trim', 'Trim line spaces')} checked={trimLines} onChange={setTrimLines} />
        <Toggle label={t('tools.text-cleaner.ui.blank', 'Collapse blank lines')} checked={collapseBlank} onChange={setCollapseBlank} />
        <Toggle label={t('tools.text-cleaner.ui.quotes', 'ASCII quotes')} checked={normalizeQuotes} onChange={setNormalizeQuotes} />
        <Toggle label={t('tools.text-cleaner.ui.dashes', 'ASCII dashes')} checked={normalizeDashes} onChange={setNormalizeDashes} />
        <Toggle label={t('tools.text-cleaner.ui.single', 'Single paragraph')} checked={singleParagraph} onChange={setSingleParagraph} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1 text-xs font-medium text-slate-500">{t('tools.text-cleaner.ui.input', 'Input')}</div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('tools.text-cleaner.ui.placeholder', 'Paste messy text…')}
            className="h-56 w-full resize-y rounded-lg border border-slate-200 p-3 text-sm text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">{t('tools.text-cleaner.ui.output', 'Output')}</span>
            <button
              type="button"
              onClick={copy}
              className="rounded-md border border-slate-200 px-2 py-0.5 text-xs text-slate-600 transition-colors hover:border-brand/40 hover:text-brand"
            >
              {t('tools.text-cleaner.ui.copy', 'Copy')}
            </button>
          </div>
          <textarea
            value={cleaned}
            readOnly
            className="h-56 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
        checked ? 'border-brand bg-brand/[0.06] text-brand' : 'border-slate-200 text-slate-600 hover:border-brand/30'
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${checked ? 'bg-brand' : 'bg-slate-300'}`} />
      {label}
    </button>
  );
}
