'use client';

import { useEffect, type ReactNode } from 'react';
import { isLocale, STORAGE_KEY } from './config';
import { getLocale, setLocaleValue } from './store';

export function I18nProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Restore the saved locale once on mount. Because the store is reactive
    // (useSyncExternalStore), every component re-renders into the saved
    // language immediately — no reload required.
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved) && saved !== getLocale()) {
      setLocaleValue(saved);
    }
    document.documentElement.lang = getLocale() === 'zh' ? 'zh-CN' : 'en';
  }, []);

  return <>{children}</>;
}
