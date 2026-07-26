'use client';

import { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';
import { useI18n } from '@/i18n';

export default function UuidGeneratorClient() {
  const { t } = useI18n();
  const [count, setCount] = useState(5);
  const [upper, setUpper] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);

  const generate = () => {
    const n = Math.min(Math.max(count || 1, 1), 1000);
    const list = Array.from({ length: n }, () => {
      const id = crypto.randomUUID();
      return upper ? id.toUpperCase() : id;
    });
    setUuids(list);
  };

  const copy = async () => { if (uuids.length) await copyToClipboard(uuids.join('\n')); };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          {t('tools.uuid-generator.ui.quantity', 'Quantity')}
          <input
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-20 rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-brand"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} />
          {t('tools.uuid-generator.ui.uppercase', 'UPPERCASE')}
        </label>
        <button onClick={generate} className="rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark">{t('tools.uuid-generator.ui.generate', 'Generate')}</button>
        <button onClick={copy} disabled={!uuids.length} className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-700 hover:border-brand/30 hover:text-brand disabled:opacity-50">{t('tools.uuid-generator.ui.copyAll', 'Copy all')}</button>
      </div>
      {uuids.length > 0 && (
        <textarea
          readOnly
          value={uuids.join('\n')}
          className="h-48 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm text-slate-700"
        />
      )}
    </div>
  );
}
