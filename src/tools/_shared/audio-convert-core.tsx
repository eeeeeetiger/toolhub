'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { useI18n } from '@/i18n';
import { getFFmpeg, writeInput, readOutput, convertAudio, type AudioFormat } from '@/lib/audio';

const ALL_FORMATS: AudioFormat[] = ['mp3', 'wav', 'm4a', 'ogg', 'flac'];
const BITRATES = [64, 96, 128, 192, 256, 320];

export default function AudioConvertCore({
  lockedTarget,
  accept = 'audio/*',
  showBitrate = true,
}: {
  lockedTarget?: AudioFormat;
  accept?: string;
  showBitrate?: boolean;
}) {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [fmt, setFmt] = useState<AudioFormat>(lockedTarget ?? 'mp3');
  const [bitrate, setBitrate] = useState<number>(192);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  const formats = lockedTarget ? [lockedTarget] : ALL_FORMATS;
  const lossy = fmt === 'mp3' || fmt === 'm4a' || fmt === 'ogg';

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
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
      // 保留原始扩展名：ffmpeg 靠扩展名选择输入 demuxer，无扩展名会探测失败导致转换报错
      const ext = (file.name.split('.').pop() || 'dat').toLowerCase();
      const inName = `in.${ext}`;
      await writeInput(ff, inName, file);
      await convertAudio(ff, inName, `out.${fmt}`, fmt, lossy && showBitrate ? bitrate : undefined, (r) =>
        setProgress(Math.round(r * 100)),
      );
      const blob = await readOutput(ff, `out.${fmt}`);
      const MIME: Record<string, string> = { mp3: 'audio/mpeg', wav: 'audio/wav', m4a: 'audio/mp4', ogg: 'audio/ogg', flac: 'audio/flac' };
      const url = URL.createObjectURL(new Blob([blob], { type: MIME[fmt] ?? 'application/octet-stream' }));
      urlRef.current = url;
      setOutUrl(url);
    } catch (err) {
      console.error('[audio-convert] failed:', err);
      const detail = err instanceof Error ? err.message : String(err);
      setError(
        `${t('tools.audio-converter.ui.fail', 'Conversion failed. The file may be too large or in an unsupported format.')} [${detail}]`,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <label className="block cursor-pointer rounded-lg border-2 border-dashed border-slate-300 p-8 text-center transition-colors hover:border-brand/40">
          <input type="file" accept={accept} onChange={onPick} className="hidden" />
          <span className="text-sm font-medium text-slate-600">
            {file ? file.name : t('tools.audio-converter.ui.upload', 'Choose an audio file')}
          </span>
          {!file && (
            <p className="mt-1 text-xs text-slate-400">
              {t('tools.audio-converter.ui.hint', 'MP3, WAV, M4A, OGG, FLAC — processed locally')}
            </p>
          )}
        </label>

        {file && (
          <div className="mt-6 space-y-5">
            {!lockedTarget && (
              <div>
                <label className="mb-1 block text-sm text-slate-600">
                  {t('tools.audio-converter.ui.target', 'Target format')}
                </label>
                <select
                  value={fmt}
                  onChange={(e) => setFmt(e.target.value as AudioFormat)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand focus:outline-none"
                >
                  {formats.map((f) => (
                    <option key={f} value={f}>
                      {f.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {lossy && showBitrate && (
              <div>
                <label className="mb-1 block text-sm text-slate-600">
                  {t('tools.audio-converter.ui.bitrate', 'Bitrate')}
                </label>
                <select
                  value={bitrate}
                  onChange={(e) => setBitrate(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand focus:outline-none"
                >
                  {BITRATES.map((b) => (
                    <option key={b} value={b}>
                      {b} kbps
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={run}
              disabled={busy}
              className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
            >
              {busy
                ? `${t('tools.audio-converter.ui.processing', 'Processing')}… ${progress}%`
                : t('tools.audio-converter.ui.convert', 'Convert')}
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
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            {t('tools.audio-converter.ui.result', 'Converted audio')}
          </h3>
          <audio src={outUrl} controls className="mb-3 w-full" />
          <a
            href={outUrl}
            download={`${(file?.name ?? 'converted').replace(/\.[^/.]+$/, '')}.${fmt}`}
            className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
          >
            {t('tools.audio-converter.ui.download', 'Download')}
          </a>
        </div>
      )}
    </div>
  );
}
