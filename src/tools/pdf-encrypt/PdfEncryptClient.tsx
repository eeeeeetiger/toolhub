'use client';

import { useState } from 'react';
import { PDFDocument } from '@cantoo/pdf-lib';
import { useI18n } from '@/i18n';

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function PdfEncryptClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [userPw, setUserPw] = useState('');
  const [ownerPw, setOwnerPw] = useState('');
  const [allowPrint, setAllowPrint] = useState(true);
  const [allowCopy, setAllowCopy] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function run() {
    if (!file) return;
    if (!userPw) {
      setError(t('tools.pdf-encrypt.ui.pwRequired', 'Please set an open password'));
      return;
    }
    setBusy(true);
    setError('');
    setDone(false);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const permissions: any = {};
      if (allowPrint) permissions.printing = 'highResolution';
      permissions.copying = allowCopy;

      doc.encrypt({
        userPassword: userPw,
        ownerPassword: ownerPw || userPw,
        permissions,
      });

      const data = await doc.save();
      downloadBlob(new Blob([data as BlobPart], { type: 'application/pdf' }), 'encrypted.pdf');
      setDone(true);
    } catch (e: any) {
      setError(e?.message || t('tools.pdf-encrypt.ui.encryptFailed', 'Failed to encrypt PDF'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          setFile(e.target.files?.[0] ?? null);
          setError('');
          setDone(false);
        }}
        className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-white hover:file:bg-brand-dark"
      />

      {file && (
        <>
          <input
            type="password"
            value={userPw}
            onChange={(e) => setUserPw(e.target.value)}
            placeholder={t('tools.pdf-encrypt.ui.openPw', 'Open password (required)')}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
          <input
            type="password"
            value={ownerPw}
            onChange={(e) => setOwnerPw(e.target.value)}
            placeholder={t('tools.pdf-encrypt.ui.permPw', 'Permissions password (optional)')}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />

          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={allowPrint} onChange={(e) => setAllowPrint(e.target.checked)} />
              {t('tools.pdf-encrypt.ui.allowPrint', 'Allow printing')}
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={allowCopy} onChange={(e) => setAllowCopy(e.target.checked)} />
              {t('tools.pdf-encrypt.ui.allowCopy', 'Allow copying text')}
            </label>
          </div>

          <button
            onClick={run}
            disabled={busy || !userPw}
            className="rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {busy ? t('tools.pdf-encrypt.ui.encrypting', 'Encrypting…') : t('tools.pdf-encrypt.ui.encrypt', 'Encrypt PDF')}
          </button>

          {done && !busy && <p className="text-sm text-green-600">{t('tools.pdf-encrypt.ui.done', 'Done — downloaded encrypted.pdf')}</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </>
      )}
    </div>
  );
}
