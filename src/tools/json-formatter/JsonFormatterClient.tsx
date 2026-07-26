'use client';

import { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';
import { useI18n } from '@/i18n';

export default function JsonFormatterClient() {
  const { t } = useI18n();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const format = (minify: boolean) => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2));
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const copy = async () => {
    if (output) await copyToClipboard(output);
  };

  return (
    <div className="space-y-3">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t('tools.json-formatter.ui.placeholder', 'Paste JSON here…')}
        className="h-48 w-full resize-y rounded-lg border border-slate-200 p-3 font-mono text-sm text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
      />
      <div className="flex flex-wrap gap-2">
        <button onClick={() => format(false)} className="rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark">{t('tools.json-formatter.ui.format', 'Format')}</button>
        <button onClick={() => format(true)} className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-700 hover:border-brand/30 hover:text-brand">{t('tools.json-formatter.ui.minify', 'Minify')}</button>
        <button onClick={copy} disabled={!output} className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-700 hover:border-brand/30 hover:text-brand disabled:opacity-50">{t('common.copy', 'Copy')}</button>
      </div>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">{t('tools.json-formatter.ui.invalid', 'Invalid JSON')}: {error}</div>
      )}
      {output && (
        <textarea
          readOnly
          value={output}
          className="h-48 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm text-slate-700"
        />
      )}
    </div>
  );
}
