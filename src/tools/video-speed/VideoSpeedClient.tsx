'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { useI18n } from '@/i18n';
import { getFFmpeg, writeInput, readOutput, changeSpeed } from '@/lib/video';

export default function VideoSpeedClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [factor, setFactor] = useState(1); // default 1x
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('video/')) {
      setError(t('tools.video-speed.ui.onlyVideo', 'Please choose a video file.'));
      return;
    }
    setError(null);
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    setOutUrl(null);
    setFile(f);
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setProgress(0);
    setError(null);
    setOutUrl(null);
    try {
      const ff = await getFFmpeg();
      await writeInput(ff, 'in.mp4', file);
      await changeSpeed(ff, 'in.mp4', 'out.mp4', factor, (r) => setProgress(Math.round(r * 100)));
      const blob = await readOutput(ff, 'out.mp4');
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setOutUrl(url);
    } catch (err) {
      setError(t('tools.video-speed.ui.fail', 'Speed change failed. The video may be too large or unsupported.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <label className="block cursor-pointer rounded-lg border-2 border-dashed border-slate-300 p-8 text-center transition-colors hover:border-brand/40">
          <input type="file" accept="video/*" onChange={onPick} className="hidden" />
          <span className="text-sm font-medium text-slate-600">
            {file ? file.name : t('tools.video-speed.ui.upload', 'Choose a video')}
          </span>
          {!file && <p className="mt-1 text-xs text-slate-400">{t('tools.video-speed.ui.hint', 'MP4, MOV, WebM, AVI, MKV — processed locally')}</p>}
        </label>

        {file && (
          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                <span>{t('tools.video-speed.ui.speed', 'Speed')}</span>
                <span className="font-medium text-slate-800">{factor.toFixed(2)}x</span>
              </div>
              <input type="range" min={0.25} max={4} step={0.25} value={factor} onChange={(e) => setFactor(Number(e.target.value))} className="w-full accent-brand" />
              <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                <span>{t('tools.video-speed.ui.slow', 'Slow')}</span>
                <span>{t('tools.video-speed.ui.fast', 'Fast')}</span>
              </div>
            </div>

            <button
              onClick={run}
              disabled={busy}
              className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
            >
              {busy
                ? `${t('tools.video-speed.ui.processing', 'Processing')}… ${progress}%`
                : t('tools.video-speed.ui.apply', 'Change speed')}
            </button>

            {busy && (
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full bg-brand transition-all" style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>
        )}

        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      </div>

      {outUrl && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">{t('tools.video-speed.ui.result', 'Processed video')}</h3>
          <video src={outUrl} controls className="mb-3 max-h-80 w-full rounded-lg bg-black" />
          <a href={outUrl} download="speed-changed.mp4" className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90">
            {t('tools.video-speed.ui.download', 'Download')}
          </a>
        </div>
      )}
    </div>
  );
}
