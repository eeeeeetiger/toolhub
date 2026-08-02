'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/i18n';
import { LocaleSwitcher } from './locale-switcher';
import { SearchBox } from './search-box';
import { MobileNav } from './mobile-drawer';
import { SITE_NAME } from '@/lib/site';

export function Header() {
  const { t } = useI18n();
  const pathname = usePathname();
  // 首页 Hero 已有大搜索框，顶栏搜索只在首页隐藏，其他页面保留
  const isHome = pathname === '/' || pathname === '';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white shadow-sm shadow-brand/20 transition-transform group-hover:scale-105">
            OT
          </span>
          <span className="hidden text-lg font-semibold tracking-tight text-slate-900 sm:block">
            {SITE_NAME}
          </span>
        </Link>

        {/* Search — 首页隐藏（Hero 有大搜索框），其他页面显示；容器保留作布局占位 */}
        <div className="flex min-w-0 flex-1 justify-center md:px-4">
          {!isHome && <SearchBox variant="bar" />}
        </div>

        {/* Right actions — never shrink */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/blog"
            className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:block"
          >
            {t('common.blog', 'Blog')}
          </Link>
          <Link
            href="/#tools"
            className="hidden rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-dark sm:block"
          >
            {t('common.allTools', 'All Tools')}
          </Link>
          <LocaleSwitcher />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
