'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/i18n';

type NoiseType = 'white' | 'pink' | 'brown';

// 三种噪声的逐样本生成。white=纯随机；pink=Paul Kellet 近似(-3dB/oct)；brown=白噪声的泄漏积分(低频更强)。
function fillNoise(data: Float32Array, type: NoiseType) {
  if (type === 'white') {
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return;
  }
  if (type === 'pink') {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < data.length; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + w * 0.0555179;
      b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.969 * b2 + w * 0.153852;
      b3 = 0.8665 * b3 + w * 0.3104856;
      b4 = 0.55 * b4 + w * 0.5329522;
      b5 = -0.7616 * b5 - w * 0.016898;
      const v = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
      data[i] = Math.max(-1, Math.min(1, v));
      b6 = w * 0.115926;
    }
    return;
  }
  // brown noise: leaky integrator of white noise
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const w = Math.random() * 2 - 1;
    last = (last + 0.02 * w) / 1.02;
    data[i] = Math.max(-1, Math.min(1, last * 3.5));
  }
}

export default function WhiteNoiseClient() {
  const { t } = useI18n();
  const [running, setRunning] = useState(false);
  const [volume, setVolume] = useState(50);
  const [noiseType, setNoiseType] = useState<NoiseType>('white');
  const ctxRef = useRef<AudioContext | null>(null);
  const srcRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  async function start() {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = ctxRef.current ?? new AC();
    ctxRef.current = ctx;
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    fillNoise(data, noiseType);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    const gain = ctx.createGain();
    gain.gain.value = volume / 100;
    src.connect(gain).connect(ctx.destination);
    src.start();
    srcRef.current = src;
    gainRef.current = gain;
    setRunning(true);
  }

  function stop() {
    srcRef.current?.stop();
    srcRef.current = null;
    setRunning(false);
  }

  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume / 100;
  }, [volume]);

  useEffect(() => () => srcRef.current?.stop(), []);

  const labels: Record<NoiseType, string> = {
    white: t('tools.white-noise-generator.whiteLabel', 'White'),
    pink: t('tools.white-noise-generator.pinkLabel', 'Pink'),
    brown: t('tools.white-noise-generator.brownLabel', 'Brown'),
  };

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto h-16 w-full max-w-md overflow-hidden rounded-lg bg-slate-100">
        <div className={`h-full w-full ${running ? 'animate-pulse bg-gradient-to-r from-brand/30 to-indigo-300/30' : ''}`} />
      </div>

      <div className="flex items-center justify-center gap-2">
        {(Object.keys(labels) as NoiseType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setNoiseType(t)}
            disabled={running}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
              noiseType === t ? 'bg-brand text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {labels[t]}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-3">
        <span className="text-xs text-slate-400">{t('tools.white-noise-generator.volume', 'Volume')}</span>
        <input type="range" min={0} max={100} value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-56 accent-brand" />
      </div>
      <button
        type="button"
        onClick={() => (running ? stop() : start())}
        className={`rounded-lg px-6 py-2.5 text-sm font-semibold text-white ${running ? 'bg-red-500 hover:bg-red-600' : 'bg-brand hover:bg-brand/90'}`}
      >
        {running ? t('tools.white-noise-generator.stop', 'Stop') : t('tools.white-noise-generator.play', 'Play noise')}
      </button>
      <p className="text-xs text-slate-500">
        {t(
          'tools.white-noise-generator.scenarios',
          'White noise masks sharp sounds (focus / office / privacy). Pink noise is softer and balanced, often preferred for sleep or tinnitus relief. Brown noise is deeper and rumbling, good for deep sleep, thunder-like focus or calming infants.',
        )}
      </p>
    </div>
  );
}
