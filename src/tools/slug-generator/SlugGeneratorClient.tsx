'use client';

import { useMemo, useState } from 'react';
import { copyToClipboard } from '@/lib/utils';
import { useI18n } from '@/i18n';
import { makeSlug } from '../_shared/tool-logic';

type Sep = '-' | '_' | '.';

export default function SlugGeneratorClient() {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [sep, setSep] = useState<Sep>('-');
  const [stopwords, setStopwords] = useState(true);
  const [copied, setCopied] = useState(false);

  const slug = useMemo(() => makeSlug(text, sep, stopwords), [text, sep, stopwords]);

  const copy = async () => {
    if (!slug) return;
    const ok = await copyToClipboard(slug);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 1500); }
  };

  return (
    <div className="space-y-4">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('tools.slug-generator.ui.placeholder', 'e.g. How to Build a Fast Website in 2026')}
        className="w-full rounded-lg border border-slate-200 p-3 text-sm text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
      />

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1 rounded-lg bg-slate-50 p-1">
          {(['-', '_', '.'] as Sep[]).map((s) => (
            <button
              key={s}
              onClick={() => setSep(s)}
              className={`rounded-md px-3 py-1.5 text-sm ${
                sep === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              {s === '.' ? t('tools.slug-generator.ui.dot', 'dot') : s === '_' ? t('tools.slug-generator.ui.underscore', 'underscore') : t('tools.slug-generator.ui.hyphen', 'hyphen')}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={stopwords} onChange={(e) => setStopwords(e.target.checked)} />
          {t('tools.slug-generator.ui.removeStopwords', 'Remove stop words')}
        </label>
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
        <code className="flex-1 break-all text-sm text-slate-800">{slug || t('tools.slug-generator.ui.yourSlug', 'your-slug-here')}</code>
        <button
          onClick={copy}
          disabled={!slug}
          className="rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {copied ? t('common.copied', 'Copied!') : t('common.copy', 'Copy')}
        </button>
      </div>
    </div>
  );
}
