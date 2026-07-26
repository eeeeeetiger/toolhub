'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useI18n } from '@/i18n';
import {
  decodeGif,
  decodeWebp,
  encodeGif,
  applyTextToFrames,
  imageDataToBlob,
  drawMemeText,
  downloadBlob,
  type DecodedGif,
  type MemeTextConfig,
} from '@/lib/gif';
import { encodeWebp } from '@/lib/webp';

interface FontOption {
  label: string;
  value: string;
}

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

export default function MemeGeneratorClient() {
  const { t } = useI18n();
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [decoded, setDecoded] = useState<DecodedGif | null>(null);
  const [isAnim, setIsAnim] = useState(false);
  const [srcType, setSrcType] = useState<string>('image/png');
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [outType, setOutType] = useState<string>('image/png');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
          t('tools.meme-generator.ui.fontNoApi', 'Your browser cannot read system fonts; common fonts are shown instead.'),
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
        t('tools.meme-generator.ui.fontDenied', 'Could not read system fonts (permission denied). Common fonts still available.'),
      );
    }
  };

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

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setError(null);
    setOutUrl(null);
    setDecoded(null);
    setImg(null);
    setIsAnim(false);
    setSrcType(f.type || 'image/png');
    const url = URL.createObjectURL(f);
    setSrcUrl(url);
    try {
      if (f.type === 'image/gif') {
        const d = await decodeGif(await f.arrayBuffer());
        if (!d.frames.length) throw new Error('no frames');
        setDecoded(d);
        setIsAnim(true);
        setOutType('image/gif');
      } else if (f.type === 'image/webp') {
        const d = await decodeWebp(await f.arrayBuffer());
        if (d.frames.length > 1) {
          setDecoded(d);
          setIsAnim(true);
          setOutType('image/webp');
        } else {
          const image = await loadImage(url);
          setImg(image);
          setOutType(f.type);
        }
      } else {
        const image = await loadImage(url);
        setImg(image);
        // 导出默认沿用原文件格式（仅当浏览器可编码该格式时）
        setOutType(f.type === 'image/jpeg' || f.type === 'image/png' || f.type === 'image/webp' ? f.type : 'image/png');
      }
    } catch {
      setError(t('tools.meme-generator.ui.loadFail', 'Could not load this image.'));
    }
  };

  const renderPreview = () => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d')!;
    if (isAnim && decoded) {
      const c = document.createElement('canvas');
      c.width = decoded.width;
      c.height = decoded.height;
      c.getContext('2d')!.putImageData(decoded.frames[0].imageData, 0, 0);
      cv.width = decoded.width;
      cv.height = decoded.height;
      ctx.drawImage(c, 0, 0);
      drawMemeText(ctx, cv.width, cv.height, cfg());
    } else if (img) {
      cv.width = img.naturalWidth;
      cv.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      drawMemeText(ctx, cv.width, cv.height, cfg());
    }
  };

  // 任意文字/字体/图片变化都实时刷新预览
  useEffect(() => {
    renderPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [srcUrl, img, decoded, isAnim, topText, bottomText, fontFamily, fontScale, textColor, strokeColor, strokeWidth]);

  const exportImage = async () => {
    const cv = canvasRef.current;
    if (!cv) return;
    setProcessing(true);
    try {
      if (isAnim && decoded) {
        const frames = applyTextToFrames(decoded.frames, cfg());
        let blob: Blob;
        if (srcType === 'image/gif') {
          blob = await encodeGif(frames, { width: decoded.width, height: decoded.height, quality: 10 });
        } else {
          blob = await encodeWebp(frames, { quality: 20 });
        }
        setOutUrl(URL.createObjectURL(blob));
        setOutType(srcType === 'image/gif' ? 'image/gif' : 'image/webp');
      } else if (img) {
        const blob = await imageDataToBlob(
          (() => {
            const c = document.createElement('canvas');
            c.width = img.naturalWidth;
            c.height = img.naturalHeight;
            const x = c.getContext('2d')!;
            x.drawImage(img, 0, 0);
            drawMemeText(x, c.width, c.height, cfg());
            return x.getImageData(0, 0, c.width, c.height);
          })(),
          outType,
        );
        setOutUrl(URL.createObjectURL(blob));
      }
    } catch {
      setError(t('tools.meme-generator.ui.exportFail', 'Failed to export.'));
    } finally {
      setProcessing(false);
    }
  };

  const hasContent = img || (isAnim && decoded);
  const outExt = isAnim ? (srcType === 'image/gif' ? 'gif' : 'webp') : outType.split('/')[1];

  return (
    <div className="space-y-4">
      <label className="block cursor-pointer rounded-lg border border-dashed border-brand/30 px-4 py-6 text-center text-sm text-brand hover:bg-brand/5">
        {t('tools.meme-generator.ui.upload', 'Choose an image or GIF')}
        <input type="file" accept="image/*" className="hidden" onChange={onFile} />
      </label>
      {error && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      {hasContent && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 rounded-lg border border-slate-200 p-3">
              <p className="text-sm font-medium text-slate-700">{t('tools.meme-generator.ui.original', 'Original')}</p>
              {srcUrl && <img src={srcUrl} alt="src" className="max-h-56 rounded bg-slate-100" />}
              {isAnim && <p className="text-xs text-brand">{t('tools.meme-generator.ui.animated', 'Animated — text applied to every frame')}</p>}
            </div>
            <div className="space-y-2 rounded-lg border border-slate-200 p-3">
              <p className="text-sm font-medium text-slate-700">{t('tools.meme-generator.ui.preview', 'Preview')}</p>
              <canvas ref={canvasRef} className="max-h-56 rounded bg-slate-100" />
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-slate-200 p-3">
            <input
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              placeholder={t('tools.meme-generator.ui.top', 'Top text')}
              className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              placeholder={t('tools.meme-generator.ui.bottom', 'Bottom text')}
              className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
            />
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs text-slate-500">{t('tools.meme-generator.ui.font', 'Font')}</label>
                <button type="button" onClick={reloadSystemFonts} className="text-xs font-medium text-brand hover:underline">
                  {t('tools.meme-generator.ui.fontReload', 'Load system fonts')}
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500">{t('tools.meme-generator.ui.color', 'Text')}</label>
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-9 w-full rounded border border-slate-200" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500">{t('tools.meme-generator.ui.outline', 'Outline')}</label>
                <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} className="h-9 w-full rounded border border-slate-200" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500">{t('tools.meme-generator.ui.stroke', 'Stroke')}: {strokeWidth}</label>
                <input type="range" min={0} max={12} value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))} className="w-full" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-500">{t('tools.meme-generator.ui.size', 'Text size')}: {Math.round(fontScale * 100)}%</label>
              <input type="range" min={0.04} max={0.2} step={0.01} value={fontScale} onChange={(e) => setFontScale(Number(e.target.value))} className="w-full" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!isAnim && (
              <select value={outType} onChange={(e) => setOutType(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-2 text-sm">
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPG</option>
                <option value="image/webp">WebP</option>
              </select>
            )}
            <button onClick={exportImage} disabled={processing} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-50">
              {processing ? t('tools.meme-generator.ui.processing', 'Processing…') : t('tools.meme-generator.ui.export', 'Export')}
            </button>
            {outUrl && (
              <>
                <img src={outUrl} alt="result" className="max-h-24 rounded bg-slate-100" />
                <a href={outUrl} download={`meme.${outExt}`} className="rounded-lg border border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-brand/5">
                  {t('tools.meme-generator.ui.download', 'Download')}
                </a>
                <button
                  onClick={() => outUrl && downloadBlobURL(outUrl, `meme.${outExt}`)}
                  className="rounded-lg border border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-brand/5"
                >
                  {t('tools.meme-generator.ui.save', 'Save')}
                </button>
              </>
            )}
          </div>
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

function downloadBlobURL(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}
