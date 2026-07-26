'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/i18n';
import { csvToJson, jsonToCsv } from './tool-logic';

function CopyBox({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-3 flex gap-2">
      <textarea readOnly value={text} className="h-48 w-full rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-xs text-slate-800" />
      <button onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="self-start rounded-lg bg-brand/10 px-3 py-2 text-xs font-medium text-brand">{copied ? 'Copied' : 'Copy'}</button>
    </div>
  );
}

export default function CsvJsonClient() {
  const { t } = useI18n();
  const pathname = usePathname();
  const slug = (pathname || '').replace(/^\/tools\//, '').replace(/\/$/, '');
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [out, setOut] = useState('');

  async function run() {
    const raw = file ? await file.text() : input;
    if (slug === 'csv-to-json') {
      const res = csvToJson(raw);
      setOut(res ?? 'Need a header row and at least one data row.');
    } else {
      const res = jsonToCsv(raw);
      if (res === null) {
        // 区分两类错误：JSON 语法错误 vs 结构不是对象数组
        try { JSON.parse(raw); setOut('Expected an array of objects.'); } catch { setOut('Invalid JSON.'); }
        return;
      }
      setOut(res);
    }
  }

  if (!['csv-to-json', 'json-to-csv'].includes(slug)) return <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">Tool not found.</div>;

  return (
    <div className="space-y-4">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={slug === 'csv-to-json' ? 'Paste CSV…' : 'Paste JSON array…'} className="h-40 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800" />
      <div><label className="mb-1 block text-sm text-slate-600">…or upload a file</label><input type="file" accept={slug === 'csv-to-json' ? '.csv,text/csv' : '.json,application/json'} onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block w-full text-sm text-slate-500" /></div>
      <button onClick={run} className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">Convert</button>
      {out && <CopyBox text={out} />}
    </div>
  );
}
