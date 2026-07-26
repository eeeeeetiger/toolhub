'use client';

// 音频工具共享的 ffmpeg.wasm 封装：复用 video.ts 的同一实例与 IO 原语。
// 音频转换器 / 裁剪 / 压缩都走这里，避免重复加载 wasm。

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { getFFmpeg, writeInput, readOutput, onProgress, type ProgressCallback } from './video';

export type AudioFormat = 'mp3' | 'wav' | 'm4a' | 'ogg' | 'flac';

const CODEC: Record<AudioFormat, string> = {
  mp3: 'libmp3lame',
  wav: 'pcm_s16le',
  m4a: 'aac',
  ogg: 'libvorbis',
  flac: 'flac',
};

// 通用音频转换（可选比特率，用于有损格式）
export async function convertAudio(
  ff: FFmpeg,
  input: string,
  output: string,
  fmt: AudioFormat,
  bitrate?: number,
  onProg?: ProgressCallback,
): Promise<void> {
  const args = ['-i', input, '-vn', '-c:a', CODEC[fmt]];
  if ((fmt === 'mp3' || fmt === 'm4a' || fmt === 'ogg') && bitrate) {
    args.push('-b:a', `${bitrate}k`);
  }
  args.push(output);
  const off = onProg ? onProgress(ff, onProg) : undefined;
  await ff.exec(args);
  off?.();
}

// 裁剪片段 [start, end]（秒），重新编码为指定格式以保证跨格式兼容
export async function cutAudio(
  ff: FFmpeg,
  input: string,
  output: string,
  start: number,
  end: number,
  fmt: AudioFormat = 'mp3',
  bitrate?: number,
  onProg?: ProgressCallback,
): Promise<void> {
  const args = ['-ss', String(start), '-to', String(end), '-i', input, '-vn', '-c:a', CODEC[fmt]];
  if ((fmt === 'mp3' || fmt === 'm4a' || fmt === 'ogg') && bitrate) {
    args.push('-b:a', `${bitrate}k`);
  }
  args.push(output);
  const off = onProg ? onProgress(ff, onProg) : undefined;
  await ff.exec(args);
  off?.();
}

// 压缩：重新编码为 mp3 并限制比特率
export async function compressAudio(
  ff: FFmpeg,
  input: string,
  output: string,
  bitrate: number,
  onProg?: ProgressCallback,
): Promise<void> {
  const off = onProg ? onProgress(ff, onProg) : undefined;
  await ff.exec(['-i', input, '-vn', '-c:a', 'libmp3lame', '-b:a', `${bitrate}k`, output]);
  off?.();
}

export { getFFmpeg, writeInput, readOutput };

// ---------- Web Audio 合并（不依赖 ffmpeg，纯前端）----------
// 解码多个音频文件为 AudioBuffer，拼接后离线渲染为 WAV。

function getAudioContextCtor(): typeof AudioContext {
  const w = window as unknown as {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  };
  return w.AudioContext || (w.webkitAudioContext as typeof AudioContext);
}

export async function decodeAudioFile(file: File | Blob): Promise<AudioBuffer> {
  const AC = getAudioContextCtor();
  const ctx = new AC();
  try {
    const buf = await file.arrayBuffer();
    return await ctx.decodeAudioData(buf);
  } finally {
    ctx.close();
  }
}

function concatBuffers(buffers: AudioBuffer[]): AudioBuffer {
  const AC = getAudioContextCtor();
  const ctx = new AC();
  const channels = buffers[0].numberOfChannels;
  const rate = buffers[0].sampleRate;
  let total = 0;
  for (const b of buffers) total += b.length;
  const out = ctx.createBuffer(channels, total, rate);
  let offset = 0;
  for (const b of buffers) {
    for (let c = 0; c < channels; c++) {
      out.getChannelData(c).set(b.getChannelData(c), offset);
    }
    offset += b.length;
  }
  ctx.close();
  return out;
}

export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numCh = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const numFrames = buffer.length;
  const bytesPerSample = 2;
  const blockAlign = numCh * bytesPerSample;
  const dataSize = numFrames * blockAlign;
  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);

  const writeStr = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numCh, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  const chData: Float32Array[] = [];
  for (let c = 0; c < numCh; c++) chData.push(buffer.getChannelData(c));
  for (let i = 0; i < numFrames; i++) {
    for (let c = 0; c < numCh; c++) {
      let s = Math.max(-1, Math.min(1, chData[c][i]));
      s = s < 0 ? s * 0x8000 : s * 0x7fff;
      view.setInt16(offset, s, true);
      offset += 2;
    }
  }
  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

export async function mergeAudioFiles(files: (File | Blob)[]): Promise<Blob> {
  const buffers = await Promise.all(files.map(decodeAudioFile));
  const merged = concatBuffers(buffers);
  return audioBufferToWav(merged);
}

// ---------- 输出格式封装（WAV 直出 / 其余经 ffmpeg 转码）----------

const FORMAT_MIME: Record<AudioFormat, string> = {
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  m4a: 'audio/mp4',
  ogg: 'audio/ogg',
  flac: 'audio/flac',
};

// 将 Web Audio 处理后的 AudioBuffer 编码为目标格式。WAV 直出（无需 ffmpeg），
// 其余格式写入虚拟 FS 后经 ffmpeg 重新编码。默认 MP3 192kbps。
export async function audioBufferToFormat(
  buffer: AudioBuffer,
  fmt: AudioFormat,
  bitrate = 192,
  onProg?: ProgressCallback,
): Promise<{ blob: Blob; mime: string; ext: string }> {
  return wavBlobToFormat(audioBufferToWav(buffer), fmt, bitrate, onProg);
}

// 将已有的 WAV Blob 转码为目标格式
export async function wavBlobToFormat(
  wav: Blob,
  fmt: AudioFormat,
  bitrate = 192,
  onProg?: ProgressCallback,
): Promise<{ blob: Blob; mime: string; ext: string }> {
  if (fmt === 'wav') return { blob: wav, mime: FORMAT_MIME.wav, ext: 'wav' };
  const ff = await getFFmpeg();
  await writeInput(ff, 'in.wav', wav);
  const outName = `out.${fmt}`;
  await convertAudio(ff, 'in.wav', outName, fmt, bitrate, onProg);
  const data = await readOutput(ff, outName);
  return { blob: new Blob([data as BlobPart], { type: FORMAT_MIME[fmt] }), mime: FORMAT_MIME[fmt], ext: fmt };
}

// ---------- 音效处理（Web Audio，纯前端）----------

function transformChannels(buffer: AudioBuffer, fn: (ch: Float32Array) => Float32Array): AudioBuffer {
  const AC = getAudioContextCtor();
  const ctx = new AC();
  const out = ctx.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    out.getChannelData(c).set(fn(buffer.getChannelData(c)));
  }
  ctx.close();
  return out;
}

export function reverseBuffer(buffer: AudioBuffer): AudioBuffer {
  return transformChannels(buffer, (ch) => {
    const r = new Float32Array(ch.length);
    for (let i = 0; i < ch.length; i++) r[i] = ch[ch.length - 1 - i];
    return r;
  });
}

export function fadeBuffer(buffer: AudioBuffer, fadeInSec: number, fadeOutSec: number): AudioBuffer {
  const sr = buffer.sampleRate;
  const fi = Math.max(0, Math.floor(fadeInSec * sr));
  const fo = Math.max(0, Math.floor(fadeOutSec * sr));
  return transformChannels(buffer, (ch) => {
    const out = new Float32Array(ch.length);
    for (let i = 0; i < ch.length; i++) {
      let g = 1;
      if (fi > 0 && i < fi) g = i / fi;
      if (fo > 0 && i > ch.length - fo) g = Math.min(g, (ch.length - i) / fo);
      out[i] = ch[i] * g;
    }
    return out;
  });
}

export function normalizeBuffer(buffer: AudioBuffer, target = 0.95): AudioBuffer {
  let peak = 0;
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const ch = buffer.getChannelData(c);
    for (let i = 0; i < ch.length; i++) {
      const a = Math.abs(ch[i]);
      if (a > peak) peak = a;
    }
  }
  const g = peak > 0 ? target / peak : 1;
  return transformChannels(buffer, (ch) => {
    const o = new Float32Array(ch.length);
    for (let i = 0; i < ch.length; i++) o[i] = Math.max(-1, Math.min(1, ch[i] * g));
    return o;
  });
}

export function trimSilenceBuffer(buffer: AudioBuffer, threshold = 0.01, padSec = 0.1): AudioBuffer {
  const sr = buffer.sampleRate;
  const ch0 = buffer.getChannelData(0);
  const win = Math.min(Math.floor(sr / 50), 400);
  const rmsAt = (i: number): number => {
    let s = 0;
    for (let k = 0; k < win; k++) {
      const idx = i + k;
      if (idx < ch0.length) s += ch0[idx] * ch0[idx];
    }
    return Math.sqrt(s / win);
  };
  let start = 0;
  let end = ch0.length - 1;
  while (start < end && rmsAt(start) < threshold) start++;
  while (end > start && rmsAt(end) < threshold) end--;
  const pad = Math.floor(padSec * sr);
  start = Math.max(0, start - pad);
  end = Math.min(ch0.length - 1, end + pad);
  const len = end - start + 1;
  const AC = getAudioContextCtor();
  const ctx = new AC();
  const out = ctx.createBuffer(buffer.numberOfChannels, len, buffer.sampleRate);
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    out.getChannelData(c).set(buffer.getChannelData(c).subarray(start, end + 1));
  }
  ctx.close();
  return out;
}

// ---------- ffmpeg 音效（变速/升降调/声道）----------

async function applyAudioFilter(
  ff: FFmpeg,
  input: string,
  output: string,
  filter: string,
  onProg?: ProgressCallback,
): Promise<void> {
  const off = onProg ? onProgress(ff, onProg) : undefined;
  await ff.exec(['-i', input, '-af', filter, output]);
  off?.();
}

export async function runFfmpegAudioEffect(
  file: File,
  filter: string,
  outName: string,
  outMime: string,
  onProg?: ProgressCallback,
): Promise<Blob> {
  const ff = await getFFmpeg();
  const ext = (file.name.split('.').pop() || 'dat').toLowerCase();
  const inName = `in.${ext}`;
  await writeInput(ff, inName, file);
  await applyAudioFilter(ff, inName, outName, filter, onProg);
  const data = await readOutput(ff, outName);
  return new Blob([data as BlobPart], { type: outMime });
}

// 声道转换：用 `-ac N` 输出选项，而非 `-af ac=N` 滤镜（ac 不是合法滤镜）。
export async function runFfmpegChannelConvert(
  file: File,
  channels: number,
  outName: string,
  outMime: string,
  onProg?: ProgressCallback,
): Promise<Blob> {
  const ff = await getFFmpeg();
  const ext = (file.name.split('.').pop() || 'dat').toLowerCase();
  const inName = `in.${ext}`;
  await writeInput(ff, inName, file);
  const off = onProg ? onProgress(ff, onProg) : undefined;
  await ff.exec(['-i', inName, '-ac', String(channels), outName]);
  off?.();
  const data = await readOutput(ff, outName);
  return new Blob([data as BlobPart], { type: outMime });
}

// 探测音频流比特率（kbps）。用于压缩时避免目标码率 ≥ 源码率导致文件变大。
export async function probeBitrate(ff: FFmpeg, input: string): Promise<number | null> {
  let captured = '';
  const handler = ({ message }: { message: string }) => {
    captured += message + '\n';
  };
  ff.on('log', handler);
  try {
    // 解码并丢弃，仅为了拿到 ffmpeg 解析出的码率日志
    await ff.exec(['-i', input, '-f', 'null', '-']);
  } catch {
    /* 探测以日志为准，结束码无关紧要 */
  } finally {
    ff.off('log', handler);
  }
  const lines = captured.split('\n');
  for (const line of lines) {
    if (/Audio:/.test(line)) {
      const m = line.match(/(\d+)\s*kb\/s/i);
      if (m) return parseInt(m[1], 10);
    }
  }
  const m2 = captured.match(/bitrate:\s*(\d+)\s*kb\/s/i);
  return m2 ? parseInt(m2[1], 10) : null;
}
