'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/i18n';
import { crc32Hex, md5, shaHex } from './tool-logic';

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

const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export default function UtilToolClient() {
  const { t } = useI18n();
  const pathname = usePathname();
  const slug = (pathname || '').replace(/^\/tools\//, '').replace(/\/$/, '');

  const [tzInput, setTzInput] = useState('');
  const [tzOut, setTzOut] = useState('');
  const [hashText, setHashText] = useState('');
  const [hashFile, setHashFile] = useState<File | null>(null);
  const [hashOut, setHashOut] = useState('');
  const [loremN, setLoremN] = useState(3);
  const [loremOut, setLoremOut] = useState('');
  const [randMode, setRandMode] = useState<'number' | 'dice' | 'coin' | 'uuid' | 'password'>('number');
  const [randMin, setRandMin] = useState(1);
  const [randMax, setRandMax] = useState(100);
  const [randOut, setRandOut] = useState('');

  useEffect(() => {
    if (slug === 'timezone-converter') {
      const d = tzInput ? new Date(tzInput) : new Date();
      const zones = [
        ['UTC', 'UTC'], ['New York', 'America/New_York'], ['Los Angeles', 'America/Los_Angeles'],
        ['London', 'Europe/London'], ['Paris', 'Europe/Paris'], ['Tokyo', 'Asia/Tokyo'],
        ['Sydney', 'Australia/Sydney'], ['Dubai', 'Asia/Dubai'], ['Beijing', 'Asia/Shanghai'],
      ];
      setTzOut(zones.map(([name, z]) => `${name}: ${new Intl.DateTimeFormat('en-GB', { timeZone: z, dateStyle: 'medium', timeStyle: 'medium' }).format(d)}`).join('\n'));
    }
  }, [slug, tzInput]);

  async function hash() {
    let data: ArrayBuffer;
    if (hashFile) data = await hashFile.arrayBuffer();
    else data = new TextEncoder().encode(hashText).buffer;
    const bytes = new Uint8Array(data);
    const crc = crc32Hex(bytes);
    const text = `MD5:    ${md5(hashFile ? await hashFile.text() : hashText)}\nSHA-1:  ${await shaHex('SHA-1', bytes)}\nSHA-256:${await shaHex('SHA-256', bytes)}\nSHA-384:${await shaHex('SHA-384', bytes)}\nSHA-512:${await shaHex('SHA-512', bytes)}\nCRC32:  ${crc}`;
    setHashOut(text);
  }

  function genLorem() {
    setLoremOut(Array.from({ length: loremN }, () => LOREM).join('\n\n'));
  }

  function genRand() {
    if (randMode === 'number') setRandOut(String(Math.floor(Math.random() * (randMax - randMin + 1)) + randMin));
    else if (randMode === 'dice') setRandOut(String(Math.floor(Math.random() * 6) + 1));
    else if (randMode === 'coin') setRandOut(Math.random() < 0.5 ? 'Heads' : 'Tails');
    else if (randMode === 'uuid') setRandOut((crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)));
    else {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
      setRandOut(Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''));
    }
  }

  if (!['timezone-converter', 'hash-generator', 'lorem-ipsum', 'random-generator'].includes(slug)) {
    return <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">Tool not found.</div>;
  }

  const labelCls = 'mb-1 block text-sm text-slate-600';
  const inpCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800';

  return (
    <div className="space-y-4">
      {slug === 'timezone-converter' && (
        <div>
          <label className={labelCls}>Date & time</label>
          <input type="datetime-local" className={inpCls} value={tzInput} onChange={(e) => setTzInput(e.target.value)} />
          <p className="mt-2 text-xs text-slate-500">Leave empty to use the current time.</p>
        </div>
      )}
      {slug === 'timezone-converter' && tzOut && <CopyBox text={tzOut} />}

      {slug === 'hash-generator' && (
        <>
          <div><label className={labelCls}>Text</label><textarea className="h-24 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm" value={hashText} onChange={(e) => setHashText(e.target.value)} /></div>
          <div><label className={labelCls}>…or file</label><input type="file" onChange={(e) => setHashFile(e.target.files?.[0] ?? null)} className="block w-full text-sm text-slate-500" /></div>
          <button onClick={hash} className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">Generate hashes</button>
          {hashOut && <CopyBox text={hashOut} />}
        </>
      )}

      {slug === 'lorem-ipsum' && (
        <>
          <div className="flex items-center gap-3">
            <label className="text-sm">Paragraphs</label>
            <input type="number" min={1} max={50} value={loremN} onChange={(e) => setLoremN(parseInt(e.target.value) || 1)} className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <button onClick={genLorem} className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">Generate</button>
          {loremOut && <CopyBox text={loremOut} />}
        </>
      )}

      {slug === 'random-generator' && (
        <>
          <div>
            <label className={labelCls}>Type</label>
            <select className={inpCls} value={randMode} onChange={(e) => setRandMode(e.target.value as typeof randMode)}>
              <option value="number">Random number</option>
              <option value="dice">Dice (1–6)</option>
              <option value="coin">Coin flip</option>
              <option value="uuid">UUID</option>
              <option value="password">Password</option>
            </select>
          </div>
          {randMode === 'number' && (
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Min</label><input type="number" className={inpCls} value={randMin} onChange={(e) => setRandMin(parseInt(e.target.value) || 0)} /></div>
              <div><label className={labelCls}>Max</label><input type="number" className={inpCls} value={randMax} onChange={(e) => setRandMax(parseInt(e.target.value) || 0)} /></div>
            </div>
          )}
          <button onClick={genRand} className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">Generate</button>
          {randOut && <div className="rounded-lg border border-brand/30 bg-brand/[0.06] p-6 text-center text-3xl font-bold text-slate-900">{randOut}</div>}
        </>
      )}
    </div>
  );
}
