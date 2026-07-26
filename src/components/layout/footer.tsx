'use client';

import Link from 'next/link';
import { CATEGORIES } from '@/tools/categories';
import type { ToolCategory } from '@/tools/types';
import { useI18n } from '@/i18n';

export function Footer() {
  const { t } = useI18n();
  const cats = CATEGORIES as { slug: ToolCategory; label: string }[];

  return (
    <footer className="border-t border-slate-100 bg-slate-50/50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <span className="text-sm font-semibold text-slate-900">ToolHub</span>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-500">
              {t('categories.footerTagline', 'Free, fast and private online tools for developers, marketers and creators. Everything runs in your browser — no upload, no signup.')}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">{t('categories.title', 'Tool Categories')}</h4>
            <ul className="mt-2 space-y-1.5">
              {cats.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/categories/${c.slug}`}
                    className="text-xs text-slate-500 transition-colors hover:text-slate-700"
                  >
                    {t(`categories.${c.slug}.label`, c.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">{t('categories.legal', 'Legal')}</h4>
            <ul className="mt-2 space-y-1.5">
              <li>
                <Link href="/privacy" className="text-xs text-slate-500 transition-colors hover:text-slate-700">
                  {t('categories.privacyPolicy', 'Privacy Policy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-xs text-slate-500 transition-colors hover:text-slate-700">
                  {t('categories.termsOfService', 'Terms of Service')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-xs text-slate-500 transition-colors hover:text-slate-700">
                  {t('categories.about', 'About')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} {t('categories.footerCopyright', 'ToolHub. All tools are free to use.')}
        </div>
      </div>
    </footer>
  );
}
