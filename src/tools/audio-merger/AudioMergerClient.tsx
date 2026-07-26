'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { useI18n } from '@/i18n';
import { mergeAudioFiles, wavBlobToFormat } from '@/lib/audio';
import { AudioFormatSelector, MP3_BITRATES } from '@/tools/_shared/AudioFormatSelector';

export default function AudioMergerClient() {
  const { t } = useI18n();
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [outExt, setOutExt] = useState('wav');
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [format, setFormat] = useState<'wav' | 'mp3'>('mp3');
  const [bitrate, setBitrate] = useState<number>(MP3_BITRATES[1]);
  const urlRef = useRef<string | null>(null);
  const dragIdx = useRef<number | null>(null);

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files || []);
    if (picked.length) {
      setFiles((prev) => [...prev, ...picked]);
      setOutUrl(null);
      setError(null);
    }
  }

  function removeAt(i: number) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  }

  // 拖拽排序：把 from 位置的文件移动到 to 位置
  function dropAt(to: number) {
    const from = dragIdx.current;
    dragIdx.current = null;
    setDragOver(null);
    if (from === null || from === to) return;
    setFiles((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setOutUrl(null);
  }

  async function run() {
    if (files.length < 2) {
      setError(t('tools.audio-merger.ui.needTwo', 'Add at least two audio files to merge.'));
      return;
    }
    setBusy(true);
    setError(null);
    setOutUrl(null);
    try {
      const wav = await mergeAudioFiles(files);
      const res = await wavBlobToFormat(wav, format, bitrate);
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const url = URL.createObjectURL(res.blob);
      urlRef.current = url;
      setOutExt(res.ext);
      setOutUrl(url);
    } catch (err) {
      setError(t('tools.audio-merger.ui.fail', 'Merge failed. Some files could not be decoded in the browser.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <label className="block cursor-pointer rounded-lg border-2 border-dashed border-slate-300 p-8 text-center transition-colors hover:border-brand/40">
          <input type="file" accept="audio/*" multiple onChange={onPick} className="hidden" />
          <span className="text-sm font-medium text-slate-600">{t('tools.audio-merger.ui.upload', 'Add audio files')}</span>
          <p className="mt-1 text-xs text-slate-400">{t('tools.audio-merger.ui.hint', 'Files are joined in the order listed — drag items to reorder, processed locally')}</p>
        </label>

        {files.length > 0 && (
          <ul className="mt-5 space-y-2">
            {files.map((f, i) => (
              <li
                key={`${f.name}-${f.size}-${i}`}
                draggable
                onDragStart={() => { dragIdx.current = i; }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(i); }}
                onDragLeave={() => setDragOver((cur) => (cur === i ? null : cur))}
                onDrop={() => dropAt(i)}
                onDragEnd={() => { dragIdx.current = null; setDragOver(null); }}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors ${
                  dragOver === i ? 'bg-brand/10 outline-dashed outline-1 outline-brand' : 'bg-slate-50'
                }`}
              >
                <span className="mr-2 cursor-grab select-none text-slate-400" title={t('tools.audio-merger.ui.drag', 'Drag to reorder')}>⠿</span>
                <span className="truncate">{i + 1}. {f.name}</span>
                <button onClick={() => removeAt(i)} className="ml-3 text-xs text-red-500 hover:underline">{t('tools.audio-merger.ui.remove', 'Remove')}</button>
              </li>
            ))}
          </ul>
        )}

        {files.length > 0 && (
          <>
            <div className="mt-5">
              <AudioFormatSelector format={format} setFormat={setFormat} bitrate={bitrate} setBitrate={setBitrate} />
            </div>
            <button onClick={run} disabled={busy} className="mt-5 w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-50">
              {busy ? `${t('tools.audio-merger.ui.processing', 'Merging')}…` : t('tools.audio-merger.ui.merge', 'Merge audio')}
            </button>
          </>
        )}
        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      </div>

      {outUrl && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">{t('tools.audio-merger.ui.result', 'Merged audio')}</h3>
          <audio src={outUrl} controls className="mb-3 w-full" />
          <a href={outUrl} download={`${(files[0]?.name ?? 'merged').replace(/\.[^/.]+$/, '')}.${outExt}`} className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90">{t('tools.audio-merger.ui.download', 'Download')}</a>
        </div>
      )}
    </div>
  );
}
