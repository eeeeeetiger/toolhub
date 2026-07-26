'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';

function b64urlDecode(input: string): string {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/') + pad;
  return decodeURIComponent(escape(atob(b64)));
}

export default function JwtDecoderClient() {
  const { t } = useI18n();
  const [token, setToken] = useState('');
  const [result, setResult] = useState<{ header: object; payload: object } | null>(null);
  const [error, setError] = useState('');

  const decode = () => {
    setError(''); setResult(null);
    const parts = token.trim().split('.');
    if (parts.length < 2) { setError(t('tools.jwt-decoder.ui.errorFormat', 'A JWT has at least header.payload.signature.')); return; }
    try {
      const header = JSON.parse(b64urlDecode(parts[0]));
      const payload = JSON.parse(b64urlDecode(parts[1]));
      setResult({ header, payload });
    } catch {
      setError(t('tools.jwt-decoder.ui.errorDecode', 'Could not decode the token. Check its format.'));
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder={t('tools.jwt-decoder.ui.placeholder', 'Paste a JWT (header.payload.signature)…')}
        className="h-32 w-full resize-y rounded-lg border border-slate-200 p-3 font-mono text-sm text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
      />
      <button onClick={decode} className="rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark">{t('tools.jwt-decoder.ui.decode', 'Decode')}</button>
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>}
      {result && (
        <div className="space-y-3">
          <div>
            <h3 className="mb-1 text-xs font-semibold text-slate-500">{t('tools.jwt-decoder.ui.header', 'HEADER')}</h3>
            <pre className="overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">{JSON.stringify(result.header, null, 2)}</pre>
          </div>
          <div>
            <h3 className="mb-1 text-xs font-semibold text-slate-500">{t('tools.jwt-decoder.ui.payload', 'PAYLOAD')}</h3>
            <pre className="overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">{JSON.stringify(result.payload, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
