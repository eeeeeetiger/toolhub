'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { useI18n } from '@/i18n';
import { getFFmpeg, writeInput, readOutput, rotateVideo } from '@/lib/video';

type Mode = '90cw' | '90ccw' | '180' | 'hflip' | 'vflip';

const MODES: { mode: Mode; key: string; label: string }[] = [
  { mode: '90cw', key: 'rotateRight', label: 'Rotate right 90°' },
  { mode: '90ccw', key: 'rotateLeft', label: 'Rotate left 90°' },
  { mode: '180', key: 'flip180', label: 'Flip 180°' },
  { mode: 'hflip', key: 'mirrorH', label: 'Mirror horizontal' },
  { mode: 'vflip', key: 'mirrorV', label: 'Mirror vertical' },
];

export default function VideoRotateClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('video/')) {
      setError(t('tools.video-rotate.ui.onlyVideo', 'Please choose a video file.'));
      return;
    }
    setError(null);
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    setOutUrl(null);
    setFile(f);
  }

  async function run(mode: Mode) {
    if (!file || busy) return;
    setBusy(true);
    setProgress(0);
    setError(null);
    setOutUrl(null);
    try {
      const ff = await getFFmpeg();
      await writeInput(ff, 'in.mp4', file);
      await rotateVideo(ff, 'in.mp4', 'out.mp4', mode, (r) => setProgress(Math.round(r * 100)));
      const blob = await readOutput(ff, 'out.mp4');
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setOutUrl(url);
    } catch (err) {
      setError(t('tools.video-rotate.ui.fail', 'Rotation failed. The video may be too large or unsupported.'));
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
            {file ? file.name : t('tools.video-rotate.ui.upload', 'Choose a video')}
          </span>
          {!file && <p className="mt-1 text-xs text-slate-400">{t('tools.video-rotate.ui.hint', 'MP4, MOV, WebM, AVI, MKV — processed locally')}</p>}
        </label>

        {file && (
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {MODES.map(({ mode, key, label }) => (
              <button
                key={mode}
                onClick={() => run(mode)}
                disabled={busy}
                className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
              >
                {t(`tools.video-rotate.ui.${key}`, label)}
              </button>
            ))}
          </div>
        )}

        {busy && (
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-brand transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
        {busy && <p className="mt-2 text-center text-xs text-slate-400">{t('tools.video-rotate.ui.processing', 'Processing')}… {progress}%</p>}

        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      </div>

      {outUrl && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">{t('tools.video-rotate.ui.result', 'Result')}</h3>
          <video src={outUrl} controls className="mb-3 max-h-80 w-full rounded-lg bg-black" />
          <a href={outUrl} download="rotated.mp4" className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90">
            {t('tools.video-rotate.ui.download', 'Download')}
          </a>
        </div>
      )}
    </div>
  );
}
