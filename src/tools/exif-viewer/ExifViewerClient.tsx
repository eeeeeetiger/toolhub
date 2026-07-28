'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { useI18n } from '@/i18n';

type TagMap = Record<string, string>;

const TAG_INFO: Record<number, { key: string; en: string }> = {
  0x010f: { key: 'cameraMake', en: 'Camera make' },
  0x0110: { key: 'cameraModel', en: 'Camera model' },
  0x0112: { key: 'orientation', en: 'Orientation' },
  0x0131: { key: 'software', en: 'Software' },
  0x0132: { key: 'dateModified', en: 'Date modified' },
  0x8298: { key: 'copyright', en: 'Copyright' },
  0x9003: { key: 'dateTaken', en: 'Date taken' },
  0x829a: { key: 'exposureTime', en: 'Exposure time' },
  0x8827: { key: 'iso', en: 'ISO' },
  0x920a: { key: 'focalLength', en: 'Focal length' },
  0xa002: { key: 'imageWidth', en: 'Image width' },
  0xa003: { key: 'imageHeight', en: 'Image height' },
};

const TAG_EN: Record<string, string> = Object.fromEntries(
  Object.values(TAG_INFO).map((i) => [i.key, i.en]),
);
TAG_EN.gpsLatitude = 'GPS latitude';
TAG_EN.gpsLongitude = 'GPS longitude';
TAG_EN.gpsAltitude = 'GPS altitude';

function parseExif(arrayBuffer: ArrayBuffer): TagMap {
  const view = new DataView(arrayBuffer);
  // Find APP1 (0xFFE1) containing "Exif\0\0"
  let offset = 2;
  let tiffStart = -1;
  while (offset + 4 < view.byteLength) {
    if (view.getUint16(offset) === 0xffe1) {
      const len = view.getUint16(offset + 2);
      const sig = String.fromCharCode(
        view.getUint8(offset + 4),
        view.getUint8(offset + 5),
        view.getUint8(offset + 6),
        view.getUint8(offset + 7),
      );
      if (sig === 'Exif') {
        tiffStart = offset + 10;
        break;
      }
      offset += 2 + len;
    } else {
      offset += 2;
    }
  }
  if (tiffStart < 0) return {};

  const little = view.getUint16(tiffStart) === 0x4949;
  const get16 = (o: number) => view.getUint16(o, little);
  const get32 = (o: number) => view.getUint32(o, little);

  const readValue = (type: number, count: number, off: number): string => {
    const readStr = (o: number, c: number) =>
      Array.from({ length: c }, (_, i) => String.fromCharCode(view.getUint8(o + i)))
        .join('')
        .replace(/\0+$/, '');
    switch (type) {
      case 2:
        return readStr(off, count);
      case 3:
        return String(get16(off));
      case 4:
        return String(get32(off));
      case 1:
        return String(view.getUint8(off));
      case 5: {
        const n = get32(off);
        const d = get32(off + 4) || 1;
        return (n / d).toString();
      }
      default:
        return '';
    }
  };

  const parseIfd = (ifdOffset: number, out: TagMap, depth = 0) => {
    if (ifdOffset < 0 || depth > 3) return;
    const entries = get16(ifdOffset);
    let gpsOffset = -1;
    let exifOffset = -1;
    for (let i = 0; i < entries; i++) {
      const e = ifdOffset + 2 + i * 12;
      const tag = get16(e);
      const type = get16(e + 2);
      const count = get32(e + 4);
      const byteLen = count * typeSize(type);
      const valueOff = byteLen <= 4 ? e + 8 : tiffStart + get32(e + 8);
      if (tag === 0x8825) gpsOffset = get32(e + 8);
      else if (tag === 0x8769) exifOffset = get32(e + 8);
      else {
        const info = TAG_INFO[tag];
        if (info) out[info.key] = readValue(type, count, valueOff);
      }
    }
    if (exifOffset > 0) parseIfd(tiffStart + exifOffset, out, depth + 1);
    if (gpsOffset > 0) parseGps(tiffStart + gpsOffset, out);
  };

  const parseGps = (ifdOffset: number, out: TagMap) => {
    const entries = get16(ifdOffset);
    let lat: number[] = [];
    let lon: number[] = [];
    let latRef = 'N';
    let lonRef = 'E';
    let alt = '';
    for (let i = 0; i < entries; i++) {
      const e = ifdOffset + 2 + i * 12;
      const tag = get16(e);
      const type = get16(e + 2);
      const count = get32(e + 4);
      const byteLen = count * typeSize(type);
      const valueOff = byteLen <= 4 ? e + 8 : tiffStart + get32(e + 8);
      if (tag === 0x0001) latRef = readValue(type, count, valueOff);
      else if (tag === 0x0003) lonRef = readValue(type, count, valueOff);
      else if (tag === 0x0002) {
        lat = [get32(valueOff) / (get32(valueOff + 4) || 1), get32(valueOff + 8) / (get32(valueOff + 12) || 1), get32(valueOff + 16) / (get32(valueOff + 20) || 1)];
      } else if (tag === 0x0004) {
        lon = [get32(valueOff) / (get32(valueOff + 4) || 1), get32(valueOff + 8) / (get32(valueOff + 12) || 1), get32(valueOff + 16) / (get32(valueOff + 20) || 1)];
      } else if (tag === 0x0006) alt = readValue(type, count, valueOff);
    }
    const fmt = (d: number[]) =>
      `${Math.floor(d[0])}° ${Math.floor(d[1])}' ${d[2].toFixed(2)}"`;
    if (lat.length) out.gpsLatitude = `${fmt(lat)} ${latRef}`;
    if (lon.length) out.gpsLongitude = `${fmt(lon)} ${lonRef}`;
    if (alt) out.gpsAltitude = `${alt} m`;
  };

  const out: TagMap = {};
  parseIfd(tiffStart + get32(tiffStart + 4), out);
  return out;
}

function typeSize(type: number) {
  return [0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8][type] || 1;
}

export default function ExifViewerClient() {
  const { t } = useI18n();
  const [meta, setMeta] = useState<TagMap | null>(null);
  const [name, setName] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [cleanUrl, setCleanUrl] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setName(f.name);
    setCleanUrl(null);
    setLoaded(false);
    const buf = await f.arrayBuffer();
    try {
      setMeta(parseExif(buf));
    } catch {
      setMeta({});
    }
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setLoaded(true);
    };
    img.src = url;
  };

  const strip = () => {
    const img = imgRef.current;
    if (!img) return;
    const cv = document.createElement('canvas');
    cv.width = img.naturalWidth;
    cv.height = img.naturalHeight;
    cv.getContext('2d')!.drawImage(img, 0, 0);
    cv.toBlob((b) => {
      if (b) setCleanUrl(URL.createObjectURL(b));
    }, 'image/jpeg', 0.92);
  };

  return (
    <div className="space-y-5">
      <label className="block cursor-pointer rounded-lg border border-dashed border-brand/30 px-4 py-6 text-center text-sm text-brand hover:bg-brand/5">
        {t('tools.exif-viewer.ui.upload', 'Choose a JPEG photo')}
        <input type="file" accept="image/jpeg" className="hidden" onChange={onFile} />
      </label>

      {meta && (
        <>
          <p className="text-sm text-slate-500">
            {name} —{' '}
            {Object.keys(meta).length
              ? t('tools.exif-viewer.ui.found', 'Metadata found')
              : t('tools.exif-viewer.ui.none', 'No metadata found')}
          </p>

          {previewUrl && (
            <div className="overflow-hidden rounded-xl border border-brand/15 bg-slate-50 dark:bg-slate-900">
              <div className="px-4 pt-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                {t('tools.exif-viewer.ui.preview', 'Image preview')}
              </div>
              <div className="flex justify-center p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt={name}
                  className="max-h-80 w-auto rounded-lg object-contain shadow-sm"
                />
              </div>
            </div>
          )}

          <div className="overflow-hidden rounded-xl border border-brand/15">
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(meta).map(([k, v]) => (
                  <tr key={k} className="border-b border-brand/10 last:border-0">
                    <td className="bg-slate-50 px-4 py-2 font-medium dark:bg-slate-900">{t(`tools.exif-viewer.ui.${k}`, TAG_EN[k] ?? k)}</td>
                    <td className="px-4 py-2">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button onClick={strip} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-50" disabled={!loaded}>
              {t('tools.exif-viewer.ui.strip', 'Create clean copy (remove metadata)')}
            </button>
            {cleanUrl && (
              <a href={cleanUrl} download={name.replace(/\.jpe?g$/i, '') + '-clean.jpg'} className="rounded-lg border border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-brand/5 inline-block">
                {t('tools.exif-viewer.ui.download', 'Download clean image')}
              </a>
            )}
          </div>

          {cleanUrl && (
            <div className="overflow-hidden rounded-xl border border-brand/15 bg-slate-50 dark:bg-slate-900">
              <div className="px-4 pt-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                {t('tools.exif-viewer.ui.cleanPreview', 'Cleaned image (metadata removed)')}
              </div>
              <div className="flex justify-center p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cleanUrl}
                  alt="cleaned"
                  className="max-h-80 w-auto rounded-lg object-contain shadow-sm"
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
