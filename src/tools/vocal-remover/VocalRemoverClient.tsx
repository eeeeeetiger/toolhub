'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { wavBlobToFormat } from '@/lib/audio';
import { AudioFormatSelector, MP3_BITRATES } from '@/tools/_shared/AudioFormatSelector';
import { useI18n } from '@/i18n';

function encodeWav(buffer: AudioBuffer): Blob {
  const numCh = 1;
  const sampleRate = buffer.sampleRate;
  const samples = buffer.length;
  const bytesPerSample = 2;
  const blockAlign = numCh * bytesPerSample;
  const dataSize = samples * blockAlign;
  const ab = new ArrayBuffer(44 + dataSize);
  const view = new DataView(ab);
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
  let off = 44;
  for (let i = 0; i < samples; i++) {
    let s = Math.max(-1, Math.min(1, view ? (buffer.getChannelData(0)[i] - (buffer.numberOfChannels > 1 ? buffer.getChannelData(1)[i] : 0)) / 2 : 0));
    view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    off += 2;
  }
  return new Blob([ab], { type: 'audio/wav' });
}

export default function VocalRemoverClient() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [outExt, setOutExt] = useState('wav');
  const [format, setFormat] = useState<'wav' | 'mp3'>('mp3');
  const [bitrate, setBitrate] = useState<number>(MP3_BITRATES[1]);
  const urlRef = useRef<string | null>(null);
  const { t } = useI18n();

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setUrl(null);
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const arr = await file.arrayBuffer();
      const decoded = await ctx.decodeAudioData(arr);
      if (decoded.numberOfChannels < 2) {
        setError('This track is mono (single channel), so center vocals cannot be isolated. Try a stereo file.');
        setBusy(false);
        return;
      }
      const out = ctx.createBuffer(1, decoded.length, decoded.sampleRate);
      const outData = out.getChannelData(0);
      const L = decoded.getChannelData(0);
      const R = decoded.getChannelData(1);
      for (let i = 0; i < decoded.length; i++) outData[i] = (L[i] - R[i]) / 2;
      const wav = encodeWav(out);
      const res = await wavBlobToFormat(wav, format, bitrate);
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const u = URL.createObjectURL(res.blob);
      urlRef.current = u;
      setOutExt(res.ext);
      setUrl(u);
      ctx.close();
    } catch (err) {
      setError('Could not process this file. It may be an unsupported or DRM-protected format.');
    } finally {
      setBusy(false);
    }
  }

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setUrl(null);
    setError(null);
  }

  return (
    <div className="space-y-5">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-8 text-center transition-colors hover:border-brand/40">
        <input type="file" accept="audio/*" onChange={onPick} className="hidden" />
        <span className="text-sm font-medium text-slate-600">{file ? file.name : 'Choose a stereo audio file'}</span>
        {!file && <p className="text-xs text-slate-400">Works best on tracks where vocals sit in the center</p>}
      </label>

      {file && (
        <>
          <AudioFormatSelector format={format} setFormat={setFormat} bitrate={bitrate} setBitrate={setBitrate} />
          <button
            onClick={run}
            disabled={busy}
            className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-50"
          >
            {busy ? 'Processing…' : 'Remove vocals'}
          </button>
        </>
      )}

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      {url && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="mb-2 text-sm font-medium text-slate-900">Result (instrumental)</p>
          <audio src={url} controls className="w-full" />
          <a href={url} download={`instrumental.${outExt}`} className="mt-3 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90">
            Download {outExt.toUpperCase()}
          </a>
        </div>
      )}
      <details className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
        <summary className="cursor-pointer font-medium text-slate-700">
          {t('tools.vocal-remover.ui.noteTitle', 'Notes')}
        </summary>
        <div className="mt-3 space-y-3 text-slate-600">
          <div>
            <strong className="text-slate-800">{t('tools.vocal-remover.ui.notePrinciple', 'Principle')}</strong>
            <p className="mt-1">
              {t(
                'tools.vocal-remover.ui.notePrincipleText',
                'The tool uses phase cancellation (center-channel removal): (L − R) / 2. In a stereo mix, vocals are usually panned dead center (identical in L and R) while instruments are spread to the sides (different). Subtracting the channels cancels the centered vocals and leaves the side instruments, producing an instrumental track. Everything runs locally — no upload.',
              )}
            </p>
          </div>
          <div>
            <strong className="text-slate-800">{t('tools.vocal-remover.ui.noteLimit', 'Limitations')}</strong>
            <p className="mt-1">
              {t(
                'tools.vocal-remover.ui.noteLimitText',
                'It only works on stereo files. It only removes vocals that are truly centered — modern mixes with slightly off-center, doubled, or reverberant vocals will not be fully removed. Instruments also panned center (bass, kick, snare) get removed too, so the instrumental can sound thin. It removes vocals but cannot isolate them into a separate file.',
              )}
            </p>
          </div>
          <div>
            <strong className="text-slate-800">{t('tools.vocal-remover.ui.noteAlt', 'Better results?')}</strong>
            <p className="mt-1">
              {t(
                'tools.vocal-remover.ui.noteAltText',
                'If results are poor, use AI-based separation: Spleeter or Demucs (open source) — e.g. `python -m demucs song.mp3` outputs vocals.wav and no_vocals.wav. Or try Ultimate Vocal Remover (free desktop) and online services like Moises, Lalal.ai, Fadr.',
              )}
            </p>
          </div>
        </div>
      </details>
    </div>
  );
}
