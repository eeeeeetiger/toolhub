'use client';

import { useEffect, useRef, useState } from 'react';

export default function WebcamTestClient() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string>('');

  async function start(id?: string) {
    setError(null);
    try {
      stop();
      const s = await navigator.mediaDevices.getUserMedia({
        video: id ? { deviceId: { exact: id } } : true,
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
      const all = await navigator.mediaDevices.enumerateDevices();
      setDevices(all.filter((d) => d.kind === 'videoinput'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Camera access denied.');
    }
  }

  function stop() {
    stream?.getTracks().forEach((tr) => tr.stop());
    setStream(null);
  }

  useEffect(() => () => stop(), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-black">
        <video ref={videoRef} autoPlay playsInline muted className="aspect-video w-full bg-black object-contain" />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      {!stream ? (
        <button
          type="button"
          onClick={() => start()}
          className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90"
        >
          Start camera
        </button>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={stop}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-red-300 hover:text-red-600"
          >
            Stop
          </button>
          {devices.length > 1 && (
            <select
              value={deviceId}
              onChange={(e) => {
                setDeviceId(e.target.value);
                start(e.target.value);
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
            >
              <option value="">Default camera</option>
              {devices.map((d, i) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || `Camera ${i + 1}`}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      <p className="text-xs text-slate-400">
        Allow camera access to preview your webcam and check image quality. The stream stays local in your
        browser.
      </p>
    </div>
  );
}
