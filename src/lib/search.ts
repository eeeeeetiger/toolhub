// Search + personalization helpers for ToolHub's discovery layers.
// Safe to import from client components only (touches localStorage).

import { useEffect, useState } from 'react';
import type { ToolConfig } from '@/tools/types';
import { allTools } from '@/tools/registry';
import { CATEGORIES } from '@/tools/categories';

const RECENT_KEY = 'toolhub-recent';
const PINNED_KEY = 'toolhub-pinned';
const RECENT_MAX = 8;

function safeParse(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/* ----------------------------- localStorage ----------------------------- */

export function getRecentSlugs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return safeParse(window.localStorage.getItem(RECENT_KEY));
  } catch {
    return [];
  }
}

export function pushRecentSlug(slug: string): void {
  if (typeof window === 'undefined') return;
  const cur = getRecentSlugs().filter((s) => s !== slug);
  cur.unshift(slug);
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(cur.slice(0, RECENT_MAX)));
  } catch {
    /* quota / private mode — ignore */
  }
}

export function getPinnedSlugs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return safeParse(window.localStorage.getItem(PINNED_KEY));
  } catch {
    return [];
  }
}

export function togglePinnedSlug(slug: string): string[] {
  if (typeof window === 'undefined') return [];
  const cur = getPinnedSlugs();
  const next = cur.includes(slug) ? cur.filter((s) => s !== slug) : [slug, ...cur];
  try {
    window.localStorage.setItem(PINNED_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

/* ------------------------------ search ------------------------------ */

// Cross-component re-render hook: when a tool is pinned/unpinned or recent
// changes in one place, every subscriber refreshes its local-storage reads.
const storageListeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === RECENT_KEY || e.key === PINNED_KEY) storageListeners.forEach((fn) => fn());
  });
}

/** Call inside a component to re-render when pinned/recent storage changes. */
export function usePersonalization(): void {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const fn = () => setTick((n) => n + 1);
    storageListeners.add(fn);
    return () => {
      storageListeners.delete(fn);
    };
  }, [tick]);
}

export interface SearchHit {
  tool: ToolConfig;
  score: number;
}

const categoryLabel: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, `${c.label} ${c.short} ${c.description}`]),
);

// Weighted, token-based search over name / description / keywords / category.
// Returns hits sorted by score (highest first).
export function searchTools(query: string, limit = 24): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  const scored: SearchHit[] = [];
  for (const tool of allTools) {
    const haystacks: [string, number][] = [
      [tool.name, 10],
      [tool.description, 3],
      [tool.keywords.join(' '), 5],
      [categoryLabel[tool.category] ?? '', 2],
    ];
    let score = 0;
    const name = tool.name.toLowerCase();
    const full = haystacks.map(([s]) => s.toLowerCase()).join(' ');
    for (const term of terms) {
      if (name === term) score += 30;
      else if (name.startsWith(term)) score += 18;
      else if (name.includes(term)) score += 10;
      // exact keyword match is strong (covers "pdf", "qr" etc.)
      if (tool.keywords.some((k) => k.toLowerCase() === term)) score += 12;
      if (full.includes(term)) {
        for (const [text, weight] of haystacks) {
          if (text.toLowerCase().includes(term)) score += weight;
        }
      }
    }
    if (score > 0) scored.push({ tool, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

// Pull N random tools, optionally excluding a set (used by "Discover / Hidden gems").
export function pickHiddenGems(count: number, exclude: Set<string> = new Set()): ToolConfig[] {
  const pool = allTools.filter((t) => !exclude.has(t.slug));
  // Fisher–Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}
