'use client';

import { useState } from 'react';
import type { ConverterDef } from './conversions';
import { convertTemp, convertUnit } from './tool-logic';

export default function UnitConverterShell({ def }: { def: ConverterDef }) {
  const [fromU, setFromU] = useState(def.units[0].key);
  const [toU, setToU] = useState(def.units[1]?.key ?? def.units[0].key);
  const [value, setValue] = useState('1');

  const toLabel = def.units.find((u) => u.key === toU)?.label ?? '';
  const v = parseFloat(value);
  let result = '';
  if (!isNaN(v)) {
    if (def.special === 'temperature') {
      result = convertTemp(v, fromU, toU).toLocaleString(undefined, { maximumFractionDigits: 4 });
    } else {
      result = convertUnit(def.units, v, fromU, toU).toLocaleString(undefined, { maximumFractionDigits: 6 });
    }
  }

  function swap() {
    setFromU(toU);
    setToU(fromU);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <label className="mb-1 block text-sm text-slate-600">Value</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
        />
        <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-end gap-3">
          <div>
            <label className="mb-1 block text-xs text-slate-500">From</label>
            <select
              value={fromU}
              onChange={(e) => setFromU(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand focus:outline-none"
            >
              {def.units.map((u) => (
                <option key={u.key} value={u.key}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={swap}
            className="mb-0.5 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 transition hover:border-brand/40"
            aria-label="Swap"
          >
            ⇄
          </button>
          <div>
            <label className="mb-1 block text-xs text-slate-500">To</label>
            <select
              value={toU}
              onChange={(e) => setToU(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand focus:outline-none"
            >
              {def.units.map((u) => (
                <option key={u.key} value={u.key}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {!isNaN(v) && (
        <div className="rounded-xl border border-brand/30 bg-brand/[0.06] p-6 text-center">
          <div className="text-sm text-slate-500">
            {value} {def.units.find((u) => u.key === fromU)?.label.split(' ')[0]} =
          </div>
          <div className="mt-1 text-3xl font-bold text-slate-900">{result}</div>
          <div className="mt-1 text-sm text-slate-500">{toLabel}</div>
        </div>
      )}
    </div>
  );
}
