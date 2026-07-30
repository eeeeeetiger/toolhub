'use client';

import { useState, useRef, useEffect, useCallback, type DragEvent } from 'react';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/i18n';
import {
  Upload,
  Download,
  Loader2,
  Brush,
  Eraser,
  Undo2,
  Redo2,
  RotateCcw,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  Info,
  Layers,
  Scissors,
  User,
} from 'lucide-react';

type Status = 'idle' | 'processing' | 'done' | 'error';

const MAX_DIM = 1200;
const CHECKER_STYLE: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(45deg,#e2e8f0 25%,transparent 25%),linear-gradient(-45deg,#e2e8f0 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e2e8f0 75%),linear-gradient(-45deg,transparent 75%,#e2e8f0)',
  backgroundSize: '16px 16px',
  backgroundPosition: '0 0,0 8px,8px -8px,-8px 0',
};

function loadImg(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image load failed'));
    };
    img.src = url;
  });
}

function fitDims(w: number, h: number, max: number): { w: number; h: number } {
  if (w <= max && h <= max) return { w, h };
  const r = Math.min(max / w, max / h);
  return { w: Math.round(w * r), h: Math.round(h * r) };
}

export default function ImageCutoutClient() {
  const { t } = useI18n();
  const pathname = usePathname();
  const slug = (pathname || '').replace(/^\/tools\//, '').replace(/\/$/, '');
  const isPortrait = slug === 'portrait-cutout';

  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [imageReady, setImageReady] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [brushMode, setBrushMode] = useState<'restore' | 'erase'>('restore');
  const [brushSize, setBrushSize] = useState(40);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const thumbUrlRef = useRef<string | null>(null);

  const imgDataRef = useRef<ImageData | null>(null);
  const maskRef = useRef<Float32Array | null>(null);
  const origMaskRef = useRef<Float32Array | null>(null);
  const undoStackRef = useRef<Float32Array[]>([]);
  const redoStackRef = useRef<Float32Array[]>([]);
  const isDrawingRef = useRef(false);
  const imgWRef = useRef(0);
  const imgHRef = useRef(0);
  const fileRef = useRef<File | null>(null);

  const modelName = isPortrait
    ? t('tools.portrait-cutout.ui.modelName', 'MediaPipe Selfie Segmentation')
    : t('tools.ai-photo-cutout.ui.modelName', 'U2Net AI Model');
  const modelSize = isPortrait ? '~25 KB' : '~44 MB';

  useEffect(() => {
    return () => {
      undoStackRef.current = [];
      redoStackRef.current = [];
      if (thumbUrlRef.current) URL.revokeObjectURL(thumbUrlRef.current);
    };
  }, []);

  const renderResult = useCallback(() => {
    const canvas = canvasRef.current;
    const imgData = imgDataRef.current;
    const mask = maskRef.current;
    if (!canvas || !imgData || !mask) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const out = ctx.createImageData(imgData.width, imgData.height);
    const src = imgData.data;
    const dst = out.data;
    for (let i = 0; i < mask.length; i++) {
      const a = Math.max(0, Math.min(255, mask[i]));
      dst[i * 4] = src[i * 4];
      dst[i * 4 + 1] = src[i * 4 + 1];
      dst[i * 4 + 2] = src[i * 4 + 2];
      dst[i * 4 + 3] = a;
    }
    ctx.putImageData(out, 0, 0);
  }, []);

  const handleFile = async (file: File) => {
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|bmp|avif|svg|heic|heif)$/i.test(file.name);
    if (!isImage) {
      setError(t('tools.ai-photo-cutout.ui.notImage', 'Please upload an image file'));
      setStatus('error');
      return;
    }
    fileRef.current = file;
    setFileName(file.name);
    setImageReady(false);
    setStatus('idle');
    setError(null);

    if (thumbUrlRef.current) URL.revokeObjectURL(thumbUrlRef.current);
    const nextPreviewUrl = URL.createObjectURL(file);
    thumbUrlRef.current = nextPreviewUrl;
    setPreviewUrl(nextPreviewUrl);

    try {
      const img = await loadImg(file);
      if (!img.naturalWidth || !img.naturalHeight) {
        throw new Error('Image has zero dimensions');
      }
      const { w, h } = fitDims(img.naturalWidth, img.naturalHeight, MAX_DIM);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not available');
      ctx.drawImage(img, 0, 0, w, h);
      imgDataRef.current = ctx.getImageData(0, 0, w, h);
      imgWRef.current = w;
      imgHRef.current = h;
      maskRef.current = null;
      origMaskRef.current = null;
      undoStackRef.current = [];
      redoStackRef.current = [];
      setCanUndo(false);
      setCanRedo(false);
      setImageReady(true);
    } catch (e) {
      setError(
        t('tools.ai-photo-cutout.ui.loadError', 'Failed to load image: {reason}', {
          reason: e instanceof Error ? e.message : String(e),
        }),
      );
      setStatus('error');
    }
  };

  const startCutout = async () => {
    const imgData = imgDataRef.current;
    const file = fileRef.current;
    if (!imgData || !file) return;

    setStatus('processing');
    setError(null);

    try {
      let mask: Float32Array;

      if (isPortrait) {
        mask = await runMediaPipe(imgData);
      } else {
        mask = await runU2Net(file);
      }

      maskRef.current = mask;
      origMaskRef.current = mask.slice();
      undoStackRef.current = [];
      redoStackRef.current = [];
      setCanUndo(false);
      setCanRedo(false);
      renderResult();
      setStatus('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus('error');
    }
  };

  async function runU2Net(file: File): Promise<Float32Array> {
    const { removeBackground } = await import('@imgly/background-removal');
    const blob = await removeBackground(file, {
      output: { format: 'image/png' },
    });
    const url = URL.createObjectURL(blob);
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error('Result image load failed'));
      i.src = url;
    });
    URL.revokeObjectURL(url);
    const w = imgWRef.current;
    const h = imgHRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not available');
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h);
    const mask = new Float32Array(w * h);
    for (let i = 0; i < mask.length; i++) {
      mask[i] = data.data[i * 4 + 3];
    }
    return mask;
  }

  async function runMediaPipe(imgData: ImageData): Promise<Float32Array> {
    const w = imgData.width;
    const h = imgData.height;
    const vision = await import('@mediapipe/tasks-vision');
    const { FilesetResolver, ImageSegmenter } = vision;
    const fileset = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.0/wasm',
    );
    const segmenter = await ImageSegmenter.createFromOptions(fileset, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/1/selfie_segmenter.tflite',
        delegate: 'GPU',
      },
      runningMode: 'IMAGE',
      outputCategoryMask: false,
      outputConfidenceMasks: true,
    });

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not available');
    ctx.putImageData(imgData, 0, 0);

    const result = segmenter.segment(canvas);

    if (!result.confidenceMasks || result.confidenceMasks.length === 0) {
      segmenter.close();
      throw new Error('Segmentation produced no mask');
    }

    const personIdx = result.confidenceMasks.length > 1 ? 1 : 0;
    const personMask = result.confidenceMasks[personIdx];
    const maskArr = personMask.getAsFloat32Array();
    const mw = personMask.width;
    const mh = personMask.height;

    segmenter.close();

    const mask = new Float32Array(w * h);

    if (mw === w && mh === h) {
      for (let i = 0; i < mask.length; i++) {
        mask[i] = maskArr[i] * 255;
      }
    } else {
      const srcCanvas = document.createElement('canvas');
      srcCanvas.width = mw;
      srcCanvas.height = mh;
      const srcCtx = srcCanvas.getContext('2d');
      if (!srcCtx) throw new Error('Canvas not available');
      const srcImg = srcCtx.createImageData(mw, mh);
      for (let i = 0; i < maskArr.length; i++) {
        const v = Math.round(maskArr[i] * 255);
        srcImg.data[i * 4] = v;
        srcImg.data[i * 4 + 1] = v;
        srcImg.data[i * 4 + 2] = v;
        srcImg.data[i * 4 + 3] = 255;
      }
      srcCtx.putImageData(srcImg, 0, 0);
      const dstCanvas = document.createElement('canvas');
      dstCanvas.width = w;
      dstCanvas.height = h;
      const dstCtx = dstCanvas.getContext('2d');
      if (!dstCtx) throw new Error('Canvas not available');
      dstCtx.drawImage(srcCanvas, 0, 0, mw, mh, 0, 0, w, h);
      const dstData = dstCtx.getImageData(0, 0, w, h);
      for (let i = 0; i < mask.length; i++) {
        mask[i] = dstData.data[i * 4];
      }
    }

    return mask;
  }

  const getCanvasPos = (e: React.PointerEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const applyBrush = (x: number, y: number) => {
    const mask = maskRef.current;
    if (!mask) return;
    const w = imgWRef.current;
    const h = imgHRef.current;
    const r = brushSize / 2;
    const r2 = r * r;
    const x0 = Math.max(0, Math.floor(x - r));
    const x1 = Math.min(w - 1, Math.ceil(x + r));
    const y0 = Math.max(0, Math.floor(y - r));
    const y1 = Math.min(h - 1, Math.ceil(y + r));

    for (let py = y0; py <= y1; py++) {
      for (let px = x0; px <= x1; px++) {
        const dx = px - x;
        const dy = py - y;
        if (dx * dx + dy * dy <= r2) {
          const idx = py * w + px;
          mask[idx] = brushMode === 'restore' ? 255 : 0;
        }
      }
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (status !== 'done') return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    isDrawingRef.current = true;

    const mask = maskRef.current;
    if (!mask) return;
    undoStackRef.current.push(mask.slice());
    if (undoStackRef.current.length > 30) undoStackRef.current.shift();
    redoStackRef.current = [];
    setCanUndo(true);
    setCanRedo(false);

    const { x, y } = getCanvasPos(e);
    applyBrush(x, y);
    renderResult();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDrawingRef.current || status !== 'done') return;
    const { x, y } = getCanvasPos(e);
    applyBrush(x, y);
    renderResult();
  };

  const onPointerUp = () => {
    isDrawingRef.current = false;
  };

  const undo = () => {
    const stack = undoStackRef.current;
    if (!stack.length) return;
    const mask = maskRef.current;
    if (!mask) return;
    redoStackRef.current.push(mask.slice());
    maskRef.current = stack.pop()!;
    renderResult();
    setCanUndo(stack.length > 0);
    setCanRedo(true);
  };

  const redo = () => {
    const stack = redoStackRef.current;
    if (!stack.length) return;
    const mask = maskRef.current;
    if (!mask) return;
    undoStackRef.current.push(mask.slice());
    maskRef.current = stack.pop()!;
    renderResult();
    setCanUndo(true);
    setCanRedo(stack.length > 0);
  };

  const resetMask = () => {
    if (!origMaskRef.current) return;
    const mask = maskRef.current;
    if (!mask) return;
    undoStackRef.current.push(mask.slice());
    maskRef.current = origMaskRef.current.slice();
    redoStackRef.current = [];
    renderResult();
    setCanUndo(true);
    setCanRedo(false);
  };

  const downloadImage = (type: 'foreground' | 'background') => {
    const imgData = imgDataRef.current;
    const mask = maskRef.current;
    if (!imgData || !mask) return;

    const w = imgData.width;
    const h = imgData.height;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const out = ctx.createImageData(w, h);
    const src = imgData.data;
    for (let i = 0; i < mask.length; i++) {
      const a = Math.max(0, Math.min(255, mask[i]));
      const alpha = type === 'foreground' ? a : 255 - a;
      out.data[i * 4] = src[i * 4];
      out.data[i * 4 + 1] = src[i * 4 + 1];
      out.data[i * 4 + 2] = src[i * 4 + 2];
      out.data[i * 4 + 3] = alpha;
    }
    ctx.putImageData(out, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const base = fileName.replace(/\.[^.]+$/, '') || 'image';
      a.download = type === 'foreground' ? `${base}_foreground.png` : `${base}_background.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }, 'image/png');
  };

  const reset = () => {
    setStatus('idle');
    setError(null);
    setFileName('');
    setImageReady(false);
    setPreviewUrl(null);
    fileRef.current = null;
    imgDataRef.current = null;
    maskRef.current = null;
    origMaskRef.current = null;
    undoStackRef.current = [];
    redoStackRef.current = [];
    setCanUndo(false);
    setCanRedo(false);
    if (thumbUrlRef.current) {
      URL.revokeObjectURL(thumbUrlRef.current);
      thumbUrlRef.current = null;
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const hasImage = imageReady;
  const isReady = status === 'done';

  return (
    <div className="space-y-5">
      {/* Upload area */}
      {status === 'idle' && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
            dragOver ? 'border-brand bg-brand/5' : 'border-slate-300 bg-slate-50'
          }`}
        >
          {isPortrait ? (
            <User className="h-8 w-8 text-slate-400" />
          ) : (
            <Scissors className="h-8 w-8 text-slate-400" />
          )}
          <p className="text-sm text-slate-500">
            {isPortrait
              ? t('tools.portrait-cutout.ui.dropHint', 'Upload a portrait photo to cut out the person')
              : t('tools.ai-photo-cutout.ui.dropHint', 'Upload an image to remove the background')}
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
          >
            <Upload className="h-4 w-4" /> {t('common.upload', 'Upload Image')}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <p className="text-xs text-slate-400">
            {t('tools.ai-photo-cutout.ui.formats', 'JPG, PNG, WebP — processed locally, never uploaded')}
          </p>
        </div>
      )}

      {/* Model info */}
      {hasImage && status === 'idle' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <img
              src={previewUrl ?? undefined}
              alt=""
              className="h-16 w-16 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">{fileName}</p>
              <p className="text-xs text-slate-500">
                {imgWRef.current} × {imgHRef.current}px
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-600"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Model warning */}
          {!isPortrait && (
            <div className="flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-700">
              <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              {t(
                'tools.ai-photo-cutout.ui.modelWarning',
                'First use downloads a ~44 MB AI model (cached afterwards). This may take 10-30 seconds depending on your connection.',
              )}
            </div>
          )}

          <button
            type="button"
            onClick={startCutout}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-medium text-white hover:bg-brand-dark"
          >
            <Sparkles className="h-5 w-5" />
            {isPortrait
              ? t('tools.portrait-cutout.ui.startBtn', 'Cut Out Person')
              : t('tools.ai-photo-cutout.ui.startBtn', 'Remove Background')}
          </button>
        </div>
      )}

      {/* Processing */}
      {status === 'processing' && (
        <div className="flex flex-col items-center gap-3 py-12">
          <Loader2 className="h-10 w-10 animate-spin text-brand" />
          <p className="text-sm text-slate-600">
            {t('tools.ai-photo-cutout.ui.processing', 'Processing... this runs entirely in your browser')}
          </p>
          {!isPortrait && (
            <p className="text-xs text-slate-400">
              {t('tools.ai-photo-cutout.ui.downloading', 'Downloading AI model (first use only)...')}
            </p>
          )}
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div className="flex flex-col items-center gap-3 py-8">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <p className="max-w-md text-center text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            {t('common.tryAgain', 'Try Again')}
          </button>
        </div>
      )}

      {/* Result + Brush */}
      {isReady && (
        <>
          {/* Canvas */}
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div style={CHECKER_STYLE} className="flex items-center justify-center p-4">
              <canvas
                ref={canvasRef}
                width={imgWRef.current}
                height={imgHRef.current}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
                className="max-h-[500px] max-w-full touch-none rounded-lg"
                style={{
                  cursor: 'crosshair',
                  backgroundImage: 'none',
                }}
              />
            </div>
          </div>

          {/* Brush toolbar */}
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <Brush className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">
                {t('tools.ai-photo-cutout.ui.refineTitle', 'Refine edges')}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setBrushMode('restore')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  brushMode === 'restore'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Brush className="h-3.5 w-3.5" />
                {t('tools.ai-photo-cutout.ui.restore', 'Restore')}
              </button>
              <button
                type="button"
                onClick={() => setBrushMode('erase')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  brushMode === 'erase'
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Eraser className="h-3.5 w-3.5" />
                {t('tools.ai-photo-cutout.ui.erase', 'Erase')}
              </button>

              <div className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  onClick={undo}
                  disabled={!canUndo}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  title={t('common.undo', 'Undo')}
                >
                  <Undo2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={redo}
                  disabled={!canRedo}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  title={t('common.redo', 'Redo')}
                >
                  <Redo2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={resetMask}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                  title={t('common.reset', 'Reset')}
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">
                {t('tools.ai-photo-cutout.ui.brushSize', 'Brush size')}: {brushSize}px
              </label>
              <input
                type="range"
                min={10}
                max={100}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full accent-brand"
              />
            </div>
          </div>

          {/* Download buttons */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => downloadImage('foreground')}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-medium text-white hover:bg-brand-dark"
            >
              <Download className="h-4 w-4" />
              {t('tools.ai-photo-cutout.ui.downloadFg', 'Download Foreground')}
            </button>
            <button
              type="button"
              onClick={() => downloadImage('background')}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Layers className="h-4 w-4" />
              {t('tools.ai-photo-cutout.ui.downloadBg', 'Download Background')}
            </button>
          </div>

          {/* Start over */}
          <button
            type="button"
            onClick={reset}
            className="mx-auto block text-xs text-slate-400 hover:text-slate-600"
          >
            {t('tools.ai-photo-cutout.ui.startOver', 'Start over with a new image')}
          </button>
        </>
      )}

      {/* Privacy note */}
      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
        <Sparkles className="h-3.5 w-3.5" />
        {t(
          'tools.ai-photo-cutout.ui.privacyNote',
          'AI model: ' + modelName + ' (' + modelSize + '). All processing happens locally — images never leave your device.',
        )}
      </p>
    </div>
  );
}
