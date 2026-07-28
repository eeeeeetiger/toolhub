'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/i18n';
import {
  convertBase,
  decodeHtmlEntities,
  encodeHtmlEntities,
  findReplaceText,
  morseToText,
  reverseText,
  sortText,
  textToMorse,
  wordFrequency,
} from './tool-logic';

function CopyBox({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-3 flex gap-2">
      <textarea
        readOnly
        value={text}
        className="h-48 w-full rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-xs text-slate-800"
      />
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="self-start rounded-lg bg-brand/10 px-3 py-2 text-xs font-medium text-brand"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

export default function TextToolClient() {
  const { t } = useI18n();
  const pathname = usePathname();
  const slug = (pathname || '').replace(/^\/tools\//, '').replace(/\/$/, '');

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  // controls state for specific tools
  const [sortAsc, setSortAsc] = useState(true);
  const [dedupe, setDedupe] = useState(false);
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [caseSens, setCaseSens] = useState(false);
  const [heMode, setHeMode] = useState<'encode' | 'decode'>('encode');
  const [heSpace, setHeSpace] = useState(false);
  const [morseMode, setMorseMode] = useState<'to' | 'from'>('to');
  const [num, setNum] = useState('255');
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(16);
  const [revMode, setRevMode] = useState<'chars' | 'words' | 'lines'>('chars');
  const [topN, setTopN] = useState(10);
  const [opt, setOpt] = useState({ trim: true, collapse: true, empty: true, crlf: false });

  function run() {
    if (slug === 'text-sorter') {
      setOutput(sortText(input, { asc: sortAsc, dedupe, trim: opt.trim, dropEmpty: opt.empty }));
    } else if (slug === 'find-replace') {
      const res = findReplaceText(input, find, replace, { useRegex, caseSensitive: caseSens });
      setOutput(res ?? 'Invalid pattern');
    } else if (slug === 'html-entity-converter') {
      setOutput(heMode === 'encode' ? encodeHtmlEntities(input) : decodeHtmlEntities(input));
    } else if (slug === 'morse-code-converter') {
      setOutput(morseMode === 'to' ? textToMorse(input) : morseToText(input));
    } else if (slug === 'base-converter') {
      setOutput(convertBase(num, fromBase, toBase) ?? 'Invalid number');
    } else if (slug === 'text-reverser') {
      setOutput(reverseText(input, revMode));
    } else if (slug === 'word-frequency') {
      setOutput(wordFrequency(input, topN));
    }
  }

  // HTML 实体转换器：实时转换，无需点击按钮
  useEffect(() => {
    if (slug !== 'html-entity-converter') return;
    setOutput(heMode === 'encode' ? encodeHtmlEntities(input, heSpace) : decodeHtmlEntities(input));
  }, [slug, input, heMode, heSpace]);

  // 文本排序 / 文字反转 / 进制转换：实时预览，无需点击 Run
  useEffect(() => {
    if (slug === 'text-sorter') {
      setOutput(sortText(input, { asc: sortAsc, dedupe, trim: opt.trim, dropEmpty: opt.empty }));
    } else if (slug === 'text-reverser') {
      setOutput(reverseText(input, revMode));
    } else if (slug === 'base-converter') {
      setOutput(convertBase(num, fromBase, toBase) ?? 'Invalid number');
    }
  }, [slug, input, sortAsc, dedupe, opt.trim, opt.empty, revMode, num, fromBase, toBase]);

  if (!['text-sorter', 'find-replace', 'html-entity-converter', 'morse-code-converter', 'base-converter', 'text-reverser', 'word-frequency'].includes(slug)) {
    return <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">Tool not found.</div>;
  }

  const labelCls = 'mb-1 block text-sm text-slate-600';
  const inpCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800';

  return (
    <div className="space-y-4">
      {slug !== 'base-converter' && (
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('text.input', 'Type or paste your text here…')}
          className="h-40 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800"
        />
      )}

      {slug === 'text-sorter' && (
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={sortAsc} onChange={(e) => setSortAsc(e.target.checked)} /> Sort A→Z</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={dedupe} onChange={(e) => setDedupe(e.target.checked)} /> Remove duplicates</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={opt.empty} onChange={(e) => setOpt({ ...opt, empty: e.target.checked })} /> Drop empty lines</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={opt.trim} onChange={(e) => setOpt({ ...opt, trim: e.target.checked })} /> Trim lines</label>
        </div>
      )}

      {slug === 'find-replace' && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div><label className={labelCls}>Find</label><input className={inpCls} value={find} onChange={(e) => setFind(e.target.value)} /></div>
          <div><label className={labelCls}>Replace</label><input className={inpCls} value={replace} onChange={(e) => setReplace(e.target.value)} /></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} /> Regex</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={caseSens} onChange={(e) => setCaseSens(e.target.checked)} /> Case sensitive</label>
        </div>
      )}

      {slug === 'html-entity-converter' && (
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Mode</label>
            <select className={inpCls} value={heMode} onChange={(e) => setHeMode(e.target.value as 'encode' | 'decode')}>
              <option value="encode">Encode (text → entities)</option>
              <option value="decode">Decode (entities → text)</option>
            </select>
          </div>
          {heMode === 'encode' && (
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={heSpace} onChange={(e) => setHeSpace(e.target.checked)} />
              {t('text.spacesToNbsp', 'Convert spaces to &nbsp;')}
            </label>
          )}
        </div>
      )}

      {slug === 'morse-code-converter' && (
        <div>
          <label className={labelCls}>Mode</label>
          <select className={inpCls} value={morseMode} onChange={(e) => setMorseMode(e.target.value as 'to' | 'from')}>
            <option value="to">Text → Morse</option>
            <option value="from">Morse → Text</option>
          </select>
        </div>
      )}

      {slug === 'base-converter' && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div><label className={labelCls}>Number</label><input className={inpCls} value={num} onChange={(e) => setNum(e.target.value)} /></div>
          <div><label className={labelCls}>From base</label><select className={inpCls} value={fromBase} onChange={(e) => setFromBase(parseInt(e.target.value))}>{[2, 8, 10, 16, 36].map((b) => <option key={b} value={b}>{b}</option>)}</select></div>
          <div><label className={labelCls}>To base</label><select className={inpCls} value={toBase} onChange={(e) => setToBase(parseInt(e.target.value))}>{[2, 8, 10, 16, 36].map((b) => <option key={b} value={b}>{b}</option>)}</select></div>
        </div>
      )}

      {slug === 'text-reverser' && (
        <div>
          <label className={labelCls}>Reverse</label>
          <select className={inpCls} value={revMode} onChange={(e) => setRevMode(e.target.value as 'chars' | 'words' | 'lines')}>
            <option value="chars">Characters</option>
            <option value="words">Words</option>
            <option value="lines">Lines</option>
          </select>
        </div>
      )}

      {slug === 'word-frequency' && (
        <div className="flex items-center gap-3">
          <label className="text-sm">Top N</label>
          <input type="number" min={1} value={topN} onChange={(e) => setTopN(parseInt(e.target.value) || 1)} className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
      )}

      {!['html-entity-converter', 'text-sorter', 'base-converter', 'text-reverser'].includes(slug) && (
        <button onClick={run} className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
          {t('text.run', 'Run')}
        </button>
      )}

      {output && <CopyBox text={output} />}
    </div>
  );
}
