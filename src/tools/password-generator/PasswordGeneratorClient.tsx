'use client';

import { useCallback, useEffect, useState } from 'react';
import { useI18n } from '@/i18n';
import {
  PW_SYMBOLS,
  buildPasswordPool,
  passwordEntropy,
  secureRandomInt,
} from '../_shared/tool-logic';

export default function PasswordGeneratorClient() {
  const { t } = useI18n();
  const [length, setLength] = useState(16);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [noAmbiguous, setNoAmbiguous] = useState(false);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const pool = buildPasswordPool({ lower, upper, digits, symbols, noAmbiguous });
    if (!pool) { setPassword(''); return; }
    let pw = '';
    for (let i = 0; i < length; i++) pw += pool[secureRandomInt(pool.length)];
    setPassword(pw);
    setCopied(false);
  }, [length, lower, upper, digits, symbols, noAmbiguous]);

  useEffect(() => { generate(); }, [generate]);

  const strength = (() => {
    let pool = 0;
    if (lower) pool += 26;
    if (upper) pool += 26;
    if (digits) pool += 10;
    if (symbols) pool += PW_SYMBOLS.length;
    const entropy = passwordEntropy(pool, password.length);
    if (entropy < 40) return { label: t('tools.password-generator.ui.weak', 'Weak'), color: 'bg-red-500', pct: 25 };
    if (entropy < 60) return { label: t('tools.password-generator.ui.fair', 'Fair'), color: 'bg-amber-500', pct: 50 };
    if (entropy < 80) return { label: t('tools.password-generator.ui.strong', 'Strong'), color: 'bg-lime-500', pct: 75 };
    return { label: t('tools.password-generator.ui.veryStrong', 'Very strong'), color: 'bg-emerald-500', pct: 100 };
  })();

  const copy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-brand" />
      {label}
    </label>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <input
          readOnly value={password}
          className="flex-1 bg-transparent font-mono text-lg text-slate-900 outline-none"
        />
        <button onClick={copy} className="rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition hover:opacity-90">
          {copied ? t('common.copied', 'Copied!') : t('common.copy', 'Copy')}
        </button>
        <button onClick={generate} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-brand">
          ↻
        </button>
      </div>

      <div>
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-slate-500">{t('tools.password-generator.ui.strength', 'Strength')}</span>
          <span className="font-medium text-slate-700">{strength.label}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: `${strength.pct}%` }} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">
          {t('tools.password-generator.ui.length', 'Length')}: {length}
        </label>
        <input type="range" min={4} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full accent-brand" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Toggle label={t('tools.password-generator.ui.lower', 'Lowercase (a-z)')} checked={lower} onChange={setLower} />
        <Toggle label={t('tools.password-generator.ui.upper', 'Uppercase (A-Z)')} checked={upper} onChange={setUpper} />
        <Toggle label={t('tools.password-generator.ui.digits', 'Numbers (0-9)')} checked={digits} onChange={setDigits} />
        <Toggle label={t('tools.password-generator.ui.symbols', 'Symbols (!@#)')} checked={symbols} onChange={setSymbols} />
        <Toggle label={t('tools.password-generator.ui.noAmbiguous', 'No look-alikes')} checked={noAmbiguous} onChange={setNoAmbiguous} />
      </div>
    </div>
  );
}
