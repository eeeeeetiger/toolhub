'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { useI18n } from '@/i18n';
import { getFFmpeg, writeInput, readOutput, convertVideo } from '@/lib/video';

export default function VideoConverterClient({ lockedTarget }: { lockedTarget?: 'mp4' | 'mov' | 'webm' | 'avi' | 'mkv' | 'gif' }) {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState<'mp4' | 'mov' | 'webm' | 'avi' | 'mkv' | 'gif'>(lockedTarget ?? 'mp4');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  const isGif = target === 'gif';

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('video/')) {
      setError(t('tools.video-converter.ui.onlyVideo', 'Please choose a video file.'));
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
      await convertVideo(ff, 'in.mp4', `out.${target}`, target, (r) => setProgress(Math.round(r * 100)));
      const blob = await readOutput(ff, `out.${target}`);
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setOutUrl(url);
    } catch (err) {
      setError(t('tools.video-converter.ui.fail', 'Conversion failed. The video may be too large or unsupported.'));
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
            {file ? file.name : t('tools.video-converter.ui.upload', 'Choose a video')}
          </span>
          {!file && <p className="mt-1 text-xs text-slate-400">{t('tools.video-converter.ui.hint', 'MP4, MOV, WebM, AVI, MKV — processed locally')}</p>}
        </label>

        {file && (
          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-1 block text-sm text-slate-600">{t('tools.video-converter.ui.target', 'Target format')}</label>
              {lockedTarget ? (
                <span className="inline-block rounded-lg border border-brand bg-brand/[0.06] px-3 py-2 text-sm font-medium text-brand uppercase">
                  {lockedTarget}
                </span>
              ) : (
                <select
                  value={target}
                  onChange={(e) => setTarget(e.target.value as typeof target)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand focus:outline-none"
                >
                  <option value="mp4">MP4</option>
                  <option value="mov">MOV</option>
                  <option value="webm">WebM</option>
                  <option value="avi">AVI</option>
                  <option value="mkv">MKV</option>
                  <option value="gif">GIF</option>
                </select>
              )}
              <p className="mt-1 text-xs text-slate-400">{t('tools.video-converter.ui.format', 'Output container / format')}</p>
            </div>

            <button
              onClick={run}
              disabled={busy}
              className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
            >
              {busy
                ? `${t('tools.video-converter.ui.processing', 'Processing')}… ${progress}%`
                : t('tools.video-converter.ui.convert', 'Convert')}
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
          <h3 className="mb-3 text-sm font-semibold text-slate-900">{t('tools.video-converter.ui.result', 'Converted video')}</h3>
          {isGif ? (
            <img src={outUrl} alt="result" className="mb-3 max-h-80 w-full rounded-lg bg-black object-contain" />
          ) : (
            <video src={outUrl} controls className="mb-3 max-h-80 w-full rounded-lg bg-black" />
          )}
          <a href={outUrl} download={`converted.${target}`} className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90">
            {t('tools.video-converter.ui.download', 'Download')}
          </a>
        </div>
      )}
    </div>
  );
}
