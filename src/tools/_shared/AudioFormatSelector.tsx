'use client';

import { useI18n } from '@/i18n';

export const MP3_BITRATES = [128, 192, 256];

export function AudioFormatSelector({
  format,
  setFormat,
  bitrate,
  setBitrate,
}: {
  format: 'wav' | 'mp3';
  setFormat: (f: 'wav' | 'mp3') => void;
  bitrate: number;
  setBitrate: (b: number) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="mb-1 block text-sm text-slate-600">{t('audio.fx.format', 'Output format')}</label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as 'wav' | 'mp3')}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="mp3">MP3</option>
          <option value="wav">WAV</option>
        </select>
      </div>
      {format === 'mp3' && (
        <div>
          <label className="mb-1 block text-sm text-slate-600">{t('audio.fx.bitrate', 'MP3 bitrate')}</label>
          <select
            value={bitrate}
            onChange={(e) => setBitrate(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {MP3_BITRATES.map((b) => (
              <option key={b} value={b}>
                {b} kbps
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
