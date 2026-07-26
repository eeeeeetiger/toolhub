'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/i18n';

function pad(n: number) { return String(n).padStart(2, '0'); }

function toLocalInput(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function TimestampConverterClient() {
  const { t } = useI18n();
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));
  const [ts, setTs] = useState(String(Math.floor(Date.now() / 1000)));
  const [unit, setUnit] = useState<'s' | 'ms'>('s');
  const [dateStr, setDateStr] = useState(() => toLocalInput(new Date()));

  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const parsed = (() => {
    const raw = parseFloat(ts);
    if (isNaN(raw)) return null;
    const ms = unit === 's' ? raw * 1000 : raw;
    const d = new Date(ms);
    if (isNaN(d.getTime())) return null;
    return d;
  })();

  const fromDate = (() => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return { s: Math.floor(d.getTime() / 1000), ms: d.getTime() };
  })();

  const row = (label: string, value: string) => (
    <div className="flex flex-col gap-0.5 rounded-lg bg-slate-50 p-3">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="font-mono text-sm text-slate-900">{value}</span>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-lg border border-brand/30 bg-brand/[0.05] p-3">
        <span className="text-sm text-slate-600">{t('tools.timestamp-converter.ui.currentTs', 'Current Unix timestamp')}</span>
        <span className="font-mono text-lg font-semibold text-brand">{now}</span>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-900">{t('tools.timestamp-converter.ui.tsToDate', 'Timestamp → Date')}</h3>
        <div className="flex gap-2">
          <input
            value={ts} onChange={(e) => setTs(e.target.value)}
            className="flex-1 rounded-lg border border-slate-200 p-2.5 font-mono text-sm text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          />
          <select value={unit} onChange={(e) => setUnit(e.target.value as 's' | 'ms')}
            className="rounded-lg border border-slate-200 p-2.5 text-sm text-slate-700 outline-none focus:border-brand">
            <option value="s">{t('tools.timestamp-converter.ui.seconds', 'Seconds')}</option>
            <option value="ms">{t('tools.timestamp-converter.ui.ms', 'Milliseconds')}</option>
          </select>
        </div>
        {parsed && (
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {row(t('tools.timestamp-converter.ui.local', 'Local time'), parsed.toString())}
            {row('UTC / ISO 8601', parsed.toISOString())}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-900">{t('tools.timestamp-converter.ui.dateToTs', 'Date → Timestamp')}</h3>
        <input
          type="datetime-local" step={1} value={dateStr} onChange={(e) => setDateStr(e.target.value)}
          className="w-full rounded-lg border border-slate-200 p-2.5 text-sm text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
        />
        {fromDate && (
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {row(t('tools.timestamp-converter.ui.seconds', 'Seconds'), String(fromDate.s))}
            {row(t('tools.timestamp-converter.ui.ms', 'Milliseconds'), String(fromDate.ms))}
          </div>
        )}
      </div>
    </div>
  );
}
