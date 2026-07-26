'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/i18n';
import {
  decodeAudioFile,
  reverseBuffer,
  fadeBuffer,
  normalizeBuffer,
  trimSilenceBuffer,
  runFfmpegAudioEffect,
  runFfmpegChannelConvert,
  audioBufferToFormat,
} from '@/lib/audio';
import { AudioFormatSelector, MP3_BITRATES } from './AudioFormatSelector';

type Kind = 'reverse' | 'fade' | 'normalize' | 'silence' | 'speed' | 'pitch' | 'channels';

interface FxDef {
  kind: Kind;
  fadeIn?: boolean;
  fadeOut?: boolean;
  speed?: boolean;
  pitch?: boolean;
  channel?: boolean;
}

const FX: Record<string, FxDef> = {
  'reverse-audio': { kind: 'reverse' },
  'fade-in-out': { kind: 'fade', fadeIn: true, fadeOut: true },
  'volume-normalizer': { kind: 'normalize' },
  'silence-trim': { kind: 'silence' },
  'audio-speed': { kind: 'speed', speed: true },
  'pitch-shifter': { kind: 'pitch', pitch: true },
  'mono-stereo-converter': { kind: 'channels', channel: true },
};

// 这些工具走 Web Audio 处理（处理后在浏览器内编码），原先只出 WAV，现支持 MP3。
const WEB_AUDIO_KINDS: Kind[] = ['reverse', 'fade', 'normalize', 'silence'];

export default function AudioFxClient() {
  const { t } = useI18n();
  const pathname = usePathname();
  const slug = (pathname || '').replace(/^\/tools\//, '').replace(/\/$/, '');
  const def = FX[slug];

  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [outExt, setOutExt] = useState('wav');
  const [error, setError] = useState<string | null>(null);
  const [fadeIn, setFadeIn] = useState(1);
  const [fadeOut, setFadeOut] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(0);
  const [channel, setChannel] = useState<'mono' | 'stereo'>('mono');
  const [format, setFormat] = useState<'wav' | 'mp3'>('mp3');
  const [bitrate, setBitrate] = useState<number>(MP3_BITRATES[1]);
  const urlRef = useRef<string | null>(null);

  if (!def) {
    return <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">Tool not found.</div>;
  }

  const showFormat = WEB_AUDIO_KINDS.includes(def.kind);

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setError(null);
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    setOutUrl(null);
  };

  async function process() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setProgress(0);
    try {
      let blob: Blob;
      let ext = 'mp3';
      if (def.kind === 'speed') {
        const factor = Math.max(0.5, Math.min(2, speed));
        blob = await runFfmpegAudioEffect(file, `atempo=${factor.toFixed(2)}`, 'out.mp3', 'audio/mpeg', (p) => setProgress(p));
      } else if (def.kind === 'pitch') {
        // 变调必须保持原时长：先归一化到 44100，再用 asetrate 改音高（同时会变速），
        // 然后用 atempo 滤镜把速度拉回原速（atempo 不改音高），最后 aresample 修正输出采样率。
        // 注意：wasm 内核只有 atempo，没有 tempo 滤镜（tempo 会让 ff.exec 报 “Filter not found” 而失败）。
        // 旧写法 `asetrate=R,aresample=44100` 会让音高和速度一起变（升调后时长变短）。
        const F = Math.pow(2, pitch / 12);
        const rate = Math.round(44100 * F);
        const atempo = (1 / F).toFixed(6);
        const filter = `aresample=44100,asetrate=${rate},atempo=${atempo},aresample=44100`;
        blob = await runFfmpegAudioEffect(file, filter, 'out.mp3', 'audio/mpeg', (p) => setProgress(p));
      } else if (def.kind === 'channels') {
        // 声道转换用 -ac 输出选项（ac=N 不是合法滤镜）
        blob = await runFfmpegChannelConvert(file, channel === 'mono' ? 1 : 2, 'out.mp3', 'audio/mpeg', (p) => setProgress(p));
      } else {
        const buf = await decodeAudioFile(file);
        let out = buf;
        if (def.kind === 'reverse') out = reverseBuffer(buf);
        else if (def.kind === 'fade') out = fadeBuffer(buf, def.fadeIn ? fadeIn : 0, def.fadeOut ? fadeOut : 0);
        else if (def.kind === 'normalize') out = normalizeBuffer(buf);
        else if (def.kind === 'silence') out = trimSilenceBuffer(buf);
        const res = await audioBufferToFormat(out, format, bitrate, (p) => setProgress(p));
        blob = res.blob;
        ext = res.ext;
      }
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setOutExt(ext);
      setOutUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <label className="mb-2 block text-sm font-medium text-slate-700">{t('audio.fx.pick', 'Choose an audio file')}</label>
        <input
          type="file"
          accept="audio/*"
          onChange={onPick}
          className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand"
        />
        {file && <p className="mt-2 text-xs text-slate-500">{file.name}</p>}
      </div>

      {def.fadeIn && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-slate-600">Fade in (seconds)</label>
            <input type="number" min={0} step={0.1} value={fadeIn} onChange={(e) => setFadeIn(parseFloat(e.target.value) || 0)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">Fade out (seconds)</label>
            <input type="number" min={0} step={0.1} value={fadeOut} onChange={(e) => setFadeOut(parseFloat(e.target.value) || 0)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
        </div>
      )}

      {def.speed && (
        <div>
          <label className="mb-1 block text-sm text-slate-600">Speed: {speed.toFixed(2)}× (tempo, pitch preserved)</label>
          <input type="range" min={0.5} max={2} step={0.05} value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="w-full" />
        </div>
      )}

      {def.pitch && (
        <div>
          <label className="mb-1 block text-sm text-slate-600">Pitch: {pitch > 0 ? `+${pitch}` : pitch} semitones</label>
          <input type="range" min={-12} max={12} step={1} value={pitch} onChange={(e) => setPitch(parseInt(e.target.value))} className="w-full" />
        </div>
      )}

      {def.channel && (
        <div>
          <label className="mb-1 block text-sm text-slate-600">Convert to</label>
          <select value={channel} onChange={(e) => setChannel(e.target.value as 'mono' | 'stereo')} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="mono">Mono (1 channel)</option>
            <option value="stereo">Stereo (2 channels)</option>
          </select>
        </div>
      )}

      {showFormat && (
        <AudioFormatSelector format={format} setFormat={setFormat} bitrate={bitrate} setBitrate={setBitrate} />
      )}

      <button
        onClick={process}
        disabled={!file || busy}
        className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? `Processing… ${Math.round(progress * 100)}%` : t('audio.fx.run', 'Process audio')}
      </button>

      {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      {outUrl && (
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="mb-3 text-sm font-medium text-slate-700">Result</p>
          <audio controls src={outUrl} className="w-full" />
          <a href={outUrl} download={`${slug}-output.${outExt}`} className="mt-3 inline-block rounded-lg bg-brand/10 px-4 py-2 text-sm font-medium text-brand">
            Download
          </a>
        </div>
      )}
    </div>
  );
}
