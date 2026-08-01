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
  ZoomIn,
  ZoomOut,
  Maximize2,
  Hand,
  Palette,
  WandSparkles,
  Check,
} from 'lucide-react';
import {
  analyzeBackgroundFill,
  createExportBackground,
  createInpaintedBackground,
  resizeMaskBilinear,
  terminateBackgroundRepairWorker,
  type BackgroundAnalysis,
  type BackgroundFillMode,
  type BackgroundProgress,
  type BackgroundResult,
} from './cutoutBackground';

type Status = 'idle' | 'processing' | 'done' | 'error';
type ViewMode = 'foreground' | 'original' | 'background';
type InteractionMode = 'brush' | 'pan';
type BackgroundStatus = 'idle' | 'processing' | 'ready';

const BACKGROUND_STAGE_ORDER: BackgroundProgress['stage'][] = [
  'download',
  'initialize',
  'inference',
];

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
  const [progress, setProgress] = useState<{ key: string; current: number; total: number } | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('foreground');
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('brush');
  const [backgroundStatus, setBackgroundStatus] = useState<BackgroundStatus>('idle');
  const [backgroundError, setBackgroundError] = useState<string | null>(null);
  const [backgroundMode, setBackgroundMode] = useState<BackgroundFillMode>('auto');
  const [backgroundAnalysis, setBackgroundAnalysis] = useState<BackgroundAnalysis | null>(null);
  const [backgroundProgress, setBackgroundProgress] = useState<BackgroundProgress | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [brushCursor, setBrushCursor] = useState({ x: 0, y: 0, size: 0, visible: false });
  const [isDownloading, setIsDownloading] = useState<'foreground' | 'background' | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const thumbUrlRef = useRef<string | null>(null);

  const imgDataRef = useRef<ImageData | null>(null);
  const maskRef = useRef<Float32Array | null>(null);
  const origMaskRef = useRef<Float32Array | null>(null);
  const undoStackRef = useRef<Float32Array[]>([]);
  const redoStackRef = useRef<Float32Array[]>([]);
  const isDrawingRef = useRef(false);
  const imgWRef = useRef(0);
  const imgHRef = useRef(0);
  const origImgDataRef = useRef<ImageData | null>(null);
  const origWRef = useRef(0);
  const origHRef = useRef(0);
  const fileRef = useRef<File | null>(null);
  const backgroundResultRef = useRef<BackgroundResult | null>(null);
  const backgroundVersionRef = useRef(-1);
  const backgroundRequestRef = useRef(0);
  const maskVersionRef = useRef(0);
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const modelName = isPortrait
    ? t('tools.portrait-cutout.ui.modelName', 'MediaPipe Selfie Segmentation')
    : t('tools.ai-photo-cutout.ui.modelName', 'IS-Net FP16');
  const modelSize = isPortrait
    ? '~25 KB'
    : '~84 MB model + ~22 MB runtime (~106 MB first download, cached afterwards)';

  useEffect(() => {
    return () => {
      undoStackRef.current = [];
      redoStackRef.current = [];
      if (thumbUrlRef.current) URL.revokeObjectURL(thumbUrlRef.current);
      terminateBackgroundRepairWorker();
    };
  }, []);

  const renderResult = useCallback(() => {
    const canvas = canvasRef.current;
    const imgData = imgDataRef.current;
    const mask = maskRef.current;
    if (!canvas || !imgData || !mask) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (viewMode === 'original') {
      ctx.putImageData(imgData, 0, 0);
      return;
    }

    if (viewMode === 'background') {
      ctx.putImageData(backgroundResultRef.current?.imageData ?? imgData, 0, 0);
      return;
    }

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
  }, [viewMode]);

  // status 切到 done 后, canvas 元素已 mount, 触发 renderResult 把 mask 绘制到画布
  // (必须放 useEffect, 不能在 startCutout 同步调用 —— React state 还没 commit, canvas 还没创建)
  useEffect(() => {
    if (status === 'done') renderResult();
  }, [status, backgroundStatus, renderResult]);

  const invalidateBackground = useCallback(() => {
    backgroundRequestRef.current++;
    backgroundResultRef.current = null;
    backgroundVersionRef.current = -1;
    setBackgroundStatus('idle');
    setBackgroundError(null);
    setBackgroundProgress(null);
  }, []);

  const ensureBackgroundPreview = useCallback(async () => {
    const imageData = imgDataRef.current;
    const mask = maskRef.current;
    const requestedVersion = maskVersionRef.current;
    const requestId = ++backgroundRequestRef.current;
    if (!imageData || !mask) return;
    if (
      backgroundResultRef.current &&
      backgroundVersionRef.current === requestedVersion
    ) {
      setBackgroundStatus('ready');
      return;
    }

    setBackgroundStatus('processing');
    setBackgroundError(null);
    setBackgroundProgress(null);
    try {
      const result = await createInpaintedBackground(imageData, mask.slice(), {
        mode: backgroundMode,
        onProgress: (nextProgress) => {
          if (backgroundRequestRef.current === requestId) setBackgroundProgress(nextProgress);
        },
      });
      if (
        maskVersionRef.current !== requestedVersion ||
        backgroundRequestRef.current !== requestId
      ) return;
      backgroundResultRef.current = result;
      backgroundVersionRef.current = requestedVersion;
      setBackgroundAnalysis(result.analysis);
      setBackgroundProgress(null);
      setBackgroundStatus('ready');
    } catch (cause) {
      if (
        maskVersionRef.current !== requestedVersion ||
        backgroundRequestRef.current !== requestId
      ) return;
      setBackgroundError(cause instanceof Error ? cause.message : String(cause));
      setBackgroundProgress(null);
      setBackgroundStatus('idle');
    }
  }, [backgroundMode]);

  useEffect(() => {
    if (status === 'done' && viewMode === 'background' && backgroundStatus === 'idle') {
      void ensureBackgroundPreview();
    }
  }, [backgroundStatus, ensureBackgroundPreview, status, viewMode]);

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
    setViewMode('foreground');
    setInteractionMode('brush');
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setBackgroundAnalysis(null);
    maskVersionRef.current++;
    invalidateBackground();

    if (thumbUrlRef.current) URL.revokeObjectURL(thumbUrlRef.current);
    const nextPreviewUrl = URL.createObjectURL(file);
    thumbUrlRef.current = nextPreviewUrl;
    setPreviewUrl(nextPreviewUrl);

    try {
      const img = await loadImg(file);
      if (!img.naturalWidth || !img.naturalHeight) {
        throw new Error('Image has zero dimensions');
      }
      const oW = img.naturalWidth;
      const oH = img.naturalHeight;
      // 原图全尺寸：用于下载时按原图分辨率合成最终输出
      const origCanvas = document.createElement('canvas');
      origCanvas.width = oW;
      origCanvas.height = oH;
      const origCtx = origCanvas.getContext('2d');
      if (!origCtx) throw new Error('Canvas not available');
      origCtx.drawImage(img, 0, 0);
      origImgDataRef.current = origCtx.getImageData(0, 0, oW, oH);
      origWRef.current = oW;
      origHRef.current = oH;
      // 缩略图：用于 canvas 显示与模型推理，节省内存和算力
      const { w, h } = fitDims(oW, oH, MAX_DIM);
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
    setProgress(null);

    try {
      let mask: Float32Array;

      if (isPortrait) {
        mask = await runMediaPipe(imgData);
      } else {
        mask = await runIsNet(file, (key, current, total) => {
          setProgress({ key, current, total });
        });
      }

      maskRef.current = mask;
      origMaskRef.current = mask.slice();
      undoStackRef.current = [];
      redoStackRef.current = [];
      setCanUndo(false);
      setCanRedo(false);
      setBackgroundAnalysis(analyzeBackgroundFill(imgData, mask));
      maskVersionRef.current++;
      invalidateBackground();
      setViewMode('foreground');
      setInteractionMode('brush');
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setStatus('done');
      // 注: renderResult 移到 useEffect 里, 等 React commit 后 canvas 元素已创建再绘制
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus('error');
    }
  };

  async function runIsNet(
    file: File,
    onProgress?: (key: string, current: number, total: number) => void,
  ): Promise<Float32Array> {
    const { removeBackground } = await import('@imgly/background-removal');
    const blob = await removeBackground(file, {
      model: 'isnet_fp16',
      output: { format: 'image/png' },
      progress: onProgress,
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
    // 合理性检查：若前景像素极少（<0.1%），说明模型未识别出主体，避免静默返回全透明
    let nonZero = 0;
    for (let i = 0; i < mask.length; i++) {
      if (mask[i] > 64) nonZero++;
    }
    if (nonZero < mask.length * 0.001) {
      throw new Error(
        t(
          'tools.ai-photo-cutout.ui.noSubject',
          'No subject detected. Try a clearer photo, or use the brush tool to refine.',
        ),
      );
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

  const commitMaskChange = () => {
    const imageData = imgDataRef.current;
    const mask = maskRef.current;
    if (imageData && mask) setBackgroundAnalysis(analyzeBackgroundFill(imageData, mask));
    maskVersionRef.current++;
    invalidateBackground();
  };

  const updateBrushCursor = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    const workspace = workspaceRef.current;
    if (!canvas || !workspace || interactionMode !== 'brush') {
      setBrushCursor((current) => ({ ...current, visible: false }));
      return;
    }
    const canvasRect = canvas.getBoundingClientRect();
    const workspaceRect = workspace.getBoundingClientRect();
    setBrushCursor({
      x: e.clientX - workspaceRect.left,
      y: e.clientY - workspaceRect.top,
      size: Math.max(4, brushSize * (canvasRect.width / canvas.width)),
      visible: true,
    });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (status !== 'done') return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    if (interactionMode === 'pan') {
      isPanningRef.current = true;
      panStartRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
      setBrushCursor((current) => ({ ...current, visible: false }));
      return;
    }
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
    if (status !== 'done') return;
    updateBrushCursor(e);
    if (isPanningRef.current) {
      setPan({
        x: panStartRef.current.panX + e.clientX - panStartRef.current.x,
        y: panStartRef.current.panY + e.clientY - panStartRef.current.y,
      });
      return;
    }
    if (!isDrawingRef.current) return;
    const { x, y } = getCanvasPos(e);
    applyBrush(x, y);
    renderResult();
  };

  const onPointerUp = (e?: React.PointerEvent) => {
    const didDraw = isDrawingRef.current;
    isDrawingRef.current = false;
    isPanningRef.current = false;
    if (didDraw) commitMaskChange();
    if (e) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Pointer capture may already have been released by the browser.
      }
    }
  };

  const undo = () => {
    const stack = undoStackRef.current;
    if (!stack.length) return;
    const mask = maskRef.current;
    if (!mask) return;
    redoStackRef.current.push(mask.slice());
    maskRef.current = stack.pop()!;
    commitMaskChange();
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
    commitMaskChange();
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
    commitMaskChange();
    renderResult();
    setCanUndo(true);
    setCanRedo(false);
  };

  const downloadImage = async (type: 'foreground' | 'background') => {
    const origData = origImgDataRef.current;
    const thumbMask = maskRef.current;
    if (!origData || !thumbMask) return;

    setIsDownloading(type);

    try {
      const ow = origData.width;
      const oh = origData.height;
      const sw = imgWRef.current;
      const sh = imgHRef.current;
      const mask =
        sw === ow && sh === oh
          ? thumbMask.slice()
          : resizeMaskBilinear(thumbMask, sw, sh, ow, oh);

      const canvas = document.createElement('canvas');
      canvas.width = ow;
      canvas.height = oh;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const out = ctx.createImageData(ow, oh);
      const src = origData.data;

      if (type === 'foreground') {
        for (let i = 0; i < mask.length; i++) {
          const alpha = Math.max(0, Math.min(255, mask[i]));
          out.data[i * 4] = src[i * 4];
          out.data[i * 4 + 1] = src[i * 4 + 1];
          out.data[i * 4 + 2] = src[i * 4 + 2];
          out.data[i * 4 + 3] = alpha;
        }
      } else {
        const exportMode =
          backgroundMode === 'auto'
            ? backgroundResultRef.current?.methodUsed ?? 'auto'
            : backgroundMode;
        const background = await createExportBackground(origData, mask, {
          mode: exportMode,
          onProgress: setBackgroundProgress,
        });
        out.data.set(background.data);
      }
      ctx.putImageData(out, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const base = fileName.replace(/\.[^.]+$/, '') || 'image';
        link.download =
          type === 'foreground' ? `${base}_foreground.png` : `${base}_background.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }, 'image/png');
    } catch (cause) {
      if (type === 'background') {
        setBackgroundError(cause instanceof Error ? cause.message : String(cause));
      }
    } finally {
      setBackgroundProgress(null);
      setIsDownloading(null);
    }
  };

  const selectBackgroundMode = (nextMode: BackgroundFillMode) => {
    if (nextMode === backgroundMode) return;
    setBackgroundMode(nextMode);
    invalidateBackground();
  };

  const selectViewMode = (nextView: ViewMode) => {
    setViewMode(nextView);
    setInteractionMode(nextView === 'background' ? 'pan' : 'brush');
    setBrushCursor((current) => ({ ...current, visible: false }));
  };

  const changeZoom = (nextZoom: number) => {
    const normalizedZoom = Math.min(4, Math.max(1, nextZoom));
    setZoom(normalizedZoom);
    if (normalizedZoom === 1) setPan({ x: 0, y: 0 });
  };

  const resetViewport = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const onWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    changeZoom(zoom + (e.deltaY < 0 ? 0.2 : -0.2));
  };

  const reset = () => {
    setStatus('idle');
    setError(null);
    setFileName('');
    setImageReady(false);
    setPreviewUrl(null);
    setProgress(null);
    setViewMode('foreground');
    setInteractionMode('brush');
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setBrushCursor({ x: 0, y: 0, size: 0, visible: false });
    setIsDownloading(null);
    setBackgroundMode('auto');
    setBackgroundAnalysis(null);
    setBackgroundProgress(null);
    maskVersionRef.current++;
    invalidateBackground();
    fileRef.current = null;
    imgDataRef.current = null;
    origImgDataRef.current = null;
    origWRef.current = 0;
    origHRef.current = 0;
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
  const backgroundStageIndex = backgroundProgress
    ? BACKGROUND_STAGE_ORDER.indexOf(backgroundProgress.stage)
    : -1;
  const backgroundDownloadPercent =
    backgroundProgress?.stage === 'download' &&
    typeof backgroundProgress.loaded === 'number' &&
    typeof backgroundProgress.total === 'number' &&
    backgroundProgress.total > 0
      ? Math.min(100, Math.round((backgroundProgress.loaded / backgroundProgress.total) * 100))
      : null;
  const backgroundProgressText = backgroundProgress
    ? backgroundProgress.stage === 'download'
      ? t(
          'tools.ai-photo-cutout.ui.aiDownloading',
          'Downloading AI repair model: {percent}%',
          {
            percent: backgroundDownloadPercent ?? 0,
          },
        )
      : backgroundProgress.stage === 'initialize'
        ? t('tools.ai-photo-cutout.ui.aiInitializing', 'Loading AI repair model...')
        : t('tools.ai-photo-cutout.ui.aiRepairing', 'AI is repairing the background...')
    : null;
  const backgroundProgressStages = [
    {
      stage: 'download' as const,
      label: t('tools.ai-photo-cutout.ui.aiStageDownload', 'Download model'),
    },
    {
      stage: 'initialize' as const,
      label: t('tools.ai-photo-cutout.ui.aiStageInitialize', 'Initialize model'),
    },
    {
      stage: 'inference' as const,
      label: t('tools.ai-photo-cutout.ui.aiStageInference', 'AI inference'),
    },
  ];

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
          {!isPortrait && progress && (
            <div className="w-full max-w-xs space-y-1">
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-brand transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((progress.current / progress.total) * 100),
                    )}%`,
                  }}
                />
              </div>
              <p className="text-center text-xs text-slate-400">
                {progress.key}: {progress.current}/{progress.total} (
                {Math.round((progress.current / progress.total) * 100)}%)
              </p>
            </div>
          )}
          {!isPortrait && !progress && (
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
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex flex-col gap-2 border-b border-slate-200 p-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div
                role="tablist"
                aria-label={t('tools.ai-photo-cutout.ui.preview', 'Preview')}
                className="grid w-full grid-cols-3 items-center gap-1 rounded-lg bg-slate-100 p-1 sm:inline-flex sm:w-auto"
              >
                {(
                  [
                    ['foreground', Scissors, t('tools.ai-photo-cutout.ui.viewForeground', 'Foreground')],
                    ['original', ImageIcon, t('tools.ai-photo-cutout.ui.viewOriginal', 'Original')],
                    ['background', Layers, t('tools.ai-photo-cutout.ui.viewBackground', 'Background')],
                  ] as const
                ).map(([mode, Icon, label]) => (
                  <button
                    key={mode}
                    type="button"
                    role="tab"
                    aria-selected={viewMode === mode}
                    onClick={() => selectViewMode(mode)}
                    className={`inline-flex min-w-0 items-center justify-center gap-1.5 rounded-md px-1.5 py-1.5 text-[11px] font-medium transition-colors sm:px-3 sm:text-xs ${
                      viewMode === mode
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between gap-1 sm:justify-start">
                <button
                  type="button"
                  onClick={() => setInteractionMode('brush')}
                  className={`rounded-md p-2 transition-colors ${
                    interactionMode === 'brush'
                      ? 'bg-brand/10 text-brand'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                  title={t('tools.ai-photo-cutout.ui.brushTool', 'Brush tool')}
                >
                  <Brush className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setInteractionMode('pan')}
                  className={`rounded-md p-2 transition-colors ${
                    interactionMode === 'pan'
                      ? 'bg-brand/10 text-brand'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                  title={t('tools.ai-photo-cutout.ui.panTool', 'Pan')}
                >
                  <Hand className="h-4 w-4" />
                </button>
                <div className="mx-1 h-5 w-px bg-slate-200" />
                <button
                  type="button"
                  onClick={() => changeZoom(zoom - 0.25)}
                  disabled={zoom <= 1}
                  className="rounded-md p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  title={t('tools.ai-photo-cutout.ui.zoomOut', 'Zoom out')}
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="w-11 text-center text-xs tabular-nums text-slate-500">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => changeZoom(zoom + 0.25)}
                  disabled={zoom >= 4}
                  className="rounded-md p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  title={t('tools.ai-photo-cutout.ui.zoomIn', 'Zoom in')}
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={resetViewport}
                  className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
                  title={t('tools.ai-photo-cutout.ui.fit', 'Fit to view')}
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              ref={workspaceRef}
              onWheel={onWheel}
              style={viewMode === 'foreground' ? CHECKER_STYLE : undefined}
              className={`relative flex h-[min(64vh,620px)] min-h-[360px] items-center justify-center overflow-hidden p-4 ${
                viewMode === 'foreground' ? 'bg-white' : 'bg-slate-100'
              }`}
            >
              <canvas
                ref={canvasRef}
                width={imgWRef.current}
                height={imgHRef.current}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={(e) => {
                  onPointerUp(e);
                  setBrushCursor((current) => ({ ...current, visible: false }));
                }}
                className="touch-none rounded-lg shadow-sm"
                style={{
                  maxHeight: 'calc(min(64vh, 620px) - 32px)',
                  maxWidth: 'calc(100% - 32px)',
                  cursor:
                    interactionMode === 'pan'
                      ? isPanningRef.current
                        ? 'grabbing'
                        : 'grab'
                      : 'crosshair',
                  backgroundImage: 'none',
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: 'center',
                }}
              />

              {brushCursor.visible && (
                <div
                  className="pointer-events-none absolute rounded-full border border-white shadow-[0_0_0_1px_rgba(15,23,42,0.8)]"
                  style={{
                    left: brushCursor.x - brushCursor.size / 2,
                    top: brushCursor.y - brushCursor.size / 2,
                    width: brushCursor.size,
                    height: brushCursor.size,
                  }}
                />
              )}

              {viewMode === 'background' && backgroundStatus === 'processing' && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/75 backdrop-blur-[1px]">
                  {backgroundProgress ? (
                    <div
                      className="mx-4 w-full max-w-sm rounded-lg border border-slate-200 bg-white p-4 shadow-lg"
                      aria-live="polite"
                    >
                      <div className="mb-4 flex items-center gap-2">
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand" />
                        <span className="text-sm font-medium text-slate-800">
                          {t('tools.ai-photo-cutout.ui.aiProgressTitle', 'AI background repair')}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {backgroundProgressStages.map((item, index) => {
                          const isComplete = index < backgroundStageIndex;
                          const isActive = index === backgroundStageIndex;
                          const percent = isComplete
                            ? 100
                            : !isActive
                              ? 0
                              : item.stage === 'download'
                                ? backgroundDownloadPercent
                                : null;

                          return (
                            <div key={item.stage} className={isActive ? 'text-slate-800' : 'text-slate-400'}>
                              <div className="mb-1.5 flex items-center gap-2 text-xs">
                                <span
                                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-medium ${
                                    isComplete
                                      ? 'bg-emerald-100 text-emerald-700'
                                      : isActive
                                        ? 'bg-brand/10 text-brand'
                                        : 'bg-slate-100 text-slate-400'
                                  }`}
                                >
                                  {isComplete ? <Check className="h-3 w-3" /> : index + 1}
                                </span>
                                <span className="min-w-0 flex-1 font-medium">{item.label}</span>
                                {item.stage === 'download' && isActive && (
                                  <span className="tabular-nums text-slate-500">
                                    {backgroundDownloadPercent ?? 0}%
                                  </span>
                                )}
                              </div>
                              <div
                                className="ml-7 h-1.5 overflow-hidden rounded-full bg-slate-100"
                                role="progressbar"
                                aria-label={item.label}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                {...(percent !== null ? { 'aria-valuenow': percent } : {})}
                              >
                                <div
                                  className={`h-full bg-brand transition-all duration-300 ${
                                    isActive && item.stage !== 'download' ? 'animate-pulse opacity-70' : ''
                                  }`}
                                  style={{
                                    width: isComplete
                                      ? '100%'
                                      : isActive
                                        ? item.stage === 'download'
                                          ? `${backgroundDownloadPercent ?? 0}%`
                                          : '100%'
                                        : '0%',
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <p className="mt-4 text-xs text-slate-500">
                        {backgroundProgressText}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
                      <Loader2 className="h-4 w-4 animate-spin text-brand" />
                      {t('tools.ai-photo-cutout.ui.rebuildingBackground', 'Rebuilding background...')}
                    </div>
                  )}
                </div>
              )}

              {viewMode === 'background' && backgroundError && (
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-white px-4 py-3 text-xs text-red-600 shadow-sm">
                  <span className="truncate">{backgroundError}</span>
                  <button
                    type="button"
                    onClick={() => void ensureBackgroundPreview()}
                    className="shrink-0 font-medium text-red-700 hover:text-red-900"
                  >
                    {t('common.tryAgain', 'Try Again')}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 border-y border-slate-200 py-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">
                  {t('tools.ai-photo-cutout.ui.backgroundFill', 'Background fill')}
                </span>
              </div>
              <div
                role="radiogroup"
                aria-label={t('tools.ai-photo-cutout.ui.backgroundFill', 'Background fill')}
                className="grid w-full grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1 sm:w-auto"
              >
                {(
                  [
                    ['auto', Sparkles, t('tools.ai-photo-cutout.ui.fillAuto', 'Auto')],
                    ['color', Palette, t('tools.ai-photo-cutout.ui.fillColor', 'Color fill')],
                    ['ai', WandSparkles, t('tools.ai-photo-cutout.ui.fillAi', 'AI repair')],
                  ] as const
                ).map(([mode, Icon, label]) => (
                  <button
                    key={mode}
                    type="button"
                    role="radio"
                    aria-checked={backgroundMode === mode}
                    onClick={() => selectBackgroundMode(mode)}
                    className={`inline-flex min-h-10 min-w-0 items-center justify-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-medium leading-tight transition-colors sm:px-3 sm:text-xs ${
                      backgroundMode === mode
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
            <p
              aria-live="polite"
              className={`min-h-4 text-xs ${backgroundError ? 'text-red-600' : 'text-slate-500'}`}
            >
              {backgroundError ??
                backgroundProgressText ??
                (backgroundMode === 'auto' && backgroundAnalysis
                  ? backgroundAnalysis.recommendedMethod === 'color'
                    ? t(
                        'tools.ai-photo-cutout.ui.detectedColorFill',
                        'Similar surrounding colors detected: color fill will be used.',
                      )
                    : t(
                        'tools.ai-photo-cutout.ui.detectedAiFill',
                        'Complex surrounding colors detected: AI repair will be used.',
                      )
                  : backgroundMode === 'ai'
                    ? t(
                        'tools.ai-photo-cutout.ui.aiFillNote',
                        'The AI repair model is about 62 MB and is cached after the first use.',
                      )
                    : t(
                        'tools.ai-photo-cutout.ui.colorFillNote',
                        'Uses nearby colors to fill the removed area.',
                      ))}
            </p>
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
                onClick={() => {
                  setBrushMode('restore');
                  setInteractionMode('brush');
                }}
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
                onClick={() => {
                  setBrushMode('erase');
                  setInteractionMode('brush');
                }}
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
              onClick={() => void downloadImage('foreground')}
              disabled={isDownloading !== null}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-medium text-white hover:bg-brand-dark disabled:cursor-wait disabled:opacity-60"
            >
              {isDownloading === 'foreground' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {t('tools.ai-photo-cutout.ui.downloadFg', 'Download Foreground')}
            </button>
            <button
              type="button"
              onClick={() => void downloadImage('background')}
              disabled={isDownloading !== null}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
            >
              {isDownloading === 'background' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Layers className="h-4 w-4" />
              )}
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
