'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useI18n } from '@/i18n';
import { getFFmpeg, writeInput, readOutput, compressAudio, probeBitrate } from '@/lib/audio';

const BITRATES = [32, 64, 96, 128, 192, 256];

export default function AudioCompressorClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [bitrate, setBitrate] = useState<number>(128);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);
  const [saved, setSaved] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [srcBr, setSrcBr] = useState<number | null>(null);
  const [probingBr, setProbingBr] = useState(false);
  const abortProbeRef = useRef<(() => void) | null>(null);

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setError(null);
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    setOutUrl(null);
    setSaved('');
    setNote('');
    setFile(f);
    setSrcBr(null);
    setProbingBr(true);

    // Probe the source bitrate so the user can see it before compressing.
    let aborted = false;
    abortProbeRef.current?.();
    abortProbeRef.current = () => { aborted = true; };
    (async () => {
      try {
        const ff = await getFFmpeg();
        const ext = (f.name.split('.').pop() || 'dat').toLowerCase();
        const inName = `in_probe.${ext}`;
        await writeInput(ff, inName, f);
        const br = await probeBitrate(ff, inName);
        if (!aborted) setSrcBr(br);
      } catch {
        if (!aborted) setSrcBr(null);
      } finally {
        if (!aborted) setProbingBr(false);
      }
    })();
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setProgress(0);
    setError(null);
    setOutUrl(null);
    setSaved('');
    setNote('');
    try {
      const ff = await getFFmpeg();
      // 保留原始扩展名：ffmpeg 靠扩展名选择输入 demuxer
      const ext = (file.name.split('.').pop() || 'dat').toLowerCase();
      const inName = `in.${ext}`;
      await writeInput(ff, inName, file);

      // 探测源码率：若目标码率 ≥ 源码率，MP3 二次编码会越压越大，需降级处理
      const srcBrNow = await probeBitrate(ff, inName);
      setSrcBr(srcBrNow);
      let target = bitrate;
      let noteMsg = '';
      if (srcBrNow) {
        if (target >= srcBrNow) {
          const lower = BITRATES.filter((b) => b < srcBrNow).sort((a, b) => b - a)[0];
          if (lower !== undefined) {
            target = lower;
            noteMsg = t(
              'tools.audio-compressor.ui.autoLower',
              `Source is ~${srcBrNow} kbps — compressed to ${target} kbps so the file gets smaller.`,
            );
          } else {
            noteMsg = t(
              'tools.audio-compressor.ui.cannotReduce',
              `Source is already ~${srcBrNow} kbps (lowest setting). MP3 re-encoding cannot shrink it further — keeping the original is best.`,
            );
            target = srcBrNow;
          }
        } else {
          noteMsg = t(
            'tools.audio-compressor.ui.info',
            `Source is ~${srcBrNow} kbps. Compressing to ${target} kbps.`,
          );
        }
      }
      setNote(noteMsg);

      await compressAudio(ff, inName, 'out.mp3', target, (r) => setProgress(Math.round(r * 100)));
      const blob = await readOutput(ff, 'out.mp3');
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setOutUrl(url);
      const pct = file.size > 0 ? Math.max(0, Math.round((1 - blob.size / file.size) * 100)) : 0;
      setSaved(`${pct}%`);
    } catch (err) {
      console.error(err);
      setError(t('tools.audio-compressor.ui.fail', 'Compression failed. The file may be too large or unsupported.'));
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <label className="block cursor-pointer rounded-lg border-2 border-dashed border-slate-300 p-8 text-center transition-colors hover:border-brand/40">
          <input type="file" accept="audio/*" onChange={onPick} className="hidden" />
          <span className="text-sm font-medium text-slate-600">
            {file ? file.name : t('tools.audio-compressor.ui.upload', 'Choose an audio file')}
          </span>
          {!file && <p className="mt-1 text-xs text-slate-400">{t('tools.audio-compressor.ui.hint', 'Lower bitrate = smaller file — processed locally')}</p>}
        </label>

        {file && (
          <div className="mt-4 space-y-5">
            <p className="text-xs text-slate-500">
              {probingBr
                ? t('tools.audio-compressor.ui.probingBitrate', 'Detecting source bitrate…')
                : srcBr
                ? t('tools.audio-compressor.ui.sourceBitrate', 'Source bitrate: ~{bitrate} kbps').replace('{bitrate}', String(srcBr))
                : t('tools.audio-compressor.ui.sourceBitrateUnknown', 'Source bitrate: unknown')}
            </p>
            <div>
              <label className="mb-1 block text-sm text-slate-600">{t('tools.audio-compressor.ui.bitrate', 'Target bitrate')}</label>
              <select value={bitrate} onChange={(e) => setBitrate(Number(e.target.value))} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand focus:outline-none">
                {BITRATES.map((b) => <option key={b} value={b}>{b} kbps</option>)}
              </select>
            </div>
            <button onClick={run} disabled={busy} className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-50">
              {busy ? `${t('tools.audio-compressor.ui.processing', 'Processing')}… ${progress}%` : t('tools.audio-compressor.ui.compress', 'Compress')}
            </button>
            {busy && <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-brand transition-all" style={{ width: `${progress}%` }} /></div>}
          </div>
        )}
        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      </div>

      {outUrl && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">{t('tools.audio-compressor.ui.result', 'Compressed audio')}</h3>
          <audio src={outUrl} controls className="mb-3 w-full" />
          {saved && <p className="mb-3 text-xs text-emerald-600">{t('tools.audio-compressor.ui.saved', 'Size reduced by')} {saved}</p>}
          {note && <p className="mb-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">{note}</p>}
          <a href={outUrl} download={`${(file?.name ?? 'compressed').replace(/\.[^/.]+$/, '')}.mp3`} className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90">{t('tools.audio-compressor.ui.download', 'Download')}</a>
        </div>
      )}
    </div>
  );
}
