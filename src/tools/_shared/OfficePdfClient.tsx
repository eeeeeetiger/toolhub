'use client';

import { useState, type ChangeEvent } from 'react';
import { usePathname } from 'next/navigation';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { unzipSync } from 'fflate';
import { useI18n } from '@/i18n';

interface Block { text: string; size: number; bold: boolean; }

function decodeXml(s: string): string {
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)));
}

function extractDocx(buf: ArrayBuffer): string[] {
  const files = unzipSync(new Uint8Array(buf));
  const xml = Object.keys(files).find((k) => k === 'word/document.xml');
  if (!xml) return ['Unable to read document.'];
  const text = decodeXml(new TextDecoder().decode(files[xml]));
  const paras = text.split(/<\/w:p>/g).map((p) => (p.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || []).map((m) => m.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>/, '')).join(' ')).filter((l) => l.trim());
  return paras.length ? paras : ['No text found.'];
}

function extractPptx(buf: ArrayBuffer): string[] {
  const files = unzipSync(new Uint8Array(buf));
  const slides = Object.keys(files).filter((k) => /^ppt\/slides\/slide\d+\.xml$/.test(k)).sort((a, b) => parseInt(a.match(/\d+/)![0]) - parseInt(b.match(/\d+/)![0]));
  const out: string[] = [];
  slides.forEach((s, i) => {
    const text = decodeXml(new TextDecoder().decode(files[s]));
    const runs = (text.match(/<a:t>(.*?)<\/a:t>/g) || []).map((m) => m.replace(/<a:t>/, '').replace(/<\/a:t>/, '')).filter((l) => l.trim());
    out.push(`Slide ${i + 1}`);
    out.push(...(runs.length ? runs : ['—']));
    out.push('');
  });
  return out.length ? out : ['No text found.'];
}

function mdToBlocks(md: string): Block[] {
  const blocks: Block[] = [];
  const lines = md.replace(/\r/g, '').split('\n');
  let i = 0;
  const strip = (s: string) => s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1');
  while (i < lines.length) {
    const line = lines[i];
    if (/^#\s+/.test(line)) blocks.push({ text: strip(line.replace(/^#\s+/, '')), size: 20, bold: true });
    else if (/^##\s+/.test(line)) blocks.push({ text: strip(line.replace(/^##\s+/, '')), size: 16, bold: true });
    else if (/^###\s+/.test(line)) blocks.push({ text: strip(line.replace(/^###\s+/, '')), size: 13, bold: true });
    else if (/^(\s*[-*]\s+)/.test(line)) blocks.push({ text: '• ' + strip(line.replace(/^(\s*[-*]\s+)/, '')), size: 11, bold: false });
    else if (line.trim() === '') { i++; continue; }
    else blocks.push({ text: strip(line), size: 11, bold: false });
    i++;
  }
  return blocks;
}

export default function OfficePdfClient() {
  const { t } = useI18n();
  const pathname = usePathname();
  const slug = (pathname || '').replace(/^\/tools\//, '').replace(/\/$/, '');
  const [file, setFile] = useState<File | null>(null);
  const [md, setMd] = useState('# Title\n\nWrite **Markdown** here and convert to a PDF.');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onPick = (e: ChangeEvent<HTMLInputElement>) => { setFile(e.target.files?.[0] ?? null); setDone(false); setError(null); };

  async function run() {
    setBusy(true); setError(null); setDone(false);
    try {
      let blocks: Block[] = [];
      if (slug === 'markdown-to-pdf') {
        blocks = mdToBlocks(md);
      } else {
        if (!file) return;
        const buf = await file.arrayBuffer();
        const paras = slug === 'word-to-pdf' ? extractDocx(buf) : extractPptx(buf);
        blocks = paras.map((p) => ({ text: p, size: 11, bold: false }));
      }
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
      const W = 595, H = 842, M = 48;
      let page = pdf.addPage([W, H]);
      let y = H - M;
      const maxW = W - M * 2;
      const flush = (l: string, size: number, isBold: boolean) => {
        if (y < M + size) { page = pdf.addPage([W, H]); y = H - M; }
        page.drawText(l, { x: M, y, size, font: isBold ? bold : font });
        y -= size + 6;
      };
      for (const b of blocks) {
        const words = b.text.split(/\s+/).filter(Boolean);
        let line = '';
        for (const w of words) {
          const test = line ? line + ' ' + w : w;
          if (font.widthOfTextAtSize(test, b.size) > maxW) { flush(line, b.size, b.bold); line = w; }
          else line = test;
        }
        if (line) flush(line, b.size, b.bold);
        y -= 4;
      }
      const out = await pdf.save();
      const blob = new Blob([out as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'converted.pdf'; a.click();
      setDone(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (!['markdown-to-pdf', 'word-to-pdf', 'ppt-to-pdf'].includes(slug)) {
    return <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">Tool not found.</div>;
  }

  return (
    <div className="space-y-4">
      {slug === 'markdown-to-pdf' ? (
        <textarea value={md} onChange={(e) => setMd(e.target.value)} className="h-56 w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-sm text-slate-800" />
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <label className="mb-2 block text-sm font-medium text-slate-700">Choose a {slug === 'word-to-pdf' ? 'Word (.docx)' : 'PowerPoint (.pptx)'} file</label>
          <input type="file" accept={slug === 'word-to-pdf' ? '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document' : '.pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation'} onChange={onPick} className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-white" />
        </div>
      )}
      <button onClick={run} disabled={busy || (slug !== 'markdown-to-pdf' && !file)} className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
        {busy ? 'Generating…' : 'Convert to PDF'}
      </button>
      {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
      {done && <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Downloaded converted.pdf</div>}
    </div>
  );
}
