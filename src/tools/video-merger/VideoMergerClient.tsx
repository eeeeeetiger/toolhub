'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { useI18n } from '@/i18n';
import { getFFmpeg, writeInput, readOutput, mergeVideos } from '@/lib/video';

export default function VideoMergerClient() {
  const { t } = useI18n();
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files || []).filter((f) => f.type.startsWith('video/'));
    if (picked.length === 0) {
      setError(t('tools.video-merger.ui.onlyVideo', 'Please choose video files.'));
      return;
    }
    setError(null);
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    setOutUrl(null);
    setFiles((prev) => [...prev, ...picked]);
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= files.length) return;
    setFiles((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  }

  function remove(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function run() {
    if (files.length < 2) return;
    setBusy(true);
    setProgress(0);
    setError(null);
    setOutUrl(null);
    try {
      const ff = await getFFmpeg();
      const list = files
        .map((_, i) => {
          const name = `f${i}.mp4`;
          return { name };
        });
      for (let i = 0; i < files.length; i++) {
        await writeInput(ff, `f${i}.mp4`, files[i]);
      }
      const content = list.map((f) => `file '${f.name}'`).join('\n');
      await ff.writeFile('list.txt', new TextEncoder().encode(content));
      await mergeVideos(ff, 'list.txt', 'out.mp4', (r) => setProgress(Math.round(r * 100)));
      const blob = await readOutput(ff, 'out.mp4');
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setOutUrl(url);
    } catch (err) {
      setError(t('tools.video-merger.ui.fail', 'Merging failed. Make sure all clips use the same format.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <label className="block cursor-pointer rounded-lg border-2 border-dashed border-slate-300 p-8 text-center transition-colors hover:border-brand/40">
          <input type="file" accept="video/*" multiple onChange={onPick} className="hidden" />
          <span className="text-sm font-medium text-slate-600">
            {t('tools.video-merger.ui.upload', 'Choose videos')}
          </span>
          {files.length === 0 && <p className="mt-1 text-xs text-slate-400">{t('tools.video-merger.ui.hint', 'MP4, MOV, WebM, AVI, MKV — processed locally')}</p>}
        </label>

        {files.length > 0 && (
          <div className="mt-6 space-y-5">
            <p className="text-sm font-medium text-slate-600">{t('tools.video-merger.ui.list', 'Files (in order)')}</p>
            <ul className="space-y-2">
              {files.map((f, i) => (
                <li key={`${f.name}-${i}`} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                  <span className="truncate text-sm text-slate-700">
                    <span className="mr-2 text-slate-400">{i + 1}.</span>
                    {f.name}
                  </span>
                  <span className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                    >
                      {t('tools.video-merger.ui.up', 'Up')}
                    </button>
                    <button
                      onClick={() => move(i, 1)}
                      disabled={i === files.length - 1}
                      className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                    >
                      {t('tools.video-merger.ui.down', 'Down')}
                    </button>
                    <button
                      onClick={() => remove(i)}
                      className="rounded-md border border-slate-200 px-2 py-1 text-xs text-red-500 hover:bg-red-50"
                    >
                      ×
                    </button>
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={run}
              disabled={busy || files.length < 2}
              className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
            >
              {busy
                ? `${t('tools.video-merger.ui.processing', 'Processing')}… ${progress}%`
                : t('tools.video-merger.ui.merge', 'Merge videos')}
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
          <h3 className="mb-3 text-sm font-semibold text-slate-900">{t('tools.video-merger.ui.result', 'Merged video')}</h3>
          <video src={outUrl} controls className="mb-3 max-h-80 w-full rounded-lg bg-black" />
          <a href={outUrl} download="merged.mp4" className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90">
            {t('tools.video-merger.ui.download', 'Download')}
          </a>
        </div>
      )}
    </div>
  );
}
