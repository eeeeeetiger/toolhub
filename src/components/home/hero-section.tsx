'use client';

import Link from 'next/link';
import { useI18n } from '@/i18n';
import { SearchBox } from '@/components/layout/search-box';
import { allTools } from '@/tools/registry';

export function HeroSection() {
  const { t } = useI18n();
  const count = allTools.length;
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand/[0.04] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-300/[0.06] blur-3xl" />
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern id="dot-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#CBD5E1" opacity="0.25" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-grid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-3xl px-6 py-16 text-center sm:py-20">
        <span className="inline-block rounded-full border border-brand/20 bg-brand/[0.04] px-4 py-1.5 text-xs font-medium tracking-wide text-brand">
          {t('brand.badge', 'Free · Private · No Signup')}
        </span>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          {t('brand.heroTitle', 'Free Online Tools for Everyday Tasks')}
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-500">
          {t(
            'brand.heroSubtitle',
            'Convert, compress, edit and create — PDF, video, audio, images and more. Everything runs on your device: fast, private and always free.',
          )}
        </p>

        <div className="mx-auto mt-8 max-w-xl">
          <SearchBox variant="full" />
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-400">
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            {t('common.noUpload', 'No Upload')}
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            {t('common.freeForever', 'Free Forever')}
          </span>
          <Link href="#tools" className="font-medium text-brand hover:text-brand-dark">
            {t('common.browseTools', `Browse ${count} tools →`)}
          </Link>
        </div>
      </div>
    </section>
  );
}
