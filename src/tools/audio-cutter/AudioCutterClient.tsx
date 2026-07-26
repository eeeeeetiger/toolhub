'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { useI18n } from '@/i18n';
import { getFFmpeg, writeInput, readOutput, cutAudio, type AudioFormat } from '@/lib/audio';

const FORMATS: AudioFormat[] = ['mp3', 'wav', 'm4a', 'ogg'];

export default function AudioCutterClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState('0');
  const [end, setEnd] = useState('');
  const [fmt, setFmt] = useState<AudioFormat>('mp3');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);
  const srcUrlRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setError(null);
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    setOutUrl(null);
    setFile(f);
    // 保留源文件播放地址，供用户边听边定位开始/结束时间
    if (srcUrlRef.current) URL.revokeObjectURL(srcUrlRef.current);
    const u = URL.createObjectURL(f);
    srcUrlRef.current = u;
    setSrcUrl(u);
    const a = new Audio(u);
    a.onloadedmetadata = () => {
      setDuration(a.duration || 0);
      setEnd((a.duration || 0).toFixed(1));
    };
  }

  // 把播放器当前位置填入开始/结束
  function setFromPlayer(target: 'start' | 'end') {
    const cur = audioRef.current?.currentTime;
    if (cur == null || Number.isNaN(cur)) return;
    const v = cur.toFixed(1);
    if (target === 'start') setStart(v);
    else setEnd(v);
  }

  async function run() {
    if (!file) return;
    const s = parseFloat(start) || 0;
    const e = parseFloat(end) || duration;
    if (e <= s) {
      setError(t('tools.audio-cutter.ui.badRange', 'End must be greater than start.'));
      return;
    }
    setBusy(true);
    setProgress(0);
    setError(null);
    setOutUrl(null);
    try {
      const ff = await getFFmpeg();
      // 保留原始扩展名：ffmpeg 靠扩展名选择输入 demuxer
      const ext = (file.name.split('.').pop() || 'dat').toLowerCase();
      const inName = `in.${ext}`;
      await writeInput(ff, inName, file);
      await cutAudio(ff, inName, `out.${fmt}`, s, e, fmt, undefined, (r) => setProgress(Math.round(r * 100)));
      const blob = await readOutput(ff, `out.${fmt}`);
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setOutUrl(url);
    } catch (err) {
      setError(t('tools.audio-cutter.ui.fail', 'Cut failed. The file may be too large or unsupported.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <label className="block cursor-pointer rounded-lg border-2 border-dashed border-slate-300 p-8 text-center transition-colors hover:border-brand/40">
          <input type="file" accept="audio/*" onChange={onPick} className="hidden" />
          <span className="text-sm font-medium text-slate-600">
            {file ? file.name : t('tools.audio-cutter.ui.upload', 'Choose an audio file')}
          </span>
          {!file && <p className="mt-1 text-xs text-slate-400">{t('tools.audio-cutter.ui.hint', 'MP3, WAV, M4A, OGG — processed locally')}</p>}
        </label>

        {file && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            {srcUrl && (
              <div className="col-span-2">
                <audio ref={audioRef} src={srcUrl} controls className="w-full" />
                <p className="mt-1 text-xs text-slate-400">
                  {t('tools.audio-cutter.ui.playerHint', 'Play to find the right spot, then use the buttons below to fill times.')}
                </p>
              </div>
            )}
            <div>
              <label className="mb-1 block text-sm text-slate-600">{t('tools.audio-cutter.ui.start', 'Start (s)')}</label>
              <input type="number" min={0} step="0.1" value={start} onChange={(e) => setStart(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand focus:outline-none" />
              <button type="button" onClick={() => setFromPlayer('start')} className="mt-1 text-xs text-brand hover:underline">
                {t('tools.audio-cutter.ui.setStart', 'Use current position')}
              </button>
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">{t('tools.audio-cutter.ui.end', 'End (s)')}</label>
              <input type="number" min={0} step="0.1" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand focus:outline-none" />
              <button type="button" onClick={() => setFromPlayer('end')} className="mt-1 text-xs text-brand hover:underline">
                {t('tools.audio-cutter.ui.setEnd', 'Use current position')}
              </button>
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-sm text-slate-600">{t('tools.audio-cutter.ui.format', 'Output format')}</label>
              <select value={fmt} onChange={(e) => setFmt(e.target.value as AudioFormat)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand focus:outline-none">
                {FORMATS.map((f) => <option key={f} value={f}>{f.toUpperCase()}</option>)}
              </select>
              {duration > 0 && <p className="mt-1 text-xs text-slate-400">{t('tools.audio-cutter.ui.dur', 'Duration')}: {duration.toFixed(1)}s</p>}
            </div>

            <div className="col-span-2">
              <button onClick={run} disabled={busy} className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-50">
                {busy ? `${t('tools.audio-cutter.ui.processing', 'Processing')}… ${progress}%` : t('tools.audio-cutter.ui.cut', 'Cut audio')}
              </button>
              {busy && <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-brand transition-all" style={{ width: `${progress}%` }} /></div>}
            </div>
          </div>
        )}
        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      </div>

      {outUrl && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">{t('tools.audio-cutter.ui.result', 'Trimmed audio')}</h3>
          <audio src={outUrl} controls className="mb-3 w-full" />
          <a href={outUrl} download={`${(file?.name ?? 'trimmed').replace(/\.[^/.]+$/, '')}.${fmt}`} className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90">{t('tools.audio-cutter.ui.download', 'Download')}</a>
        </div>
      )}
    </div>
  );
}
