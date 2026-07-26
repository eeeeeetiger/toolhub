'use client';

import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from 'react';
import { useI18n } from '@/i18n';

function hsvToRgb(h: number, s: number, v: number) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function rgbToHsv(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h, s, v: max };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

const toHex = (r: number, g: number, b: number) =>
  '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('').toUpperCase();

export default function ColorPickerClient() {
  const { t } = useI18n();
  const [hue, setHue] = useState(210);
  const [sat, setSat] = useState(0.6);
  const [val, setVal] = useState(0.9);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const sqRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const imgCanvasRef = useRef<HTMLCanvasElement>(null);

  const rgb = hsvToRgb(hue, sat, val);
  const hex = toHex(rgb.r, rgb.g, rgb.b);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  useEffect(() => {
    const cv = sqRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const { width: w, height: hgt } = cv;
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(0, 0, w, hgt);
    const white = ctx.createLinearGradient(0, 0, w, 0);
    white.addColorStop(0, '#fff');
    white.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = white;
    ctx.fillRect(0, 0, w, hgt);
    const black = ctx.createLinearGradient(0, 0, 0, hgt);
    black.addColorStop(0, 'rgba(0,0,0,0)');
    black.addColorStop(1, '#000');
    ctx.fillStyle = black;
    ctx.fillRect(0, 0, w, hgt);
  }, [hue]);

  const onSquare = (e: MouseEvent<HTMLCanvasElement>) => {
    const cv = sqRef.current!;
    const rect = cv.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setSat(Math.min(1, Math.max(0, x)));
    setVal(Math.min(1, Math.max(0, 1 - y)));
  };

  const onImagePick = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImgSrc(URL.createObjectURL(f));
  };

  const onImageClick = (e: MouseEvent<HTMLImageElement>) => {
    const img = imgRef.current;
    const cv = imgCanvasRef.current;
    if (!img || !cv) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * img.naturalWidth);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * img.naturalHeight);
    const ctx = cv.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(x, y, 1, 1).data;
    const hsv = rgbToHsv(d[0], d[1], d[2]);
    setHue(hsv.h);
    setSat(hsv.s);
    setVal(hsv.v);
  };

  const palettes = [
    { key: 'complementary', label: t('tools.color-picker.ui.complementary', 'Complementary'), hues: [hue, (hue + 180) % 360] },
    { key: 'analogous', label: t('tools.color-picker.ui.analogous', 'Analogous'), hues: [hue, (hue + 30) % 360, (hue + 330) % 360] },
    { key: 'triadic', label: t('tools.color-picker.ui.triadic', 'Triadic'), hues: [hue, (hue + 120) % 360, (hue + 240) % 360] },
  ];

  const copy = (s: string) => navigator.clipboard?.writeText(s);

  const swatch = (h: number) => {
    const c = hsvToRgb(h, 0.7, 0.9);
    return toHex(c.r, c.g, c.b);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-brand/15 bg-white p-5 dark:bg-slate-900">
          <canvas
            ref={sqRef}
            width={260}
            height={180}
            className="w-full cursor-crosshair rounded-lg"
            onClick={onSquare}
          />
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={360}
              value={hue}
              onChange={(e) => setHue(Number(e.target.value))}
              className="flex-1"
              style={{
                background:
                  'linear-gradient(to right,red,#ff0,#0f0,#0ff,#00f,#f0f,red)',
              }}
            />
            <span className="w-10 text-sm tabular-nums">{hue}°</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['HEX', 'RGB', 'HSL'] as const).map((k) => {
              const val =
                k === 'HEX'
                  ? hex
                  : k === 'RGB'
                    ? `${rgb.r}, ${rgb.g}, ${rgb.b}`
                    : `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;
              return (
                <button
                  key={k}
                  onClick={() => copy(val)}
                  className="rounded-lg border border-brand/20 px-3 py-1.5 text-sm font-mono hover:bg-brand/5"
                  title={t('common.copy', 'Copy')}
                >
                  {k}: {val}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-brand/15 bg-white p-5 dark:bg-slate-900">
          <label className="block cursor-pointer rounded-lg border border-dashed border-brand/30 px-4 py-3 text-center text-sm text-brand hover:bg-brand/5">
            {t('tools.color-picker.ui.upload', 'Upload image to sample colors')}
            <input type="file" accept="image/*" className="hidden" onChange={onImagePick} />
          </label>
          {imgSrc && (
            <>
              <img
                ref={imgRef}
                src={imgSrc}
                alt={t('tools.color-picker.ui.sampledImage', 'Sampled image')}
                className="max-h-48 w-full cursor-crosshair rounded-lg object-contain"
                onClick={onImageClick}
              />
              <canvas ref={imgCanvasRef} className="hidden" />
            </>
          )}
          <div
            className="h-16 w-full rounded-lg border border-brand/15"
            style={{ background: hex }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">{t('tools.color-picker.ui.palettes', 'Palettes')}</h3>
        {palettes.map((p) => (
          <div key={p.key} className="flex items-center gap-3">
            <span className="w-28 text-sm text-slate-500">{p.label}</span>
            <div className="flex flex-1 gap-2">
              {p.hues.map((h, i) => {
                const c = swatch(h);
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setHue(h);
                      setSat(0.7);
                      setVal(0.9);
                    }}
                    title={c}
                    className="h-9 flex-1 rounded-lg border border-brand/15"
                    style={{ background: c }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
