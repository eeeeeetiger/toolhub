'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/i18n';

function fmtSw(ms: number) {
  const cs = Math.floor((ms % 1000) / 10);
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000) % 60;
  const h = Math.floor(ms / 3600000);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${h > 0 ? p(h) + ':' : ''}${p(m)}:${p(s)}.${p(cs)}`;
}

function beep() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine'; osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    osc.start();
    let count = 0;
    const iv = setInterval(() => {
      count++;
      osc.frequency.value = count % 2 === 0 ? 880 : 660;
      if (count >= 6) { clearInterval(iv); osc.stop(); ctx.close(); }
    }, 250);
  } catch { /* ignore */ }
}

function Stopwatch() {
  const { t } = useI18n();
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const startRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      startRef.current = performance.now() - elapsed;
      const tick = () => {
        setElapsed(performance.now() - startRef.current);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  return (
    <div className="space-y-4">
      <div className="text-center font-mono text-5xl font-bold text-slate-900">{fmtSw(elapsed)}</div>
      <div className="flex justify-center gap-2">
        <button onClick={() => setRunning((r) => !r)}
          className="rounded-lg bg-brand px-6 py-2 text-sm font-medium text-white transition hover:opacity-90">
          {running ? t('tools.stopwatch-timer.ui.pause', 'Pause') : t('tools.stopwatch-timer.ui.start', 'Start')}
        </button>
        <button onClick={() => { if (running) setLaps((l) => [...l, elapsed]); }}
          disabled={!running}
          className="rounded-lg border border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-700 transition hover:border-brand disabled:opacity-40">
          {t('tools.stopwatch-timer.ui.lap', 'Lap')}
        </button>
        <button onClick={() => { setRunning(false); setElapsed(0); setLaps([]); }}
          className="rounded-lg border border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-700 transition hover:border-brand">
          {t('tools.stopwatch-timer.ui.reset', 'Reset')}
        </button>
      </div>
      {laps.length > 0 && (
        <div className="max-h-48 overflow-auto rounded-lg border border-slate-200">
          {laps.map((l, i) => (
            <div key={i} className="flex justify-between border-b border-slate-100 px-4 py-2 text-sm last:border-0">
              <span className="text-slate-500">#{i + 1}</span>
              <span className="font-mono text-slate-900">{fmtSw(l)}</span>
              <span className="font-mono text-slate-400">+{fmtSw(l - (laps[i - 1] || 0))}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Countdown() {
  const { t } = useI18n();
  const [mins, setMins] = useState('5');
  const [secs, setSecs] = useState('0');
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const endRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      const tick = () => {
        const rem = Math.max(0, endRef.current - performance.now());
        setRemaining(rem);
        if (rem <= 0) { setRunning(false); beep(); return; }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const startCountdown = () => {
    const total = (parseInt(mins) || 0) * 60000 + (parseInt(secs) || 0) * 1000;
    if (total <= 0) return;
    endRef.current = performance.now() + total;
    setRemaining(total);
    setRunning(true);
  };

  return (
    <div className="space-y-4">
      {running || remaining > 0 ? (
        <div className={`text-center font-mono text-5xl font-bold ${remaining === 0 ? 'text-red-500' : 'text-slate-900'}`}>
          {fmtSw(remaining).replace(/\.\d+$/, '')}
        </div>
      ) : (
        <div className="flex items-end justify-center gap-2">
          <div>
            <label className="mb-1 block text-center text-xs text-slate-500">{t('tools.stopwatch-timer.ui.minutes', 'Minutes')}</label>
            <input type="number" min={0} value={mins} onChange={(e) => setMins(e.target.value)}
              className="w-24 rounded-lg border border-slate-200 p-2.5 text-center text-2xl font-mono text-slate-900 outline-none focus:border-brand" />
          </div>
          <span className="pb-3 text-2xl text-slate-400">:</span>
          <div>
            <label className="mb-1 block text-center text-xs text-slate-500">{t('tools.stopwatch-timer.ui.seconds', 'Seconds')}</label>
            <input type="number" min={0} max={59} value={secs} onChange={(e) => setSecs(e.target.value)}
              className="w-24 rounded-lg border border-slate-200 p-2.5 text-center text-2xl font-mono text-slate-900 outline-none focus:border-brand" />
          </div>
        </div>
      )}
      <div className="flex justify-center gap-2">
        {!running && remaining === 0 ? (
          <button onClick={startCountdown} className="rounded-lg bg-brand px-6 py-2 text-sm font-medium text-white transition hover:opacity-90">
            {t('tools.stopwatch-timer.ui.start', 'Start')}
          </button>
        ) : (
          <button onClick={() => setRunning((r) => !r)} className="rounded-lg bg-brand px-6 py-2 text-sm font-medium text-white transition hover:opacity-90">
            {running ? t('tools.stopwatch-timer.ui.pause', 'Pause') : t('tools.stopwatch-timer.ui.resume', 'Resume')}
          </button>
        )}
        <button onClick={() => { setRunning(false); setRemaining(0); }}
          className="rounded-lg border border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-700 transition hover:border-brand">
          {t('tools.stopwatch-timer.ui.reset', 'Reset')}
        </button>
      </div>
    </div>
  );
}

export default function StopwatchTimerClient() {
  const { t } = useI18n();
  const [tab, setTab] = useState<'stopwatch' | 'timer'>('stopwatch');
  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        {(['stopwatch', 'timer'] as const).map((k) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-lg border px-5 py-1.5 text-sm transition ${
              tab === k ? 'border-brand bg-brand/[0.08] text-brand' : 'border-slate-200 text-slate-600 hover:border-brand/40'
            }`}>
            {k === 'stopwatch' ? t('tools.stopwatch-timer.ui.stopwatch', 'Stopwatch') : t('tools.stopwatch-timer.ui.timer', 'Timer')}
          </button>
        ))}
      </div>
      <div className="rounded-lg border border-slate-200 p-6">
        {tab === 'stopwatch' ? <Stopwatch /> : <Countdown />}
      </div>
    </div>
  );
}
