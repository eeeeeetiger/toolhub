'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';

function nodeToJson(node: Element): unknown {
  const obj: Record<string, unknown> = {};
  if (node.attributes.length) {
    for (const a of Array.from(node.attributes)) obj['@' + a.name] = a.value;
  }
  const children = Array.from(node.childNodes).filter((c) => c.nodeType === 1) as Element[];
  const text = Array.from(node.childNodes).filter((c) => c.nodeType === 3).map((c) => c.textContent?.trim() ?? '').join('');
  if (children.length === 0) {
    return text || obj;
  }
  for (const child of children) {
    const key = child.tagName;
    const val = nodeToJson(child);
    if (obj[key] !== undefined) {
      if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
      (obj[key] as unknown[]).push(val);
    } else {
      obj[key] = val;
    }
  }
  if (text && children.length) obj['#text'] = text;
  return obj;
}

export default function XmlJsonClient() {
  const { t } = useI18n();
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [out, setOut] = useState('');

  async function run() {
    const raw = file ? await file.text() : input;
    try {
      const doc = new DOMParser().parseFromString(raw, 'application/xml');
      if (doc.querySelector('parsererror')) { setOut('Invalid XML.'); return; }
      const root = doc.documentElement;
      setOut(JSON.stringify(root ? nodeToJson(root) : {}, null, 2));
    } catch (e) {
      setOut('Error: ' + (e as Error).message);
    }
  }

  return (
    <div className="space-y-4">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste XML…" className="h-48 w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-sm text-slate-800" />
      <div><label className="mb-1 block text-sm text-slate-600">…or upload a file</label><input type="file" accept=".xml,text/xml,application/xml" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block w-full text-sm text-slate-500" /></div>
      <button onClick={run} className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">Convert</button>
      {out && (
        <div className="mt-3 flex gap-2">
          <textarea readOnly value={out} className="h-48 w-full rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-xs text-slate-800" />
          <button onClick={() => navigator.clipboard.writeText(out)} className="self-start rounded-lg bg-brand/10 px-3 py-2 text-xs font-medium text-brand">Copy</button>
        </div>
      )}
    </div>
  );
}
