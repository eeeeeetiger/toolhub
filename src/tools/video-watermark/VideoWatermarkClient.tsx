'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { useI18n } from '@/i18n';
import { getFFmpeg, writeInput, readOutput, addWatermark } from '@/lib/video';

type Position = 'top' | 'bottom' | 'center';

export default function VideoWatermarkClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [position, setPosition] = useState<Position>('bottom');
  const [color, setColor] = useState('#ffffff');
  const [size, setSize] = useState(36);
  const [bold, setBold] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('video/')) {
      setError(t('tools.video-watermark.ui.onlyVideo', 'Please choose a video file.'));
      return;
    }
    setError(null);
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    setOutUrl(null);
    setFile(f);
  }

  async function run() {
    if (!file) return;
    if (!text.trim()) {
      setError(t('tools.video-watermark.ui.text', 'Watermark text'));
      return;
    }
    setBusy(true);
    setProgress(0);
    setError(null);
    setOutUrl(null);
    try {
      const ff = await getFFmpeg();
      await writeInput(ff, 'in.mp4', file);
      await addWatermark(ff, 'in.mp4', 'out.mp4', { text, position, color, size, bold }, (r) => setProgress(Math.round(r * 100)));
      const blob = await readOutput(ff, 'out.mp4');
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setOutUrl(url);
    } catch (err) {
      setError(t('tools.video-watermark.ui.fail', 'Watermarking failed. The video may be too large or unsupported.'));
    } finally {
      setBusy(false);
    }
  }

  const positions: { value: Position; label: string }[] = [
    { value: 'top', label: t('tools.video-watermark.ui.top', 'Top') },
    { value: 'bottom', label: t('tools.video-watermark.ui.bottom', 'Bottom') },
    { value: 'center', label: t('tools.video-watermark.ui.center', 'Center') },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <label className="block cursor-pointer rounded-lg border-2 border-dashed border-slate-300 p-8 text-center transition-colors hover:border-brand/40">
          <input type="file" accept="video/*" onChange={onPick} className="hidden" />
          <span className="text-sm font-medium text-slate-600">
            {file ? file.name : t('tools.video-watermark.ui.upload', 'Choose a video')}
          </span>
          {!file && <p className="mt-1 text-xs text-slate-400">{t('tools.video-watermark.ui.hint', 'MP4, MOV, WebM, AVI, MKV — processed locally')}</p>}
        </label>

        {file && (
          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-1 block text-sm text-slate-600">{t('tools.video-watermark.ui.text', 'Watermark text')}</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t('tools.video-watermark.ui.text', 'Watermark text')}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand"
              />
            </div>

            <div>
              <span className="mb-1 block text-sm text-slate-600">{t('tools.video-watermark.ui.position', 'Position')}</span>
              <div className="flex gap-2">
                {positions.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPosition(p.value)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      position === p.value
                        ? 'border-brand bg-brand/10 text-brand'
                        : 'border-slate-300 text-slate-600 hover:border-brand/40'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                <span>{t('tools.video-watermark.ui.size', 'Font size')}</span>
                <span className="font-medium text-slate-800">{size}px</span>
              </div>
              <input type="range" min={16} max={72} step={1} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-brand" />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-8 w-10 cursor-pointer rounded border border-slate-300" />
                {t('tools.video-watermark.ui.color', 'Color')}
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={bold} onChange={(e) => setBold(e.target.checked)} className="accent-brand" />
                {t('tools.video-watermark.ui.bold', 'Bold')}
              </label>
            </div>

            <button
              onClick={run}
              disabled={busy}
              className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
            >
              {busy
                ? `${t('tools.video-watermark.ui.processing', 'Processing')}… ${progress}%`
                : t('tools.video-watermark.ui.apply', 'Add watermark')}
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
          <h3 className="mb-3 text-sm font-semibold text-slate-900">{t('tools.video-watermark.ui.result', 'Watermarked video')}</h3>
          <video src={outUrl} controls className="mb-3 max-h-80 w-full rounded-lg bg-black" />
          <a href={outUrl} download="watermarked.mp4" className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90">
            {t('tools.video-watermark.ui.download', 'Download')}
          </a>
        </div>
      )}
    </div>
  );
}
