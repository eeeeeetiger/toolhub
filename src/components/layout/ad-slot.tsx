'use client';

import { useEffect } from 'react';
import { ADSENSE_CLIENT_ID } from '@/lib/site';

type SlotName = 'header' | 'infeed' | 'footer';

interface AdSlotProps {
  slot?: SlotName;
  format?: 'horizontal' | 'rectangle';
  className?: string;
}

const NETWORK = process.env.NEXT_PUBLIC_AD_NETWORK ?? 'none';

const SIZE: Record<SlotName, { w: number; h: number }> = {
  header: { w: 728, h: 90 },
  infeed: { w: 336, h: 280 },
  footer: { w: 728, h: 90 },
};

function AdsenseSlot({
  slot,
  format,
  className,
}: Required<AdSlotProps>) {
  const slotId =
    slot === 'header'
      ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER
      : slot === 'infeed'
        ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_INFEED
        : process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER;
  const size = SIZE[slot];

  useEffect(() => {
    if (!ADSENSE_CLIENT_ID || !slotId) return;

    try {
      const adsWindow = window as unknown as { adsbygoogle?: unknown[] };
      adsWindow.adsbygoogle = adsWindow.adsbygoogle || [];
      adsWindow.adsbygoogle.push({});
    } catch {
      // Ad blockers and consent tooling may intentionally prevent initialization.
    }
  }, [slotId]);

  if (!ADSENSE_CLIENT_ID || !slotId) return null;

  return (
    <div className={`flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: size.w,
          height: size.h,
          maxWidth: '100%',
        }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

function loadBaiduScript() {
  if (document.getElementById('baidu-ad-script')) return;

  const script = document.createElement('script');
  script.id = 'baidu-ad-script';
  script.async = true;
  script.src = 'https://dup.baidustatic.com/js/os.js';
  document.head.appendChild(script);
}

function BaiduSlot({ slot, className }: Required<AdSlotProps>) {
  const unionId = process.env.NEXT_PUBLIC_BAIDU_UNION_ID;
  const slotId =
    slot === 'header'
      ? process.env.NEXT_PUBLIC_BAIDU_SLOT_HEADER
      : slot === 'infeed'
        ? process.env.NEXT_PUBLIC_BAIDU_SLOT_INFEED
        : process.env.NEXT_PUBLIC_BAIDU_SLOT_FOOTER;
  const size = SIZE[slot];

  useEffect(() => {
    if (unionId && slotId) loadBaiduScript();
  }, [unionId, slotId]);

  if (!unionId || !slotId) return null;

  return (
    <div className={`flex justify-center ${className}`}>
      <ins
        style={{
          display: 'block',
          width: size.w,
          height: size.h,
          maxWidth: '100%',
        }}
        data-ad-client={unionId}
        data-ad-slot={slotId}
      />
    </div>
  );
}

export function AdSlot({
  slot = 'header',
  format = 'horizontal',
  className = '',
}: AdSlotProps) {
  if (NETWORK === 'adsense') {
    return <AdsenseSlot slot={slot} format={format} className={className} />;
  }

  if (NETWORK === 'baidu') {
    return <BaiduSlot slot={slot} format={format} className={className} />;
  }

  return null;
}
