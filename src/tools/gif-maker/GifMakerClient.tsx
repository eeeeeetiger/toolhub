'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useI18n } from '@/i18n';
import {
  encodeGif,
  applyTextToFrames,
  resizeImageData,
  downloadBlob,
  frameToCanvas,
  type GifFrame,
  type MemeTextConfig,
} from '@/lib/gif';

interface FontOption {
  label: string;
  value: string;
}

// 跨平台常用字体回退列表（浏览器不支持枚举本机字体时使用）
const FALLBACK_FONTS: FontOption[] = [
  { label: '系统默认', value: 'sans-serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Arial Black', value: '"Arial Black", sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman", serif' },
  { label: 'Courier New（等宽）', value: '"Courier New", monospace' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Comic Sans MS', value: '"Comic Sans MS", cursive' },
  { label: 'Impact', value: 'Impact, "Arial Black", sans-serif' },
  { label: 'Tahoma', value: 'Tahoma, sans-serif' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
  { label: 'Microsoft YaHei（微软雅黑）', value: '"Microsoft YaHei", sans-serif' },
  { label: 'SimSun（宋体）', value: 'SimSun, serif' },
  { label: 'SimHei（黑体）', value: 'SimHei, sans-serif' },
  { label: 'Microsoft JhengHei（微軟正黑體）', value: '"Microsoft JhengHei", sans-serif' },
  { label: 'Segoe UI', value: '"Segoe UI", sans-serif' },
  { label: 'Calibri', value: 'Calibri, sans-serif' },
  { label: 'Consolas（等宽）', value: 'Consolas, monospace' },
  { label: 'PingFang SC（苹方）', value: '"PingFang SC", sans-serif' },
  { label: 'Hiragino Sans GB（冬青黑体）', value: '"Hiragino Sans GB", sans-serif' },
];

interface ImgItem {
  id: number;
  url: string;
  image: HTMLImageElement;
}

export default function GifMakerClient() {
  const { t } = useI18n();
  const [items, setItems] = useState<ImgItem[]>([]);
  const [delay, setDelay] = useState(500);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const idRef = useRef(0);
  const previewRef = useRef<HTMLCanvasElement>(null);

  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [fontFamily, setFontFamily] = useState('Impact, "Arial Black", sans-serif');
  const [fontList, setFontList] = useState<FontOption[]>(FALLBACK_FONTS);
  const [fontLoadError, setFontLoadError] = useState<string | null>(null);
  const [fontScale, setFontScale] = useState(0.09);
  const [textColor, setTextColor] = useState('#ffffff');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(4);

  const cfg = (): MemeTextConfig => ({
    topText: topText.trim(),
    bottomText: bottomText.trim(),
    fontFamily,
    fontScale,
    textColor,
    strokeColor,
    strokeWidth,
  });

  const reloadSystemFonts = async () => {
    try {
      if (typeof window === 'undefined' || !('queryLocalFonts' in window)) {
        setFontLoadError(
          t('tools.gif-maker.ui.fontNoApi', 'Your browser cannot read system fonts; common fonts are shown instead.'),
        );
        return;
      }
      // @ts-ignore queryLocalFonts 为较新浏览器 API，部分 TS 版本未收录
      const fonts = await window.queryLocalFonts();
      const families = Array.from(new Set(fonts.map((f: { family: string }) => f.family))) as string[];
      families.sort((a, b) => a.localeCompare(b));
      setFontList([{ label: '系统默认', value: 'sans-serif' }, ...families.map((f) => ({ label: f, value: `"${f}"` }))]);
      setFontLoadError(null);
    } catch {
      setFontLoadError(
        t('tools.gif-maker.ui.fontDenied', 'Could not read system fonts (permission denied). Common fonts still available.'),
      );
    }
  };

  // 进入页面时自动尝试读取本机字体（需授权；失败则保留常用字体，不报错）
  useEffect(() => {
    (async () => {
      try {
        if (typeof window !== 'undefined' && 'queryLocalFonts' in window) {
          // @ts-ignore queryLocalFonts 为较新浏览器 API，部分 TS 版本未收录
          const fonts = await window.queryLocalFonts();
          const families = Array.from(new Set(fonts.map((f: { family: string }) => f.family))) as string[];
          families.sort((a, b) => a.localeCompare(b));
          setFontList([{ label: '系统默认', value: 'sans-serif' }, ...families.map((f) => ({ label: f, value: `"${f}"` }))]);
        }
      } catch {
        /* 自动读取失败则保留常用字体 */
      }
    })();
  }, []);

  const onFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setError(null);
    setOutUrl(null);
    const loaded: ImgItem[] = [];
    for (const f of files) {
      if (!f.type.startsWith('image/')) continue;
      const url = URL.createObjectURL(f);
      const image = await loadImage(url);
      loaded.push({ id: idRef.current++, url, image });
    }
    setItems((prev) => [...prev, ...loaded]);
  };

  const removeAt = (id: number) => setItems((prev) => prev.filter((it) => it.id !== id));
  const move = (index: number, dir: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev];
      const j = index + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  };

  const buildFrames = (): GifFrame[] => {
    if (!items.length) return [];
    const maxW = Math.max(...items.map((it) => it.image.naturalWidth));
    const maxH = Math.max(...items.map((it) => it.image.naturalHeight));
    const frames: GifFrame[] = items.map((it) => {
      const c = document.createElement('canvas');
      c.width = maxW;
      c.height = maxH;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, maxW, maxH);
      ctx.drawImage(it.image, 0, 0, maxW, maxH);
      return { imageData: ctx.getImageData(0, 0, maxW, maxH), delay };
    });
    return applyTextToFrames(frames, cfg());
  };

  const renderPreview = () => {
    const frames = buildFrames();
    const cv = previewRef.current;
    if (!frames.length || !cv) return;
    const src = frameToCanvas(frames[0]);
    cv.width = src.width;
    cv.height = src.height;
    cv.getContext('2d')!.drawImage(src, 0, 0);
  };

  const exportGif = async () => {
    if (!items.length) return;
    setProcessing(true);
    setProgress(0);
    setOutUrl(null);
    try {
      const frames = buildFrames();
      const blob = await encodeGif(frames, {
        width: frames[0].imageData.width,
        height: frames[0].imageData.height,
        quality: 10,
        onProgress: setProgress,
      });
      setOutUrl(URL.createObjectURL(blob));
    } catch {
      setError(t('tools.gif-maker.ui.exportFail', 'Failed to create GIF.'));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block cursor-pointer rounded-lg border border-dashed border-brand/30 px-4 py-6 text-center text-sm text-brand hover:bg-brand/5">
        {t('tools.gif-maker.ui.upload', 'Choose images (static)')}
        <input type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />
      </label>
      {error && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      {items.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {items.map((it, i) => (
              <div key={it.id} className="relative rounded border border-slate-200 p-1">
                <img src={it.url} alt="" className="h-20 w-full rounded object-cover" />
                <span className="absolute left-1 top-1 rounded bg-black/60 px-1 text-xs text-white">{i + 1}</span>
                <div className="mt-1 flex justify-between text-xs">
                  <button onClick={() => move(i, -1)} className="px-1 text-slate-500 hover:text-brand">↑</button>
                  <button onClick={() => move(i, 1)} className="px-1 text-slate-500 hover:text-brand">↓</button>
                  <button onClick={() => removeAt(it.id)} className="px-1 text-red-500">✕</button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 rounded-lg border border-slate-200 p-3">
            <p className="text-sm font-semibold text-slate-700">{t('tools.gif-maker.ui.text', 'Meme text (all frames)')}</p>
            <input
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              placeholder={t('tools.gif-maker.ui.top', 'Top text')}
              className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              placeholder={t('tools.gif-maker.ui.bottom', 'Bottom text')}
              className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
            />
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs text-slate-500">{t('tools.gif-maker.ui.font', 'Font')}</label>
                <button
                  type="button"
                  onClick={reloadSystemFonts}
                  className="text-xs font-medium text-brand hover:underline"
                >
                  {t('tools.gif-maker.ui.fontReload', 'Load system fonts')}
                </button>
              </div>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full rounded border border-slate-200 px-2 py-1 text-sm"
              >
                {fontList.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
              {fontLoadError && <p className="text-xs text-amber-600">{fontLoadError}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-500">{t('tools.gif-maker.ui.color', 'Text')}</label>
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-9 w-full rounded border border-slate-200" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500">{t('tools.gif-maker.ui.outline', 'Outline')}</label>
                <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} className="h-9 w-full rounded border border-slate-200" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500">{t('tools.gif-maker.ui.stroke', 'Stroke')}: {strokeWidth}</label>
                <input type="range" min={0} max={12} value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))} className="w-full" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-500">{t('tools.gif-maker.ui.size', 'Text size')}: {Math.round(fontScale * 100)}%</label>
              <input type="range" min={0.04} max={0.2} step={0.01} value={fontScale} onChange={(e) => setFontScale(Number(e.target.value))} className="w-full" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">{t('tools.gif-maker.ui.delay', 'Frame delay')}</span>
              <input type="range" min={50} max={2000} step={50} value={delay} onChange={(e) => setDelay(Number(e.target.value))} className="w-40" />
              <span className="text-slate-500">{delay}ms</span>
            </div>
            <button onClick={exportGif} disabled={processing} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-50">
              {processing ? t('tools.gif-maker.ui.processing', 'Processing…') : t('tools.gif-maker.ui.export', 'Create GIF')}
            </button>
            {outUrl && (
              <>
                <img src={outUrl} alt="result" className="max-h-24 rounded bg-slate-100" />
                <a href={outUrl} download="made.gif" className="rounded-lg border border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-brand/5">{t('tools.gif-maker.ui.download', 'Download')}</a>
                <button onClick={() => outUrl && downloadBlobURL(outUrl)} className="rounded-lg border border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-brand/5">{t('tools.gif-maker.ui.save', 'Save')}</button>
              </>
            )}
          </div>
          {processing && (
            <div className="h-2 w-full overflow-hidden rounded bg-slate-100">
              <div className="h-full bg-brand transition-all" style={{ width: `${Math.round(progress * 100)}%` }} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = url;
  });
}

function downloadBlobURL(url: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = 'made.gif';
  a.click();
}
