'use client';

import { useEffect, useState } from 'react';

export default function KeyboardTestClient() {
  const [pressed, setPressed] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      setPressed(e.key);
      setLog((l) => [e.key === ' ' ? 'Space' : e.key, ...l].slice(0, 12));
      if ([' ', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
    };
    const up = () => setPressed(null);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  return (
    <div className="space-y-5">
      <div
        className={`flex h-40 items-center justify-center rounded-xl border-2 text-3xl font-bold transition-colors ${
          pressed ? 'border-brand bg-brand/10 text-brand' : 'border-slate-200 bg-slate-50 text-slate-300'
        }`}
      >
        {pressed ? (pressed === ' ' ? 'Space' : pressed) : 'Press any key'}
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-slate-500">Last keys pressed</p>
        <div className="flex flex-wrap gap-2">
          {log.length === 0 && <span className="text-sm text-slate-400">—</span>}
          {log.map((k, i) => (
            <span key={i} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">
              {k}
            </span>
          ))}
        </div>
      </div>
      <p className="text-xs text-slate-400">Tip: try modifier keys (Shift, Ctrl, Alt) and function keys to confirm they register.</p>
    </div>
  );
}
