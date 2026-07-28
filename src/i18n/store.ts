// Plain (non-'use client') module: locale state + translation.
// Safe to import from both Server and Client Components.

import { defaultLocale, isLocale, locales, type Locale } from './config';
import { en } from './locales/en';
import { zh } from './locales/zh';

const dictionaries: Record<Locale, Record<string, unknown>> = { en, zh };

// Dotted-key lookup: 'categories.text.intro' -> dict.categories.text.intro
function lookup(dict: Record<string, unknown>, key: string): string | undefined {
  const val = key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, dict);
  return typeof val === 'string' ? val : undefined;
}

let currentLocale: Locale = defaultLocale;
const listeners = new Set<() => void>();

export function getLocale(): Locale {
  return currentLocale;
}

export function setLocaleValue(l: Locale): void {
  currentLocale = l;
  listeners.forEach((fn) => fn());
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Pure translation. Falls back to the English source, then `fallback`, then key.
// If `params` is provided, simple `{name}` tokens in the resolved string are
// replaced with `params[name]`. Unknown tokens are kept as literals so callers
// can tell which placeholders were not supplied.
export function translate(
  locale: Locale,
  key: string,
  fallback?: string,
  params?: Record<string, string | number>,
): string {
  let out: string | undefined;
  if (locale !== 'en') {
    out = lookup(dictionaries[locale], key);
  }
  if (out == null) out = lookup(en, key);
  if (out == null) out = fallback ?? key;
  if (params) {
    out = out.replace(/\{(\w+)\}/g, (m, k) =>
      k in params ? String(params[k]) : m,
    );
  }
  return out;
}

export function translateCurrent(key: string, fallback?: string, params?: Record<string, string | number>): string {
  return translate(currentLocale, key, fallback, params);
}

export { defaultLocale, isLocale, locales };
export type { Locale };
