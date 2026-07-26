'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/i18n';
import { decodeAudioFile, audioBufferToFormat } from '@/lib/audio';
import { AudioFormatSelector, MP3_BITRATES } from '@/tools/_shared/AudioFormatSelector';

export default function AudioRecorderClient() {
  const { t } = useI18n();
  const [recording, setRecording] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [outExt, setOutExt] = useState('mp3');
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [format, setFormat] = useState<'wav' | 'mp3'>('mp3');
  const [bitrate, setBitrate] = useState<number>(MP3_BITRATES[1]);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      mediaRef.current?.stream.getTracks().forEach((tr) => tr.stop());
    };
  }, []);

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        const webm = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' });
        stream.getTracks().forEach((tr) => tr.stop());
        setBusy(true);
        try {
          const buf = await decodeAudioFile(webm);
          const res = await audioBufferToFormat(buf, format, bitrate);
          if (urlRef.current) URL.revokeObjectURL(urlRef.current);
          const u = URL.createObjectURL(res.blob);
          urlRef.current = u;
          setUrl(u);
          setOutExt(res.ext);
        } catch {
          // 回退：解码/转码失败时直接给原始 WebM，保证至少能下载
          if (urlRef.current) URL.revokeObjectURL(urlRef.current);
          const u = URL.createObjectURL(webm);
          urlRef.current = u;
          setUrl(u);
          setOutExt('webm');
        } finally {
          setBusy(false);
        }
      };
      mediaRef.current = mr;
      mr.start();
      setRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } catch {
      setError(t('tools.audio-recorder.ui.denied', 'Microphone access was denied or is unavailable.'));
    }
  }

  function stop() {
    mediaRef.current?.stop();
    setRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  const mmss = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
        <div className="mb-4 text-4xl font-bold tabular-nums text-slate-800">{mmss}</div>
        {!recording ? (
          <button
            onClick={start}
            disabled={busy}
            className="rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
          >
            {busy ? 'Processing…' : t('tools.audio-recorder.ui.start', 'Start recording')}
          </button>
        ) : (
          <button
            onClick={stop}
            className="rounded-lg bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
          >
            {t('tools.audio-recorder.ui.stop', 'Stop recording')}
          </button>
        )}
        <p className="mt-3 text-xs text-slate-400">
          {t('tools.audio-recorder.ui.privacy', 'Recorded entirely in your browser — nothing is uploaded.')}
        </p>
        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <AudioFormatSelector format={format} setFormat={setFormat} bitrate={bitrate} setBitrate={setBitrate} />
        <p className="mt-2 text-xs text-slate-400">
          {t('tools.audio-recorder.ui.formatHint', 'Recorded audio is converted to your chosen format after you stop.')}
        </p>
      </div>

      {url && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">{t('tools.audio-recorder.ui.result', 'Your recording')}</h3>
          <audio src={url} controls className="mb-3 w-full" />
          <a
            href={url}
            download={`recording.${outExt}`}
            className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
          >
            {t('tools.audio-recorder.ui.download', 'Download')}
          </a>
        </div>
      )}
    </div>
  );
}
