'use client';

import { usePathname } from 'next/navigation';
import CalculatorShell from '@/tools/_shared/calculator-shell';
import { calcDefs } from '@/tools/_shared/calc-defs';

// 通用计算器客户端：从 URL 路径推导 slug，查表渲染对应计算器定义。
// 所有 calculators 分类下的工具都指向本组件，避免为每个计算器重复写 UI。
export default function CalculatorClient() {
  const pathname = usePathname();
  const slug = (pathname || '').replace(/^\/tools\//, '').replace(/\/$/, '');
  const def = calcDefs[slug];
  if (!def) {
    return <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">Calculator not found.</div>;
  }
  return <CalculatorShell def={def} />;
}
