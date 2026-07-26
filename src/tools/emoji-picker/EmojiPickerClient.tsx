'use client';

import { useMemo, useState } from 'react';
import { useI18n } from '@/i18n';

const GROUPS: { tKey: string; label: string; items: string[] }[] = [
  { tKey: 'tools.emoji-picker.ui.catSmileys', label: 'Smileys', items: ['😀', '😁', '😂', '🤣', '😊', '😍', '😎', '🤔', '😅', '🙃', '😴', '🥳', '😇', '🤩', '😉', '🤗'] },
  { tKey: 'tools.emoji-picker.ui.catHearts', label: 'Hearts', items: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💔', '💕', '💖', '💗', '💞', '💘', '❣️', '💝'] },
  { tKey: 'tools.emoji-picker.ui.catGestures', label: 'Gestures', items: ['👍', '👎', '👏', '🙌', '🤝', '✌️', '🤞', '👌', '🤙', '👋', '🙏', '💪', '🤌', '👉', '👀', '🫶'] },
  { tKey: 'tools.emoji-picker.ui.catAnimals', label: 'Animals', items: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁', '🐯', '🐸', '🐵', '🐔', '🐧', '🦄'] },
  { tKey: 'tools.emoji-picker.ui.catFood', label: 'Food', items: ['🍎', '🍌', '🍓', '🍕', '🍔', '🌮', '🍜', '🍣', '☕', '🍩', '🍪', '🎂', '🍰', '🍦', '🍉', '🥑'] },
  { tKey: 'tools.emoji-picker.ui.catWeather', label: 'Weather', items: ['☀️', '🌤️', '⛅', '🌧️', '⛈️', '🌩️', '❄️', '🌈', '⭐', '🌟', '💫', '⚡', '🔥', '🌊', '🌸', '🌍'] },
  { tKey: 'tools.emoji-picker.ui.catArrows', label: 'Arrows', items: ['←', '→', '↑', '↓', '↔', '↕', '↩', '↪', '⇐', '⇒', '⇑', '⇓', '➜', '➤', '⟶', '⤴'] },
  { tKey: 'tools.emoji-picker.ui.catCurrency', label: 'Currency', items: ['$', '€', '£', '¥', '¢', '₩', '₿', '₽', '₹', '₪', '₫', '₴', '₺', '¤', 'ƒ', '₦'] },
  { tKey: 'tools.emoji-picker.ui.catMath', label: 'Math', items: ['≈', '≠', '≡', '≤', '≥', '±', '×', '÷', '∑', '∏', '√', '∞', '∫', '∂', '∆', 'π'] },
  { tKey: 'tools.emoji-picker.ui.catSymbols', label: 'Symbols', items: ['★', '☆', '♦', '♣', '♥', '♠', '●', '○', '■', '□', '▲', '△', '◼', '◻', '✦', '✧'] },
  { tKey: 'tools.emoji-picker.ui.catPunctuation', label: 'Punctuation', items: ['“', '”', '‘', '’', '—', '–', '…', '•', '·', '†', '‡', '§', '¶', '©', '®', '™'] },
  { tKey: 'tools.emoji-picker.ui.catCheckCross', label: 'Check & Cross', items: ['✓', '✔', '✗', '✘', '☑', '☒', '⚠', '⚡', '☑', '⭕', '❌', '✅', '➕', '➖', '➗', '⁉'] },
];

export default function EmojiPickerClient() {
  const { t } = useI18n();
  const [q, setQ] = useState('');
  const [copied, setCopied] = useState('');

  const filtered = useMemo(() => {
    if (!q.trim()) return GROUPS;
    return GROUPS.filter((g) => g.label.toLowerCase().includes(q.toLowerCase()));
  }, [q]);

  const copy = (s: string) => {
    navigator.clipboard?.writeText(s);
    setCopied(s);
    setTimeout(() => setCopied(''), 1000);
  };

  return (
    <div className="space-y-4">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="input"
        placeholder={t('tools.emoji-picker.ui.search', 'Search categories…')}
      />
      {filtered.map((g) => (
        <div key={g.tKey}>
          <p className="mb-2 text-sm font-semibold text-slate-500">{t(g.tKey, g.label)}</p>
          <div className="flex flex-wrap gap-2">
            {g.items.map((it, i) => (
              <button
                key={i}
                onClick={() => copy(it)}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-brand/15 text-2xl hover:bg-brand/5"
                title={it}
              >
                {it}
              </button>
            ))}
          </div>
        </div>
      ))}
      {copied && <p className="text-sm text-brand">{t('tools.emoji-picker.ui.copied', 'Copied:')} {copied}</p>}
    </div>
  );
}
