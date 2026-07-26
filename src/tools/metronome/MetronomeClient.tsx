'use client';

import { useEffect, useRef, useState } from 'react';

export default function MetronomeClient() {
  const [bpm, setBpm] = useState(100);
  const [running, setRunning] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nextRef = useRef(0);
  const timerRef = useRef<number>(0);
  const bpmRef = useRef(bpm);

  // Keep the scheduler in sync with the latest BPM without restarting the interval.
  useEffect(() => { bpmRef.current = bpm; }, [bpm]);

  function click(ctx: AudioContext, time: number) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 1000;
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(0.4, time + 0.001);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);
    o.connect(g).connect(ctx.destination);
    o.start(time);
    o.stop(time + 0.05);
  }

  useEffect(() => {
    if (!running) return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = ctxRef.current ?? new AC();
    ctxRef.current = ctx;
    nextRef.current = ctx.currentTime + 0.05;

    const lookahead = 0.5; // schedule clicks up to 500ms ahead so tab throttling can't miss beats
    const tick = () => {
      const spb = 60 / bpmRef.current;
      while (nextRef.current < ctx.currentTime + lookahead) {
        click(ctx, nextRef.current);
        nextRef.current += spb;
      }
    };
    timerRef.current = window.setInterval(tick, 25);

    return () => window.clearInterval(timerRef.current);
  }, [running]);

  useEffect(() => () => {
    const ctx = ctxRef.current;
    if (ctx) ctx.close().catch(() => {});
  }, []);

  return (
    <div className="space-y-6 text-center">
      <div className="text-6xl font-bold tabular-nums text-slate-900">{bpm}</div>
      <div className="flex items-center justify-center gap-4">
        <button type="button" onClick={() => setBpm((b) => Math.max(30, b - 1))} className="h-10 w-10 rounded-full border border-slate-200 text-xl text-slate-600">−</button>
        <input type="range" min={30} max={250} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} className="w-64 accent-brand" />
        <button type="button" onClick={() => setBpm((b) => Math.min(250, b + 1))} className="h-10 w-10 rounded-full border border-slate-200 text-xl text-slate-600">+</button>
      </div>
      <button
        type="button"
        onClick={() => setRunning((r) => !r)}
        className={`rounded-lg px-6 py-2.5 text-sm font-semibold text-white ${running ? 'bg-red-500 hover:bg-red-600' : 'bg-brand hover:bg-brand/90'}`}
      >
        {running ? 'Stop' : 'Start'}
      </button>
      <p className="text-xs text-slate-400">Adjust the tempo and tap Start. Sound plays through your speakers.</p>
    </div>
  );
}
