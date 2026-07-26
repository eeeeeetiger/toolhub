'use client';

import { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';
import { useI18n } from '@/i18n';

export default function UrlEncoderClient() {
  const { t } = useI18n();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const run = (mode: 'encode' | 'decode') => {
    setError('');
    try {
      setOutput(mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input.trim()));
    } catch {
      setError(t('tools.url-encoder.ui.invalid', 'Invalid URL-encoded input.'));
      setOutput('');
    }
  };

  const copy = async () => { if (output) await copyToClipboard(output); };

  return (
    <div className="space-y-3">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t('tools.url-encoder.ui.placeholder', 'Type or paste text…')}
        className="h-40 w-full resize-y rounded-lg border border-slate-200 p-3 text-sm text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
      />
      <div className="flex flex-wrap gap-2">
        <button onClick={() => run('encode')} className="rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark">{t('tools.url-encoder.ui.encode', 'Encode')}</button>
        <button onClick={() => run('decode')} className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-700 hover:border-brand/30 hover:text-brand">{t('tools.url-encoder.ui.decode', 'Decode')}</button>
        <button onClick={copy} disabled={!output} className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-700 hover:border-brand/30 hover:text-brand disabled:opacity-50">{t('common.copy', 'Copy')}</button>
      </div>
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>}
      {output && (
        <textarea readOnly value={output} className="h-40 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm text-slate-700" />
      )}
    </div>
  );
}
