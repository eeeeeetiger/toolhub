'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/i18n';
import { searchTools, type SearchHit } from '@/lib/search';
import {
  Search as SearchIcon,
  CornerDownLeft,
  Star,
} from 'lucide-react';

export function SearchBox({
  variant = 'bar',
  autoFocus = false,
  onNavigate,
}: {
  variant?: 'bar' | 'full';
  autoFocus?: boolean;
  onNavigate?: () => void;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  const hits: SearchHit[] = q.trim() ? searchTools(q, 8) : [];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const go = (path: string) => {
    setOpen(false);
    onNavigate?.();
    router.push(path);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (query) go(`/search?q=${encodeURIComponent(query)}`);
  };

  const isBar = variant === 'bar';

  return (
    <div ref={boxRef} className={isBar ? 'relative w-full max-w-md sm:max-w-lg' : 'relative w-full'}>
      <form onSubmit={submit} role="search">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            autoFocus={autoFocus}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
              setActive(0);
            }}
            onFocus={() => q && setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, hits.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === 'Escape') {
                setOpen(false);
              }
            }}
            placeholder={t('common.searchPlaceholder', 'Search 130+ tools…')}
            aria-label={t('common.search', 'Search')}
            className={`w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-brand/40 focus:bg-white focus:ring-2 focus:ring-brand/10 ${
              isBar ? 'py-1.5' : 'py-3'
            }`}
          />
        </div>
      </form>

      {open && q.trim() && (
        <div
          className={`absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 ${
            isBar ? '' : 'max-h-[70vh] overflow-y-auto'
          }`}
        >
          {hits.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-slate-400">
              {t('common.noResults', `No tools match “${q}”.`).replace('{q}', q)}
            </div>
          ) : (
            <ul className="py-1">
              {hits.map((h, i) => (
                <li key={h.tool.slug}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(`/tools/${h.tool.slug}`)}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors ${
                      i === active ? 'bg-brand/[0.06]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <SearchIcon className="h-4 w-4 shrink-0 text-slate-300" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-800">
                        {t(`tools.${h.tool.slug}.name`, h.tool.name)}
                      </span>
                      <span className="block truncate text-xs text-slate-400">
                        {t(`tools.${h.tool.slug}.description`, h.tool.description)}
                      </span>
                    </span>
                    {i === active && (
                      <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={() => go(`/search?q=${encodeURIComponent(q.trim())}`)}
            className="flex w-full items-center gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-2.5 text-sm font-medium text-brand transition-colors hover:bg-slate-100"
          >
            <Star className="h-4 w-4" />
            {t('common.allResults', 'See all results')} →
          </button>
        </div>
      )}
    </div>
  );
}
