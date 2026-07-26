'use client';

import { useEffect } from 'react';
import { useI18n } from '@/i18n';

type SlotName = 'header' | 'infeed' | 'footer';

interface AdSlotProps {
  slot?: SlotName;
  format?: 'horizontal' | 'rectangle';
  className?: string;
}

// 广告网络：构建时通过 NEXT_PUBLIC_AD_NETWORK 决定（'none' | 'adsense' | 'baidu'）。
// 这样同一套代码，海外构建选 adsense、国内构建选 baidu，页面显示对应广告，无需改业务代码。
const NETWORK = process.env.NEXT_PUBLIC_AD_NETWORK ?? 'none';

const SIZE: Record<SlotName, { w: number; h: number; label: string }> = {
  header: { w: 728, h: 90, label: '728 × 90' },
  infeed: { w: 336, h: 280, label: '336 × 280' },
  footer: { w: 728, h: 90, label: '728 × 90' },
};

function loadScript(src: string) {
  if (document.getElementById('ad-network-script')) return;
  const s = document.createElement('script');
  s.id = 'ad-network-script';
  s.async = true;
  s.src = src;
  s.crossOrigin = 'anonymous';
  document.head.appendChild(s);
}

function placeholder(
  size: { label: string },
  t: (k: string, f: string) => string,
  className: string,
) {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className="relative flex h-16 w-full max-w-[728px] items-center justify-center rounded border border-dashed border-slate-200 bg-slate-50/50">
        <p className="text-[10px] uppercase tracking-wider text-slate-300">
          {size.label} — {t('common.adSpace', 'Ad Space')}
        </p>
      </div>
    </div>
  );
}

export function AdSlot({
  slot = 'header',
  format = 'horizontal',
  className = '',
}: AdSlotProps) {
  const { t } = useI18n();
  const size = SIZE[slot];

  // 未接入任何广告网络 → 不渲染占位框（广告位结构保留，开关打开即生效）
  if (NETWORK === 'none') {
    return null;
  }

  // 海外：Google AdSense
  if (NETWORK === 'adsense') {
    const client = process.env.NEXT_PUBLIC_ADSENSE_ID;
    const slotId =
      slot === 'header'
        ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER
        : slot === 'infeed'
          ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_INFEED
          : process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER;

    useEffect(() => {
      if (client) {
        loadScript(
          `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`,
        );
      }
      try {
        (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = (
          window as unknown as { adsbygoogle: unknown[] }
        ).adsbygoogle || [];
        (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({});
      } catch {
        /* noop */
      }
    }, [client]);

    if (!client || !slotId) return placeholder(size, t, className);

    return (
      <div className={`flex justify-center ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: size.w, height: size.h, maxWidth: '100%' }}
          data-ad-client={client}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // 国内：百度联盟（具体代码以你联盟后台「代码位」为准；如与下方不一致，替换此处即可）
  if (NETWORK === 'baidu') {
    const unionId = process.env.NEXT_PUBLIC_BAIDU_UNION_ID;
    const baiduSlot =
      process.env.NEXT_PUBLIC_BAIDU_SLOT_HEADER ??
      process.env.NEXT_PUBLIC_BAIDU_SLOT_INFEED ??
      process.env.NEXT_PUBLIC_BAIDU_SLOT_FOOTER;

    useEffect(() => {
      if (unionId) loadScript('https://dup.baidustatic.com/js/os.js');
      try {
        (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = (
          window as unknown as { adsbygoogle: unknown[] }
        ).adsbygoogle || [];
        (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({});
      } catch {
        /* noop */
      }
    }, [unionId]);

    if (!unionId) return placeholder(size, t, className);

    return (
      <div className={`flex justify-center ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: size.w, height: size.h, maxWidth: '100%' }}
          data-ad-client={unionId}
          data-ad-slot={baiduSlot ?? ''}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  return placeholder(size, t, className);
}
