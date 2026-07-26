'use client';

import { useState } from 'react';

const COLORS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Black', value: '#000000' },
  { name: 'Red', value: '#ff0000' },
  { name: 'Green', value: '#00ff00' },
  { name: 'Blue', value: '#0000ff' },
];

export default function DeadPixelTestClient() {
  const [color, setColor] = useState(COLORS[0]);

  return (
    <div className="space-y-5">
      <div
        className="flex h-64 items-center justify-center rounded-xl border-2 border-slate-200"
        style={{ backgroundColor: color.value }}
      >
        <span
          className="text-sm font-medium"
          style={{ color: color.value === '#000000' ? '#666' : '#999' }}
        >
          {color.name}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {COLORS.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => setColor(c)}
            className={`h-10 w-10 rounded-lg border-2 transition-transform ${
              color.name === c.name ? 'scale-110 border-brand' : 'border-slate-200'
            }`}
            style={{ backgroundColor: c.value }}
            aria-label={c.name}
          />
        ))}
      </div>
      <p className="text-xs text-slate-400">
        Switch between solid colors and look for pixels that stay dark or wrong-colored — those may be
        stuck or dead pixels. Use full-screen mode (F11) for the most accurate check.
      </p>
    </div>
  );
}
