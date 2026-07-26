'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { useI18n } from '@/i18n';
import { getFFmpeg, writeInput, readOutput, muteOrExtract } from '@/lib/video';

type Mode = 'mute' | 'extract';

export default function VideoMuteExtractClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<Mode>('mute');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [outName, setOutName] = useState('output.mp4');
  const [error, setError] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('video/')) {
      setError(t('tools.video-mute-extract.ui.onlyVideo', 'Please choose a video file.'));
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
    const output = mode === 'mute' ? 'out.mp4' : 'out.mp3';
    const name = mode === 'mute' ? 'muted.mp4' : 'audio.mp3';
    try {
      const ff = await getFFmpeg();
      await writeInput(ff, 'in.mp4', file);
      await muteOrExtract(ff, 'in.mp4', output, mode, (r) => setProgress(Math.round(r * 100)));
      const blob = await readOutput(ff, output);
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setOutUrl(url);
      setOutName(name);
    } catch (err) {
      setError(t('tools.video-mute-extract.ui.fail', 'Processing failed. The video may be too large or unsupported.'));
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
            {file ? file.name : t('tools.video-mute-extract.ui.upload', 'Choose a video')}
          </span>
          {!file && <p className="mt-1 text-xs text-slate-400">{t('tools.video-mute-extract.ui.hint', 'MP4, MOV, WebM, AVI, MKV — processed locally')}</p>}
        </label>

        {file && (
          <div className="mt-6 space-y-5">
            <div>
              <span className="mb-2 block text-sm text-slate-600">{t('tools.video-mute-extract.ui.mode', 'Mode')}</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMode('mute')}
                  className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${mode === 'mute' ? 'border-brand bg-brand/10 text-brand' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  {t('tools.video-mute-extract.ui.mute', 'Mute video')}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('extract')}
                  className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${mode === 'extract' ? 'border-brand bg-brand/10 text-brand' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  {t('tools.video-mute-extract.ui.extract', 'Extract audio (MP3)')}
                </button>
              </div>
            </div>

            <button
              onClick={run}
              disabled={busy}
              className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
            >
              {busy
                ? `${t('tools.video-mute-extract.ui.processing', 'Processing')}… ${progress}%`
                : t('tools.video-mute-extract.ui.process', 'Process')}
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
          <h3 className="mb-3 text-sm font-semibold text-slate-900">{t('tools.video-mute-extract.ui.result', 'Result')}</h3>
          {mode === 'mute' ? (
            <video src={outUrl} controls className="mb-3 max-h-80 w-full rounded-lg bg-black" />
          ) : (
            <audio src={outUrl} controls className="mb-3 w-full" />
          )}
          <a href={outUrl} download={outName} className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90">
            {t('tools.video-mute-extract.ui.download', 'Download')}
          </a>
        </div>
      )}
    </div>
  );
}
