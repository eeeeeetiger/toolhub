'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/i18n';

// xlsx (SheetJS) references browser globals at module-eval time, so load it lazily
// inside handlers to avoid "window is not defined" during SSR/prerender.
let _xlsx: typeof import('xlsx') | null = null;
async function getXLSX() {
  if (!_xlsx) _xlsx = await import('xlsx');
  return _xlsx;
}

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = []; let field = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; } else field += c; }
    else { if (c === '"') q = true; else if (c === ',') { row.push(field); field = ''; } else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; } else if (c !== '\r') field += c; }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim()));
}

export default function ExcelClient() {
  const { t } = useI18n();
  const pathname = usePathname();
  const slug = (pathname || '').replace(/^\/tools\//, '').replace(/\/$/, '');
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState('');

  async function run() {
    setBusy(true); setOut('');
    const XLSX = await getXLSX();
    try {
      if (slug === 'csv-to-excel') {
        const text = file ? await file.text() : input;
        const rows = parseCsv(text);
        const ws = XLSX.utils.aoa_to_sheet(rows);
        const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
        download(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'converted.xlsx');
      } else if (slug === 'json-to-excel') {
        const text = file ? await file.text() : input;
        const arr = JSON.parse(text);
        const ws = XLSX.utils.json_to_sheet(Array.isArray(arr) ? arr : [arr]);
        const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
        download(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'converted.xlsx');
      } else if (slug === 'excel-to-csv' || slug === 'excel-to-json') {
        if (!file) { setOut('Please upload an .xlsx file.'); return; }
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(new Uint8Array(buf), { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        if (slug === 'excel-to-csv') setOut(XLSX.utils.sheet_to_csv(ws));
        else setOut(JSON.stringify(XLSX.utils.sheet_to_json(ws), null, 2));
      }
    } catch (e) {
      setOut('Error: ' + (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (!['csv-to-excel', 'json-to-excel', 'excel-to-csv', 'excel-to-json'].includes(slug)) {
    return <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">Tool not found.</div>;
  }

  const needFile = slug === 'excel-to-csv' || slug === 'excel-to-json';
  return (
    <div className="space-y-4">
      {!needFile && <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={slug === 'csv-to-excel' ? 'Paste CSV…' : 'Paste JSON array…'} className="h-40 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800" />}
      <div><label className="mb-1 block text-sm text-slate-600">{needFile ? 'Upload .xlsx' : '…or upload a file'}</label>
        <input type="file" accept={needFile ? '.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : '.csv,.json,text/csv,application/json'} onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block w-full text-sm text-slate-500" /></div>
      <button onClick={run} disabled={busy} className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">Convert</button>
      {out && (
        <div className="mt-3 flex gap-2">
          <textarea readOnly value={out} className="h-48 w-full rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-xs text-slate-800" />
          <button onClick={() => navigator.clipboard.writeText(out)} className="self-start rounded-lg bg-brand/10 px-3 py-2 text-xs font-medium text-brand">Copy</button>
        </div>
      )}
    </div>
  );
}
