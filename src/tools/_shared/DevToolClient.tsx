'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/i18n';
import {
  chmodOctalToSymbolic,
  chmodSymbolicToOctal,
  describeCron,
  formatSql,
  isChmodOctal,
  isChmodSymbolic,
  nextRuns,
  signJwt,
} from './tool-logic';

function CopyBox({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-3 flex gap-2">
      <textarea readOnly value={text} className="h-40 w-full rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-xs text-slate-800" />
      <button onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="self-start rounded-lg bg-brand/10 px-3 py-2 text-xs font-medium text-brand">
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

export default function DevToolClient() {
  const { t } = useI18n();
  const pathname = usePathname();
  const slug = (pathname || '').replace(/^\/tools\//, '').replace(/\/$/, '');

  const [cron, setCron] = useState('*/5 * * * *');
  const [chmod, setChmod] = useState('755');
  const [sql, setSql] = useState('SELECT id,name FROM users WHERE active=1 ORDER BY name');
  const [jwtHeader, setJwtHeader] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [jwtPayload, setJwtPayload] = useState('{\n  "sub": "123",\n  "name": "Jane"\n}');
  const [jwtSecret, setJwtSecret] = useState('secret');
  const [out, setOut] = useState('');

  async function run() {
    if (slug === 'cron-parser') {
      const parts = cron.trim().split(/\s+/);
      if (parts.length !== 5) { setOut('Expected 5 fields: m h dom mon dow'); return; }
      setOut(`${describeCron(parts)}\n\nNext runs:\n${nextRuns(parts).join('\n') || '(none in next 5 min)'}`);
    } else if (slug === 'chmod-calculator') {
      const sym = isChmodSymbolic(chmod);
      const oct = isChmodOctal(chmod);
      if (!sym && !oct) { setOut('Enter 3-digit octal (e.g. 755) or rwxrwxrwx'); return; }
      if (oct) {
        const s = chmodOctalToSymbolic(chmod);
        setOut(`${chmod.trim()}  =  ${s}\nowner:${s.slice(0, 3)}  group:${s.slice(3, 6)}  other:${s.slice(6)}`);
      } else {
        const n = chmodSymbolicToOctal(chmod);
        setOut(`${chmod.trim()}  =  ${n}\nowner:${chmod.slice(0, 3)}  group:${chmod.slice(3, 6)}  other:${chmod.slice(6)}`);
      }
    } else if (slug === 'sql-formatter') {
      setOut(formatSql(sql));
    } else if (slug === 'jwt-generator') {
      try {
        const h = JSON.parse(jwtHeader);
        const p = JSON.parse(jwtPayload);
        setOut(await signJwt(h, p, jwtSecret));
      } catch (e) {
        setOut('Invalid JSON or signing failed: ' + (e as Error).message);
      }
    }
  }

  if (!['cron-parser', 'chmod-calculator', 'sql-formatter', 'jwt-generator'].includes(slug)) {
    return <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">Tool not found.</div>;
  }

  const labelCls = 'mb-1 block text-sm text-slate-600';
  const inpCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800';

  return (
    <div className="space-y-4">
      {slug === 'cron-parser' && (
        <div><label className={labelCls}>Cron expression (m h dom mon dow)</label><input className={inpCls} value={cron} onChange={(e) => setCron(e.target.value)} /></div>
      )}
      {slug === 'chmod-calculator' && (
        <div><label className={labelCls}>Mode (e.g. 755 or rwxr-xr-x)</label><input className={inpCls} value={chmod} onChange={(e) => setChmod(e.target.value)} /></div>
      )}
      {slug === 'sql-formatter' && (
        <div><label className={labelCls}>SQL</label><textarea className="h-32 w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-xs text-slate-800" value={sql} onChange={(e) => setSql(e.target.value)} /></div>
      )}
      {slug === 'jwt-generator' && (
        <div className="space-y-3">
          <div><label className={labelCls}>Header (JSON)</label><textarea className="h-24 w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-xs" value={jwtHeader} onChange={(e) => setJwtHeader(e.target.value)} /></div>
          <div><label className={labelCls}>Payload (JSON)</label><textarea className="h-24 w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-xs" value={jwtPayload} onChange={(e) => setJwtPayload(e.target.value)} /></div>
          <div><label className={labelCls}>Secret</label><input className={inpCls} value={jwtSecret} onChange={(e) => setJwtSecret(e.target.value)} /></div>
        </div>
      )}

      <button onClick={run} className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">Run</button>
      {out && <CopyBox text={out} />}
    </div>
  );
}
