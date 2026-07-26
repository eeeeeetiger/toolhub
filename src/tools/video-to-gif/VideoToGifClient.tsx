'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { useI18n } from '@/i18n';
import { getFFmpeg, writeInput, readOutput } from '@/lib/video';

export default function VideoToGifClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0); // 0 = 全段
  const [fps, setFps] = useState(10);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('video/')) {
      setError(t('tools.video-to-gif.ui.onlyVideo', 'Please choose a video file.'));
      return;
    }
    setError(null);
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    setOutUrl(null);
    setFile(f);
    setStart(0);
    setEnd(0);
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
      const args = ['-ss', String(start)];
      if (end > start) args.push('-to', String(end));
      args.push('-i', 'in.mp4', '-vf', `fps=${fps},scale=480:-1:flags=lanczos`, 'out.gif');
      await ff.exec(args);
      const blob = await readOutput(ff, 'out.gif');
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setOutUrl(url);
    } catch (err) {
      setError(t('tools.video-to-gif.ui.fail', 'Conversion failed. The video may be too large or unsupported.'));
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
            {file ? file.name : t('tools.video-to-gif.ui.upload', 'Choose a video')}
          </span>
          {!file && <p className="mt-1 text-xs text-slate-400">{t('tools.video-to-gif.ui.hint', 'MP4, MOV, WebM, AVI, MKV — processed locally')}</p>}
        </label>

        {file && (
          <div className="mt-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm text-slate-600">{t('tools.video-to-gif.ui.start', 'Start (s)')}</label>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={start}
                  onChange={(e) => setStart(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-brand focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">{t('tools.video-to-gif.ui.end', 'End (s)')}</label>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={end}
                  onChange={(e) => setEnd(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-brand focus:outline-none"
                />
                <p className="mt-1 text-xs text-slate-400">0 = {t('tools.video-to-gif.ui.endAll', 'whole clip')}</p>
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                <span>{t('tools.video-to-gif.ui.fps', 'Frame rate (FPS)')}</span>
                <span className="font-medium text-slate-800">{fps}</span>
              </div>
              <input type="range" min={5} max={20} step={1} value={fps} onChange={(e) => setFps(Number(e.target.value))} className="w-full accent-brand" />
            </div>

            <button
              onClick={run}
              disabled={busy}
              className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
            >
              {busy
                ? `${t('tools.video-to-gif.ui.processing', 'Processing')}… ${progress}%`
                : t('tools.video-to-gif.ui.convert', 'Convert to GIF')}
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
          <h3 className="mb-3 text-sm font-semibold text-slate-900">{t('tools.video-to-gif.ui.result', 'Your GIF')}</h3>
          <img src={outUrl} alt="result gif" className="mb-3 max-h-80 w-full rounded-lg bg-black object-contain" />
          <a href={outUrl} download="output.gif" className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90">
            {t('tools.video-to-gif.ui.download', 'Download')}
          </a>
        </div>
      )}
    </div>
  );
}
