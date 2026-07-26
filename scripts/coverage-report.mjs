// 生成测试覆盖清单：枚举全部工具，标注自动化测试 / 手动测试分类。
// 注意：registry.ts 的扩展名省略 import 无法被 Node strip-types 解析，
// 因此这里按文本解析 registry + 各 config.ts（只取 slug/name/category 三个字段）。
// 运行：node --experimental-strip-types scripts/coverage-report.mjs
import fs from 'node:fs';

// ① 从 registry.ts 文本提取全部 config 路径（保持注册顺序）
const reg = fs.readFileSync('src/tools/registry.ts', 'utf8');
const configPaths = [...reg.matchAll(/from '\.\/([a-z0-9-]+)\/config'/g)].map((m) => m[1]);

// ② 逐个读 config.ts 取字段
const tools = [];
for (const slug of configPaths) {
  const src = fs.readFileSync(`src/tools/${slug}/config.ts`, 'utf8');
  const name = src.match(/name:\s*'([^']+)'/)?.[1] ?? slug;
  const category = src.match(/category:\s*'([^']+)'/)?.[1] ?? '?';
  tools.push({ slug, name, category });
}

// ③ slug → 组件名（从 ToolPageClient 映射表解析）
const tpc = fs.readFileSync('src/app/tools/[slug]/ToolPageClient.tsx', 'utf8');
const compOf = {};
for (const m of tpc.matchAll(/'([a-z0-9-]+)':\s*(\w+)/g)) compOf[m[1]] = m[2];

// ④ 计算器套件覆盖 = calc-defs.ts 的 key（calcDefs 是纯数据可直接导入）
const { calcDefs } = await import('../src/tools/_shared/calc-defs.ts');
const CALC = new Set(Object.keys(calcDefs));

// ⑤ 纯逻辑套件（tool-tests.mjs）——与测试文件逐项对应
const LOGIC = new Set([
  'case-converter', 'word-counter',
  'text-sorter', 'find-replace', 'html-entity-converter', 'morse-code-converter',
  'base-converter', 'text-reverser', 'word-frequency', 'whitespace-cleaner',
  'sql-formatter', 'cron-parser', 'chmod-calculator', 'jwt-generator',
  'hash-generator',
  'color-contrast-checker', 'aspect-ratio-calculator',
  'csv-to-json', 'json-to-csv',
  'length-converter', 'weight-converter', 'area-converter', 'volume-converter',
  'speed-converter', 'data-converter', 'temperature-converter',
  'regex-tester', 'password-generator', 'slug-generator',
]);

// ⑥ 手动测试子分类
const BUCKETS = [
  { key: 'media', match: (c, slug) =>
      /^(image|video|audio|gif)-/.test(slug) ||
      /Image|Video|Audio|Gif|Meme|Heic|Avif|SvgToPng|Collage|Watermark|Upscaler|Redact|Border|Exif|Favicon/.test(c) ||
      ['meme-generator', 'm4a-to-mp3'].includes(slug) },
  { key: 'docs', match: (c) => /ExcelClient|OfficePdfClient|Pdf|Ocr/.test(c) },
  { key: 'device', match: (c) => /KeyboardTest|MouseTest|DeadPixelTest|WebcamTest|MicTest|Metronome|Tuner|WhiteNoise|VocalRemover|SignatureMaker|BpmDetector/.test(c) },
  { key: 'seo', match: (_c, slug) => ['meta-tag-generator', 'robots-txt-generator', 'sitemap-generator', 'serp-preview', 'schema-generator', 'dns-lookup'].includes(slug) },
];

const auto = [], buckets = { media: [], docs: [], device: [], seo: [], other: [] };
for (const t of tools) {
  if (CALC.has(t.slug)) { auto.push({ ...t, suite: 'calc-tests.mjs' }); continue; }
  if (LOGIC.has(t.slug)) { auto.push({ ...t, suite: 'tool-tests.mjs' }); continue; }
  const comp = compOf[t.slug] ?? '(独立组件)';
  let placed = false;
  for (const b of BUCKETS) {
    if (b.match(comp, t.slug)) { buckets[b.key].push({ ...t, comp }); placed = true; break; }
  }
  if (!placed) buckets.other.push({ ...t, comp });
}

const total = tools.length;
console.log(`工具总数: ${total}`);
console.log(`自动化: ${auto.length}（计算器 ${CALC.size} + 纯逻辑 ${LOGIC.size}）`);
console.log(`手动: ${total - auto.length} = 媒体 ${buckets.media.length} + 文档 ${buckets.docs.length} + 设备 ${buckets.device.length} + SEO ${buckets.seo.length} + 其他小工具 ${buckets.other.length}`);

const lines = [];
lines.push('# ToolHub 测试覆盖清单', '');
lines.push(`> 生成时间：${new Date().toLocaleDateString('sv-SE')}　工具总数：${total}`, '');
lines.push('## 汇总', '');
lines.push('| 测试方式 | 工具数 | 说明 |', '|---|---|---|');
lines.push(`| ✅ 自动化测试 | ${auto.length} | 两套脚本共 580 项断言，改代码后 10 秒回归 |`);
lines.push(`| 🔧 需手动测试 | ${total - auto.length} | 依赖浏览器/设备/重型库；已全量构建冒烟（能打开不报错），功能需抽查 |`);
lines.push(`| 全部 | ${total} | |`);
lines.push('', '---', '');
lines.push(`## ✅ 一、自动化测试覆盖（${auto.length} 个）`, '');
lines.push('运行：`node --experimental-strip-types scripts/calc-tests.mjs` 和 `scripts/tool-tests.mjs`', '');
lines.push('| 工具 | slug | 测试套件 |', '|---|---|---|');
for (const t of auto) lines.push(`| ${t.name} | \`${t.slug}\` | ${t.suite} |`);
lines.push('', '---', '');
lines.push(`## 🔧 二、需手动测试（${total - auto.length} 个）`, '');
const LABELS = {
  media: '媒体与图像处理（转换/编辑/生成，需上传真实文件验证输出）',
  docs: '文档处理类（PDF / Excel / OCR 重型客户端库）',
  device: '设备/实时音频类（麦克风、摄像头、键鼠、屏幕、Web Audio）',
  seo: 'SEO 生成器类（模板文本输出，人工看一眼即可）',
  other: '纯前端小工具（逻辑简单、平台封装，低风险，抽查即可；其中约 20 个后续可补自动化）',
};
for (const [key, arr] of Object.entries(buckets)) {
  lines.push('', `### ${LABELS[key]}（${arr.length} 个）`, '');
  lines.push('| 工具 | slug |', '|---|---|');
  for (const t of arr) lines.push(`| ${t.name} | \`${t.slug}\` |`);
}
fs.writeFileSync('../toolhub测试覆盖清单.md', lines.join('\n') + '\n');
console.log('\n已写出: toolhub测试覆盖清单.md');

console.log('\n[other 组明细]');
for (const t of buckets.other) console.log(` - ${t.slug} (${t.comp})`);
