'use client';

// Client hook backed by a module-level store + useSyncExternalStore.
// Switching locale updates the store and every subscribed component
// re-renders instantly — NO page reload needed (this is an SSG site, so
// reloading would only re-fetch the English HTML and loop forever).

import { useSyncExternalStore } from 'react';
import { STORAGE_KEY, type Locale } from './config';
import {
  getLocale,
  setLocaleValue,
  subscribe,
  translate,
  locales,
} from './store';

export interface I18nContextValue {
  locale: Locale;
  locales: readonly Locale[];
  setLocale: (l: Locale) => void;
  /** Translate a key. Falls back to English source, then `fallback`, then to the key itself.
   *  If `params` is provided, simple `{name}` tokens are substituted with `params[name]`. */
  t: (key: string, fallback?: string, params?: Record<string, string | number>) => string;
}

export function useI18n(): I18nContextValue {
  // getLocale is used for both client and server snapshots so SSR/initial
  // client render stay in sync (no hydration mismatch).
  const locale = useSyncExternalStore(subscribe, getLocale, getLocale);
  return {
    locale,
    locales,
    setLocale: (l: Locale) => {
      setLocaleValue(l);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, l);
      }
    },
    t: (key: string, fallback?: string, params?: Record<string, string | number>) =>
      translate(locale, key, fallback, params),
  };
}

export { locales };
export type { Locale };
