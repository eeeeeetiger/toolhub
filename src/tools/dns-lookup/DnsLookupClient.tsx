'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';

type RecordType = 'A' | 'AAAA' | 'MX' | 'TXT' | 'CNAME' | 'NS';
const TYPE_CODE: Record<RecordType, number> = { A: 1, AAAA: 28, MX: 15, TXT: 16, CNAME: 5, NS: 2 };

interface Answer { name: string; type: number; TTL: number; data: string; }

export default function DnsLookupClient() {
  const { t } = useI18n();
  const [domain, setDomain] = useState('example.com');
  const [type, setType] = useState<RecordType>('A');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const lookup = async () => {
    setLoading(true); setAnswers([]); setStatus('');
    try {
      const url = `https://dns.google/resolve?name=${encodeURIComponent(domain.trim())}&type=${TYPE_CODE[type]}`;
      const res = await fetch(url);
      const data = await res.json();
      setStatus(data.Status === 0 ? 'NOERROR' : `Status ${data.Status}`);
      setAnswers(data.Answer || []);
    } catch {
      setStatus(t('tools.dns-lookup.ui.failed', 'Lookup failed (network or CORS).'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder={t('tools.dns-lookup.ui.placeholder', 'example.com')}
          className="flex-1 rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-brand"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as RecordType)}
          className="rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-brand"
        >
          {(['A', 'AAAA', 'MX', 'TXT', 'CNAME', 'NS'] as RecordType[]).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button onClick={lookup} disabled={loading} className="rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50">
          {loading ? t('tools.dns-lookup.ui.lookingUp', 'Looking up…') : t('tools.dns-lookup.ui.lookup', 'Lookup')}
        </button>
      </div>

      {status && <div className="text-xs text-slate-500">{t('tools.dns-lookup.ui.status', 'Status')}: {status}</div>}

      {answers.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs text-slate-500">
              <tr>
                <th className="p-2">{t('tools.dns-lookup.ui.name', 'Name')}</th>
                <th className="p-2">{t('tools.dns-lookup.ui.ttl', 'TTL')}</th>
                <th className="p-2">{t('tools.dns-lookup.ui.data', 'Data')}</th>
              </tr>
            </thead>
            <tbody>
              {answers.map((a, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="p-2 font-mono text-xs text-slate-700">{a.name}</td>
                  <td className="p-2 text-xs text-slate-500">{a.TTL}</td>
                  <td className="break-all p-2 font-mono text-xs text-slate-700">{a.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
