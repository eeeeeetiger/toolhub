'use client';

// 共享 ffmpeg.wasm 封装：全视频/音频工具复用同一个 FFmpeg 实例（懒加载一次）。
// 使用单线程核心（@ffmpeg/core），无需 SharedArrayBuffer / COOP-COEP，所有环境均可加载。
// 核心文件已本地化到 public/ffmpeg/。

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

const CORE_BASE = '/ffmpeg';
const FONT_URL = '/fonts/arial.ttf';
const FONT_BOLD_URL = '/fonts/arialbd.ttf';

let ffmpeg: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

export type ProgressCallback = (ratio: number) => void;

// 懒加载共享实例（仅一次）
export async function getFFmpeg(onLog?: (msg: string) => void): Promise<FFmpeg> {
  if (ffmpeg && ffmpeg.loaded) return ffmpeg;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const instance = new FFmpeg();
    if (onLog) instance.on('log', ({ message }) => onLog(message));
    // 关键：必须传 classWorkerURL 指向 public/ 下的原始 ESM worker 文件。
    // 默认走 `new URL('./worker.js', import.meta.url)` 会被 webpack 打包成 chunk，
    // 其中动态 import(coreURL) 被改写为 webpack 模块查找，对运行时路径直接抛
    // "Cannot find module '/ffmpeg/ffmpeg-core.js'"（ffmpeg 以 type:"module" 创建
    // worker，importScripts 不可用，必走 import() 分支）。worker/const/errors 与
    // ESM 核心（module worker 的 import() 需要 ES 模块，UMD 版没有 default export）
    // 均原样托管于 public/ffmpeg/，不经过 webpack。
    await instance.load({
      // 必须带 origin：ffmpeg 内部 `new URL(classWorkerURL, import.meta.url)`，而
      // Next/webpack 构建会把 import.meta.url 静态替换为构建机文件路径
      //（file:///D:/...），相对路径会被拼到磁盘上导致 Worker 构造失败。
      classWorkerURL: `${window.location.origin}${CORE_BASE}/worker.js`,
      coreURL: `${CORE_BASE}/ffmpeg-core.esm.js`,
      wasmURL: `${CORE_BASE}/ffmpeg-core.wasm`,
    });
    ffmpeg = instance;
    return instance;
  })();

  return loadPromise;
}

// 写文件到 ffmpeg 虚拟 FS
export async function writeInput(ff: FFmpeg, name: string, file: File | Blob): Promise<void> {
  const data = await fetchFile(file);
  await ff.writeFile(name, data);
}

export async function readOutput(ff: FFmpeg, name: string): Promise<Blob> {
  const data = (await ff.readFile(name)) as Uint8Array;
  return new Blob([new Uint8Array(data)]);
}

// 用 ffprobe 取视频元信息（时长/宽高/编码）
export async function probeVideo(ff: FFmpeg, name: string): Promise<{ duration: number; width: number; height: number }> {
  const out = 'probe.json';
  await ff.exec(['-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', name, '-o', out].filter((a) => a !== '-o').concat([out]));
  const raw = (await ff.readFile(out)) as Uint8Array;
  const txt = new TextDecoder().decode(raw);
  const info = JSON.parse(txt);
  const video = (info.streams || []).find((s: any) => s.codec_type === 'video') || {};
  const dur = parseFloat(info.format?.duration || '0') || 0;
  return {
    duration: dur,
    width: parseInt(video.width || '0', 10) || 0,
    height: parseInt(video.height || '0', 10) || 0,
  };
}

// 注册进度回调（返回解绑函数）
export function onProgress(ff: FFmpeg, cb: ProgressCallback): () => void {
  const handler = ({ progress }: { progress: number }) => {
    if (typeof progress === 'number' && progress >= 0 && progress <= 1) cb(progress);
  };
  ff.on('progress', handler);
  return () => ff.off('progress', handler);
}

// ---------- 高级封装：各工具的命令构造 ----------

export interface CompressOptions {
  scale?: number; // 0-1 目标宽度比例，如 0.5 = 宽减半
  maxWidth?: number; // 或直接指定最大宽度
  crf?: number; // 18-28，越大越小
  mute?: boolean;
}

export async function compressVideo(ff: FFmpeg, input: string, output: string, opts: CompressOptions, onProg?: ProgressCallback): Promise<void> {
  const vf: string[] = [];
  if (opts.scale && opts.scale < 1) vf.push(`scale=iw*${opts.scale}:-2`);
  if (opts.maxWidth) vf.push(`scale='min(iw,${opts.maxWidth})':-2`);
  const args = ['-i', input];
  if (vf.length) args.push('-vf', vf.join(','));
  args.push('-c:v', 'libx264', '-crf', String(opts.crf ?? 23), '-preset', 'veryfast');
  if (opts.mute) args.push('-an');
  else args.push('-c:a', 'aac', '-b:a', '128k');
  args.push('-movflags', '+faststart', output);
  const off = onProg ? onProgress(ff, onProg) : undefined;
  await ff.exec(args);
  off?.();
}

export async function convertVideo(ff: FFmpeg, input: string, output: string, targetFmt: string, onProg?: ProgressCallback): Promise<void> {
  const args = ['-i', input];
  if (targetFmt === 'gif') {
    args.push('-vf', 'fps=15,scale=480:-1:flags=lanczos', output);
  } else if (targetFmt === 'mp3' || targetFmt === 'wav' || targetFmt === 'm4a') {
    args.push('-vn', '-c:a', targetFmt === 'mp3' ? 'libmp3lame' : targetFmt === 'm4a' ? 'aac' : 'pcm_s16le', output);
  } else {
    args.push('-c:v', 'libx264', '-preset', 'veryfast', '-c:a', 'aac', output);
  }
  const off = onProg ? onProgress(ff, onProg) : undefined;
  await ff.exec(args);
  off?.();
}

// 截取片段 [start, end]（秒）
export async function cutVideo(ff: FFmpeg, input: string, output: string, start: number, end: number, onProg?: ProgressCallback): Promise<void> {
  const off = onProg ? onProgress(ff, onProg) : undefined;
  await ff.exec(['-ss', String(start), '-to', String(end), '-i', input, '-c', 'copy', output]);
  off?.();
}

// 合并多个文件（需先生成 concat 列表）
export async function mergeVideos(ff: FFmpeg, listName: string, output: string, onProg?: ProgressCallback): Promise<void> {
  const off = onProg ? onProgress(ff, onProg) : undefined;
  await ff.exec(['-f', 'concat', '-safe', '0', '-i', listName, '-c', 'copy', output]);
  off?.();
}

// 调速：factor>1 变快，<1 变慢
export async function changeSpeed(ff: FFmpeg, input: string, output: string, factor: number, onProg?: ProgressCallback): Promise<void> {
  const off = onProg ? onProgress(ff, onProg) : undefined;
  const pts = (1 / factor).toFixed(3);
  await ff.exec(['-i', input, '-filter_complex', `[0:v]setpts=${pts}*PTS[v];[0:a]atempo=${factor}[a]`, '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'veryfast', output]);
  off?.();
}

// 加文字水印/字幕（顶部或底部）
export interface WatermarkOptions {
  text: string;
  position?: 'top' | 'bottom' | 'center';
  color?: string; // #RRGGBB
  size?: number; // 字体像素
  bold?: boolean;
}
export async function addWatermark(ff: FFmpeg, input: string, output: string, opts: WatermarkOptions, onProg?: ProgressCallback): Promise<void> {
  const off = onProg ? onProgress(ff, onProg) : undefined;
  const font = opts.bold ? FONT_BOLD_URL : FONT_URL;
  const yMap: Record<string, string> = { top: '10', bottom: '(h-text_h-10)', center: '(h-text_h)/2' };
  const y = yMap[opts.position || 'bottom'];
  const escaped = opts.text.replace(/:/g, '\\:').replace(/'/g, "\\'");
  const vf = `drawtext=text='${escaped}':fontfile='${font}':fontcolor=${opts.color || 'white'}:fontsize=${opts.size || 36}:x=(w-text_w)/2:y=${y}:shadowcolor=black@0.6:shadowx=2:shadowy=2`;
  await ff.exec(['-i', input, '-vf', vf, '-c:v', 'libx264', '-preset', 'veryfast', '-c:a', 'copy', output]);
  off?.();
}

// 静音或提取音频
export async function muteOrExtract(ff: FFmpeg, input: string, output: string, mode: 'mute' | 'extract', onProg?: ProgressCallback): Promise<void> {
  const off = onProg ? onProgress(ff, onProg) : undefined;
  if (mode === 'mute') {
    await ff.exec(['-i', input, '-c:v', 'copy', '-an', output]);
  } else {
    await ff.exec(['-i', input, '-vn', '-c:a', 'libmp3lame', output]);
  }
  off?.();
}

// 旋转/翻转
export async function rotateVideo(ff: FFmpeg, input: string, output: string, mode: '90cw' | '90ccw' | '180' | 'hflip' | 'vflip', onProg?: ProgressCallback): Promise<void> {
  const off = onProg ? onProgress(ff, onProg) : undefined;
  const trans: Record<string, string> = {
    '90cw': 'transpose=1',
    '90ccw': 'transpose=2',
    '180': 'transpose=1,transpose=1',
    hflip: 'hflip',
    vflip: 'vflip',
  };
  await ff.exec(['-i', input, '-vf', trans[mode], '-c:v', 'libx264', '-preset', 'veryfast', '-c:a', 'copy', output]);
  off?.();
}

// 画面裁剪（去黑边/改比例）w/h/x/y 为像素
export async function cropVideo(ff: FFmpeg, input: string, output: string, w: number, h: number, x: number, y: number, onProg?: ProgressCallback): Promise<void> {
  const off = onProg ? onProgress(ff, onProg) : undefined;
  await ff.exec(['-i', input, '-vf', `crop=${w}:${h}:${x}:${y}`, '-c:v', 'libx264', '-preset', 'veryfast', '-c:a', 'copy', output]);
  off?.();
}
