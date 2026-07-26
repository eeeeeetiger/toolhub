'use client';

import { useMemo, useState } from 'react';
import type { CalcDef, FieldDef } from './calc-defs';

function FieldInput({
  f,
  value,
  onChange,
}: {
  f: FieldDef;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-slate-600">{f.label}</label>
      <input
        type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
        value={value}
        placeholder={f.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
      />
    </div>
  );
}

export default function CalculatorShell({ def }: { def: CalcDef }) {
  const [vals, setVals] = useState<Record<string, string>>(() =>
    Object.fromEntries(def.fields.map((f) => [f.key, f.default ?? ''])),
  );
  const results = useMemo(() => def.compute(vals), [def, vals]);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {def.fields.map((f) => (
          <FieldInput
            key={f.key}
            f={f}
            value={vals[f.key]}
            onChange={(v) => setVals((p) => ({ ...p, [f.key]: v }))}
          />
        ))}
      </div>
      {results.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {results.map((r, i) => (
            <div
              key={i}
              className={`rounded-lg border p-4 ${r.accent ? 'border-brand/30 bg-brand/[0.06]' : 'border-slate-200 bg-white'}`}
            >
              <div className="text-xs text-slate-500">{r.label}</div>
              <div className={`mt-1 font-bold text-slate-900 ${r.accent ? 'text-3xl' : 'text-xl'}`}>{r.value}</div>
              {r.sub && <div className="mt-0.5 text-xs text-slate-500">{r.sub}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
