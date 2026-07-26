'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n';
import { CATEGORIES } from '@/tools/categories';
import { SearchBox } from './search-box';
import { Menu, X, LayoutGrid } from 'lucide-react';

export function MobileNav() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <span className="text-base font-semibold text-slate-900">ToolHub</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="border-b border-slate-100 p-4">
              <SearchBox variant="full" autoFocus onNavigate={() => setOpen(false)} />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <Link
                href="/#tools"
                onClick={() => setOpen(false)}
                className="mb-4 flex items-center gap-2 rounded-lg bg-brand/[0.06] px-4 py-3 text-sm font-medium text-brand"
              >
                <LayoutGrid className="h-4 w-4" />
                {t('common.allTools', 'All Tools')}
              </Link>
              <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {t('common.discover', 'Discover')}
              </p>
              <ul className="space-y-1">
                {CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/categories/${c.slug}`}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-brand"
                    >
                      {t(`categories.${c.slug}.label`, c.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
