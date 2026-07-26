'use client';

import { useMemo, useState } from 'react';
import { useI18n } from '@/i18n';

// Each unit expressed as a factor to a base unit (multiply value * factor => base).
type Unit = { key: string; label: string; factor: number };
type Category = { key: string; label: string; units: Unit[]; base: string };

const CATEGORIES: Category[] = [
  {
    key: 'length', label: 'Length', base: 'm',
    units: [
      { key: 'mm', label: 'Millimeter (mm)', factor: 0.001 },
      { key: 'cm', label: 'Centimeter (cm)', factor: 0.01 },
      { key: 'm', label: 'Meter (m)', factor: 1 },
      { key: 'km', label: 'Kilometer (km)', factor: 1000 },
      { key: 'in', label: 'Inch (in)', factor: 0.0254 },
      { key: 'ft', label: 'Foot (ft)', factor: 0.3048 },
      { key: 'yd', label: 'Yard (yd)', factor: 0.9144 },
      { key: 'mi', label: 'Mile (mi)', factor: 1609.344 },
    ],
  },
  {
    key: 'weight', label: 'Weight', base: 'kg',
    units: [
      { key: 'mg', label: 'Milligram (mg)', factor: 1e-6 },
      { key: 'g', label: 'Gram (g)', factor: 0.001 },
      { key: 'kg', label: 'Kilogram (kg)', factor: 1 },
      { key: 't', label: 'Tonne (t)', factor: 1000 },
      { key: 'oz', label: 'Ounce (oz)', factor: 0.0283495 },
      { key: 'lb', label: 'Pound (lb)', factor: 0.453592 },
    ],
  },
  {
    key: 'area', label: 'Area', base: 'm²',
    units: [
      { key: 'cm2', label: 'cm²', factor: 0.0001 },
      { key: 'm2', label: 'm²', factor: 1 },
      { key: 'km2', label: 'km²', factor: 1e6 },
      { key: 'ha', label: 'Hectare (ha)', factor: 10000 },
      { key: 'ft2', label: 'ft²', factor: 0.092903 },
      { key: 'ac', label: 'Acre (ac)', factor: 4046.86 },
    ],
  },
  {
    key: 'volume', label: 'Volume', base: 'L',
    units: [
      { key: 'ml', label: 'Milliliter (ml)', factor: 0.001 },
      { key: 'l', label: 'Liter (L)', factor: 1 },
      { key: 'm3', label: 'm³', factor: 1000 },
      { key: 'tsp', label: 'Teaspoon (US)', factor: 0.00492892 },
      { key: 'tbsp', label: 'Tablespoon (US)', factor: 0.0147868 },
      { key: 'cup', label: 'Cup (US)', factor: 0.236588 },
      { key: 'galUS', label: 'Gallon (US)', factor: 3.78541 },
    ],
  },
  {
    key: 'speed', label: 'Speed', base: 'm/s',
    units: [
      { key: 'ms', label: 'm/s', factor: 1 },
      { key: 'kmh', label: 'km/h', factor: 0.277778 },
      { key: 'mph', label: 'mph', factor: 0.44704 },
      { key: 'kn', label: 'Knot (kn)', factor: 0.514444 },
    ],
  },
  {
    key: 'time', label: 'Time', base: 's',
    units: [
      { key: 'ms', label: 'Millisecond', factor: 0.001 },
      { key: 's', label: 'Second', factor: 1 },
      { key: 'min', label: 'Minute', factor: 60 },
      { key: 'h', label: 'Hour', factor: 3600 },
      { key: 'd', label: 'Day', factor: 86400 },
      { key: 'wk', label: 'Week', factor: 604800 },
    ],
  },
  {
    key: 'data', label: 'Data', base: 'B',
    units: [
      { key: 'b', label: 'Bit', factor: 0.125 },
      { key: 'B', label: 'Byte', factor: 1 },
      { key: 'KB', label: 'Kilobyte (KB)', factor: 1024 },
      { key: 'MB', label: 'Megabyte (MB)', factor: 1024 ** 2 },
      { key: 'GB', label: 'Gigabyte (GB)', factor: 1024 ** 3 },
      { key: 'TB', label: 'Terabyte (TB)', factor: 1024 ** 4 },
    ],
  },
];

function fmt(n: number): string {
  if (!isFinite(n)) return '—';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1e9 || abs < 1e-4) return n.toExponential(4);
  return parseFloat(n.toPrecision(8)).toString();
}

export default function UnitConverterClient() {
  const { t } = useI18n();
  const catLabelKey: Record<string, string> = {
    length: 'tools.unit-converter.ui.lengthLabel',
    weight: 'tools.unit-converter.ui.weightLabel',
    area: 'tools.unit-converter.ui.areaLabel',
    volume: 'tools.unit-converter.ui.volumeLabel',
    speed: 'tools.unit-converter.ui.speedLabel',
    time: 'tools.unit-converter.ui.timeLabel',
    data: 'tools.unit-converter.ui.dataLabel',
    temperature: 'tools.unit-converter.ui.temperatureLabel',
  };
  const unitKey = (cat: string, key: string) => `tools.unit-converter.ui.unit.${cat}.${key}`;
  const [catKey, setCatKey] = useState('length');
  const [value, setValue] = useState('1');
  const [fromKey, setFromKey] = useState('m');

  const category = CATEGORIES.find((c) => c.key === catKey)!;

  const results = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return [];
    // temperature handled separately below; here linear
    const fromUnit = category.units.find((u) => u.key === fromKey);
    if (!fromUnit) return [];
    const baseVal = v * fromUnit.factor;
    return category.units.map((u) => ({ key: u.key, label: u.label, value: baseVal / u.factor }));
  }, [value, category, fromKey]);

  // Temperature is non-linear → dedicated block
  const tempResults = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return null;
    let c: number;
    if (fromKey === 'C') c = v;
    else if (fromKey === 'F') c = (v - 32) * (5 / 9);
    else c = v - 273.15; // K
    return { C: c, F: c * (9 / 5) + 32, K: c + 273.15 };
  }, [value, fromKey]);

  const isTemp = catKey === 'temperature';

  const onCatChange = (key: string) => {
    setCatKey(key);
    if (key === 'temperature') setFromKey('C');
    else setFromKey(CATEGORIES.find((c) => c.key === key)!.base === 'm' ? 'm' : CATEGORIES.find((c) => c.key === key)!.units[0].key);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[...CATEGORIES.map((c) => ({ key: c.key, label: c.label })), { key: 'temperature', label: 'Temperature' }].map((c) => (
          <button
            key={c.key}
            onClick={() => onCatChange(c.key)}
            className={`rounded-lg border px-3 py-1.5 text-sm transition ${
              catKey === c.key ? 'border-brand bg-brand/[0.08] text-brand' : 'border-slate-200 text-slate-600 hover:border-brand/40'
            }`}
          >
            {t(catLabelKey[c.key], c.label)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">{t('common.input', 'Value')}</label>
          <input
            type="number" value={value} onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-lg border border-slate-200 p-2.5 text-sm text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">{t('tools.unit-converter.ui.from', 'From unit')}</label>
          <select
            value={fromKey} onChange={(e) => setFromKey(e.target.value)}
            className="w-full rounded-lg border border-slate-200 p-2.5 text-sm text-slate-700 outline-none focus:border-brand"
          >
            {isTemp
              ? (['C', 'F', 'K'] as const).map((k) => <option key={k} value={k}>{k === 'C' ? t('tools.unit-converter.ui.celsius', 'Celsius (°C)') : k === 'F' ? t('tools.unit-converter.ui.fahrenheit', 'Fahrenheit (°F)') : t('tools.unit-converter.ui.kelvin', 'Kelvin (K)')}</option>)
              : category.units.map((u) => <option key={u.key} value={u.key}>{t(unitKey(catKey, u.key), u.label)}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {isTemp && tempResults ? (
          [{ k: t('tools.unit-converter.ui.celsius', 'Celsius (°C)'), v: tempResults.C }, { k: t('tools.unit-converter.ui.fahrenheit', 'Fahrenheit (°F)'), v: tempResults.F }, { k: t('tools.unit-converter.ui.kelvin', 'Kelvin (K)'), v: tempResults.K }].map((r) => (
            <div key={r.k} className="rounded-lg bg-slate-50 p-3">
              <div className="text-lg font-semibold text-slate-900">{fmt(r.v)}</div>
              <div className="text-xs text-slate-500">{r.k}</div>
            </div>
          ))
        ) : (
          results.map((r) => (
            <div key={r.key} className={`rounded-lg p-3 ${r.key === fromKey ? 'bg-brand/[0.08]' : 'bg-slate-50'}`}>
              <div className="text-lg font-semibold text-slate-900">{fmt(r.value)}</div>
              <div className="text-xs text-slate-500">{t(unitKey(catKey, r.key), r.label)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
