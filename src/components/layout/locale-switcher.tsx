'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/i18n';
import { localeLabels, type Locale } from '@/i18n/config';
import { Globe } from 'lucide-react';

export function LocaleSwitcher() {
  const { locale, locales, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change language"
        className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{localeLabels[locale]}</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-36 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {locales.map((l: Locale) => (
            <button
              key={l}
              type="button"
              onClick={() => {
                setLocale(l);
                setOpen(false);
              }}
              className={`block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-slate-100 ${
                l === locale ? 'font-semibold text-brand' : 'text-slate-600'
              }`}
            >
              {localeLabels[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
