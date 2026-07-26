'use client';

import { usePathname } from 'next/navigation';
import UnitConverterShell from '@/tools/_shared/unit-converter-shell';
import { converterDefs } from '@/tools/_shared/conversions';

// 通用换算客户端：从 URL 路径推导 slug，查表渲染对应换算器定义。
// converters 分类下 7 个乘法型/温度换算器都指向本组件。
export default function UnitConverterClient() {
  const pathname = usePathname();
  const slug = (pathname || '').replace(/^\/tools\//, '').replace(/\/$/, '');
  const def = converterDefs[slug];
  if (!def) {
    return <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">Converter not found.</div>;
  }
  return <UnitConverterShell def={def} />;
}
