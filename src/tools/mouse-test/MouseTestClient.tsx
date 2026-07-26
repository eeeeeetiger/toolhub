'use client';

import { useState } from 'react';

export default function MouseTestClient() {
  const [btn, setBtn] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [dbl, setDbl] = useState(0);
  const [wheel, setWheel] = useState(0);

  return (
    <div className="space-y-5">
      <div
        className="flex h-48 cursor-pointer select-none items-center justify-center rounded-xl border-2 border-slate-200 bg-slate-50 text-center text-slate-500"
        onMouseDown={(e) => setBtn(`Button ${e.button === 0 ? 'Left' : e.button === 1 ? 'Middle' : 'Right'}`)}
        onClick={() => setCount((c) => c + 1)}
        onMouseUp={() => setBtn(null)}
        onMouseLeave={() => setBtn(null)}
        onDoubleClick={() => setDbl((d) => d + 1)}
        onWheel={() => setWheel((w) => w + 1)}
      >
        <span className="px-4 text-sm">
          {btn ? `Holding: ${btn}` : 'Click / double-click / scroll here to test your mouse'}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="text-xl font-bold text-slate-900">{count}</div>
          <div className="text-xs text-slate-400">Clicks</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="text-xl font-bold text-slate-900">{dbl}</div>
          <div className="text-xs text-slate-400">Double clicks</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="text-xl font-bold text-slate-900">{wheel}</div>
          <div className="text-xs text-slate-400">Scrolls</div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          setCount(0);
          setDbl(0);
          setWheel(0);
        }}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:border-brand/30 hover:text-brand"
      >
        Reset
      </button>
    </div>
  );
}
