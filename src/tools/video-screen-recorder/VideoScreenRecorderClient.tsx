'use client';

import { useRef, useState } from 'react';
import { useI18n } from '@/i18n';

export default function VideoScreenRecorderClient() {
  const { t } = useI18n();
  const [recording, setRecording] = useState(false);
  const [mic, setMic] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mimeRef = useRef<string>('video/webm');
  const urlRef = useRef<string | null>(null);

  function pickMimeType(): string {
    if (typeof MediaRecorder === 'undefined') return 'video/webm';
    if (MediaRecorder.isTypeSupported('video/webm')) return 'video/webm';
    if (MediaRecorder.isTypeSupported('video/mp4')) return 'video/mp4';
    return 'video/webm';
  }

  async function start() {
    setError(null);
    setOutUrl(null);
    setProcessing(true);
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const stream = new MediaStream();
      displayStream.getTracks().forEach((track) => stream.addTrack(track));

      if (mic) {
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          micStream.getAudioTracks().forEach((track) => stream.addTrack(track));
        } catch {
          // Microphone is optional — keep going with screen audio only.
        }
      }

      const mimeType = pickMimeType();
      mimeRef.current = mimeType;

      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeRef.current });
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        setOutUrl(url);
        stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
        setProcessing(false);
      };

      streamRef.current = stream;
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setError(t('tools.video-screen-recorder.ui.fail', 'Recording failed or permission denied.'));
      setRecording(false);
    } finally {
      setProcessing(false);
    }
  }

  function stop() {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="mb-4 text-sm text-slate-500">
          {t('tools.video-screen-recorder.ui.hint', 'Your recording never leaves your browser.')}
        </p>

        <label className="mb-4 flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={mic}
            disabled={recording}
            onChange={(e) => setMic(e.target.checked)}
            className="accent-brand"
          />
          {t('tools.video-screen-recorder.ui.mic', 'Include microphone')}
        </label>

        {!recording ? (
          <button
            onClick={start}
            disabled={processing}
            className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
          >
            {processing
              ? `${t('tools.video-screen-recorder.ui.processing', 'Preparing')}…`
              : t('tools.video-screen-recorder.ui.start', 'Start recording')}
          </button>
        ) : (
          <button
            onClick={stop}
            className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            {t('tools.video-screen-recorder.ui.stop', 'Stop recording')}
          </button>
        )}

        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      </div>

      {outUrl && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            {t('tools.video-screen-recorder.ui.result', 'Your recording')}
          </h3>
          <video src={outUrl} controls className="mb-3 max-h-80 w-full rounded-lg bg-black" />
          <a
            href={outUrl}
            download={mimeRef.current === 'video/mp4' ? 'screen-recording.mp4' : 'screen-recording.webm'}
            className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
          >
            {t('tools.video-screen-recorder.ui.download', 'Download')}
          </a>
        </div>
      )}
    </div>
  );
}
