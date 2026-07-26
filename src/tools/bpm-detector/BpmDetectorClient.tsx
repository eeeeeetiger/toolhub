'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { useI18n } from '@/i18n';
import { decodeAudioFile } from '@/lib/audio';

const PYTHON_SCRIPT = `#!/usr/bin/env python3
"""Offline BPM analyzer using librosa (Python).

Install:
    pip install librosa soundfile

Usage:
    python bpm_analyzer.py path/to/song.mp3
"""
import sys
import librosa

def main():
    if len(sys.argv) < 2:
        print("Usage: python bpm_analyzer.py <audio_file>")
        sys.exit(1)
    path = sys.argv[1]
    y, sr = librosa.load(path, sr=None)
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    print(f"Estimated BPM: {float(tempo):.1f}")

if __name__ == "__main__":
    main()
`;

export default function BpmDetectorClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [bpm, setBpm] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setBpm(null);
    setError(null);
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
  };

  async function detect() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const buf = await decodeAudioFile(file);
      // 动态导入：web-audio-beat-detector 依赖浏览器 Web Audio，顶层 import 会触发预渲染崩溃
      const { guess } = await import('web-audio-beat-detector');
      // 放宽到 40–200 BPM，覆盖抒情慢歌（如 ~63 BPM），避免被折成倍频误判
      const { bpm: detected } = await guess(buf, { minTempo: 40, maxTempo: 200 });
      setBpm(Math.round(detected));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze audio.');
    } finally {
      setBusy(false);
    }
  }

  function downloadPythonScript() {
    const blob = new Blob([PYTHON_SCRIPT], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bpm_analyzer.py';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <label className="mb-2 block text-sm font-medium text-slate-700">{t('tools.bpm-detector.ui.pick', 'Choose an audio file')}</label>
        <input
          type="file"
          accept="audio/*"
          onChange={onPick}
          className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand"
        />
        {file && <p className="mt-2 text-xs text-slate-500">{file.name}</p>}
      </div>

      <button onClick={detect} disabled={!file || busy} className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50">
        {busy ? t('tools.bpm-detector.ui.analyzing', 'Analyzing…') : t('tools.bpm-detector.ui.run', 'Detect BPM')}
      </button>

      {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      {bpm !== null && (
        <div className="rounded-lg border border-brand/30 bg-brand/[0.06] p-6 text-center">
          <div className="text-xs text-slate-500">{t('tools.bpm-detector.ui.estimated', 'Estimated tempo')}</div>
          <div className="text-5xl font-bold text-slate-900">{bpm === 0 ? '—' : bpm}</div>
          <div className="text-xs text-slate-500">BPM</div>
        </div>
      )}

      <details className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
        <summary className="cursor-pointer font-medium text-slate-700 hover:text-brand">
          {t('tools.bpm-detector.ui.noteTitle', 'Notes')}
        </summary>
        <div className="mt-3 space-y-3 text-slate-600">
          <p>
            <strong className="text-slate-800">{t('tools.bpm-detector.ui.notePrinciple', 'Principle')}</strong>
            <br />
            {t(
              'tools.bpm-detector.ui.notePrincipleText',
              'This tool decodes the audio locally in your browser and runs the web-audio-beat-detector algorithm. It scans the energy envelope for beat-like peaks, measures the intervals between them, and returns a BPM estimate. The detection range is set to 40–200 BPM so slow ballads (around 60–70 BPM) are not misread as double-time tempos.',
            )}
          </p>
          <p>
            <strong className="text-slate-800">{t('tools.bpm-detector.ui.noteLimit', 'Limitations')}</strong>
            <br />
            {t(
              'tools.bpm-detector.ui.noteLimitText',
              'Browser-based BPM detection is a best-effort estimate. Songs with dense transients (cymbals, drum rolls, plosive consonants), uneven rhythms, or no clear drum beat can confuse the detector and cause “octave” errors (e.g., 63 BPM reported as 126). Long intros, silence, or very quiet recordings may also reduce accuracy.',
            )}
          </p>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="mb-2 font-medium text-slate-800">
              {t('tools.bpm-detector.ui.notePython', 'Need higher accuracy?')}
            </p>
            <p className="mb-3">
              {t(
                'tools.bpm-detector.ui.notePythonText',
                'For professional analysis, use Python with librosa. Download the script below, install librosa, then run: python bpm_analyzer.py song.mp3',
              )}
            </p>
            <button
              type="button"
              onClick={downloadPythonScript}
              className="rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand/90"
            >
              {t('tools.bpm-detector.ui.notePythonDownload', 'Download bpm_analyzer.py')}
            </button>
          </div>
        </div>
      </details>
    </div>
  );
}
