'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/i18n';
import type { TunerResult } from 'tuner-core';

export default function TunerClient() {
  const { t } = useI18n();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<TunerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  async function start() {
    setError(null);
    try {
      // 动态导入：tuner-core 依赖浏览器 Web Audio，顶层 import 会触发预渲染崩溃
      const tc = await import('tuner-core');
      const { TunerSession, createPitchDetector, findTuning, mergeTunerSettings } = tc;

      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      const srcNode = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      srcNode.connect(analyser);
      const buf = new Float32Array(analyser.fftSize);
      const listeners: ((s: Float32Array) => void)[] = [];
      let raf = 0;

      // 麦克风音频提供器：用 AnalyserNode + rAF 逐帧推送样本给 tuner-core
      const audioProvider = {
        getSampleRate: () => ctx.sampleRate,
        onFrame: (cb: (s: Float32Array) => void) => listeners.push(cb),
        start: async () => {
          const tick = () => {
            analyser.getFloatTimeDomainData(buf);
            const copy = new Float32Array(buf.length);
            copy.set(buf);
            listeners.forEach((cb) => cb(copy));
            raf = requestAnimationFrame(tick);
          };
          tick();
        },
        stop: () => {
          cancelAnimationFrame(raf);
          stream.getTracks().forEach((tr) => tr.stop());
          ctx.close();
        },
      };

      const settings = mergeTunerSettings({ pitchDetector: 'yin', medianWindowSize: 7, minConfidence: 0.2 });
      const detector = createPitchDetector(settings);
      const session = new TunerSession(audioProvider, detector, settings);
      const tuning = findTuning('guitar', 'guitar-standard');
      session.setTuning(tuning ?? null);
      session.applyPreferences({ centsThreshold: 5 });
      session.on('result', (r: TunerResult) => setResult(r));
      session.on('error', (e: Error) => setError(e.message));

      cleanupRef.current = () => {
        try {
          session.stop();
        } catch {
          /* noop */
        }
        try {
          audioProvider.stop();
        } catch {
          /* noop */
        }
      };

      await session.start();
      setRunning(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('tools.tuner.ui.micDenied', 'Microphone access denied or tuner failed to start.'));
      cleanupRef.current?.();
      setRunning(false);
    }
  }

  function stop() {
    cleanupRef.current?.();
    cleanupRef.current = null;
    setRunning(false);
    setResult(null);
  }

  useEffect(() => () => cleanupRef.current?.(), []);

  const cents = result?.cents ?? 0;
  const offset = Math.max(-50, Math.min(50, cents));

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border-4 border-slate-200 bg-white">
        <div className="text-4xl font-bold text-slate-900">
          {result ? `${result.note}${result.octave}` : '—'}
        </div>
      </div>

      <div className="relative mx-auto h-8 w-64">
        <div className="absolute left-1/2 top-0 h-8 w-px bg-slate-300" />
        <div
          className="absolute top-0 h-8 w-1 -translate-x-1/2 bg-brand transition-all"
          style={{ left: `${50 + offset}%` }}
        />
      </div>
      <p className="text-sm text-slate-500">
        {result
          ? `${result.frequency.toFixed(1)} Hz · ${cents > 0 ? '+' : ''}${Math.round(cents)} cents`
          : t('tools.tuner.ui.hint', 'Play a note near your microphone')}
      </p>

      {result?.tuningStrings && (
        <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
          {result.tuningStrings.map((s) => {
            const active = result.closestString?.name === s.name;
            const inTune = active && result.closestString?.inTune;
            return (
              <div
                key={s.name}
                className={`rounded-lg border px-2 py-3 text-center ${
                  inTune ? 'border-green-500 bg-green-50' : active ? 'border-brand bg-brand/10' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="text-sm font-semibold text-slate-800">{s.name}</div>
                <div className="text-xs text-slate-500">{Math.round(s.frequency)} Hz</div>
                {active && result.closestString && (
                  <div className={`text-xs font-medium ${inTune ? 'text-green-600' : 'text-brand'}`}>
                    {inTune ? t('tools.tuner.ui.inTune', 'In tune') : `${result.closestString.centsOff > 0 ? '+' : ''}${Math.round(result.closestString.centsOff)} ¢`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => (running ? stop() : start())}
        className={`rounded-lg px-6 py-2.5 text-sm font-semibold text-white ${running ? 'bg-red-500 hover:bg-red-600' : 'bg-brand hover:bg-brand/90'}`}
      >
        {running ? t('tools.tuner.ui.stop', 'Stop') : t('tools.tuner.ui.start', 'Start tuner')}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <details className="rounded-lg border border-slate-200 bg-white p-4 text-left text-sm text-slate-600">
        <summary className="cursor-pointer text-center font-medium text-slate-700 hover:text-brand">
          {t('tools.tuner.ui.noteTitle', 'Notes')}
        </summary>
        <div className="mt-3 space-y-3">
          <p>
            <strong className="text-slate-800">{t('tools.tuner.ui.notePrinciple', 'Principle')}</strong>
            <br />
            {t(
              'tools.tuner.ui.notePrincipleText',
              'The tuner uses the YIN algorithm via tuner-core to detect the fundamental frequency of the sound from your microphone. It then converts that frequency to the nearest musical note and octave, shows the cents offset, and compares it to the standard guitar string targets (E A D G B E).',
            )}
          </p>
          <p>
            <strong className="text-slate-800">{t('tools.tuner.ui.noteLimit', 'Limitations')}</strong>
            <br />
            {t(
              'tools.tuner.ui.noteLimitText',
              'It works on single notes, not chords or multiple voices. Background noise, low input volume, or a very quiet microphone can reduce confidence and make the pointer jump. In noisy environments, move closer to the microphone or reduce background sound.',
            )}
          </p>
          <p>
            <strong className="text-slate-800">{t('tools.tuner.ui.noteHow', 'How to use')}</strong>
            <br />
            {t(
              'tools.tuner.ui.noteHowText',
              'Click “Start tuner”, allow microphone access, and pluck one guitar string at a time. The big circle shows the detected note and octave. The pointer shows whether the string is flat (left) or sharp (right). The matching string card turns green when it is close enough to the target pitch.',
            )}
          </p>
        </div>
      </details>
    </div>
  );
}
