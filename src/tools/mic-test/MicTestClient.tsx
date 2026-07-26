'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/i18n';

export default function MicTestClient() {
  const { t } = useI18n();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const rafRef = useRef<number>(0);

  async function start() {
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(s);
      const all = await navigator.mediaDevices.enumerateDevices();
      setDevices(all.filter((d) => d.kind === 'audioinput'));
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const src = ctx.createMediaStreamSource(s);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        setLevel(Math.min(1, Math.sqrt(sum / data.length) * 3));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Microphone access denied.');
    }
  }

  function stop() {
    stream?.getTracks().forEach((tr) => tr.stop());
    setStream(null);
    cancelAnimationFrame(rafRef.current);
    setLevel(0);
  }

  useEffect(() => () => {
    stream?.getTracks().forEach((tr) => tr.stop());
    cancelAnimationFrame(rafRef.current);
  }, [stream]);

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="mb-3 text-sm text-slate-600">{t('mic.hint', 'Allow microphone access to see a live input level meter.')}</p>
        {!stream ? (
          <button onClick={start} className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">
            {t('mic.start', 'Start mic test')}
          </button>
        ) : (
          <button onClick={stop} className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">
            {t('mic.stop', 'Stop')}
          </button>
        )}
      </div>

      {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      {stream && (
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-2 text-xs text-slate-500">Input level</div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${level * 100}%` }} />
          </div>
        </div>
      )}

      {devices.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-2 text-xs font-medium text-slate-600">Detected microphones</div>
          <ul className="space-y-1 text-sm text-slate-700">
            {devices.map((d, i) => (
              <li key={d.deviceId || i}>{d.label || `Microphone ${i + 1}`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
