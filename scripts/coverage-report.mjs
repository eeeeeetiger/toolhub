// 生成测试覆盖清单：枚举全部工具，标注自动化测试 / 手动测试分类。
// 注意：registry.ts 的扩展名省略 import 无法被 Node strip-types 解析，
// 因此这里按文本解析 registry + 各 config.ts（只取 slug/name/category 三个字段）。
// 运行：node --experimental-strip-types scripts/coverage-report.mjs
import fs from 'node:fs';

// ① 从 registry.ts 文本提取全部 config 路径（保持注册顺序）
const reg = fs.readFileSync('src/tools/registry.ts', 'utf8');
const configPaths = [...reg.matchAll(/from '\.\/([a-z0-9-]+)\/config'/g)].map((m) => m[1]);
const zhSource = fs.readFileSync('src/i18n/locales/zh.ts', 'utf8');

function getChineseName(slug, fallback) {
  const marker = `'${slug}':`;
  const start = zhSource.indexOf(marker);
  if (start < 0) return fallback;
  const match = zhSource.slice(start, start + 600).match(/name:\s*'((?:\\.|[^'])+)'/);
  return match ? match[1].replaceAll("\\'", "'") : fallback;
}

// ② 逐个读 config.ts 取字段
const tools = [];
for (const slug of configPaths) {
  const src = fs.readFileSync(`src/tools/${slug}/config.ts`, 'utf8');
  const name = src.match(/name:\s*'([^']+)'/)?.[1] ?? slug;
  const category = src.match(/category:\s*'([^']+)'/)?.[1] ?? '?';
  tools.push({ slug, name, zhName: getChineseName(slug, name), category });
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
  'base-converter', 'text-reverser', 'word-frequency',
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
lines.push('# ToolHub 测试结果 / Test Results', '');
lines.push(`> 生成时间 / Generated: ${new Date().toLocaleDateString('sv-SE')}　工具总数 / Total tools: ${total}`, '');
lines.push('## 结论 / Summary', '');
lines.push('| 状态 / Status | 测试项 / Test | 结果 / Result |', '|---|---|---|');
lines.push('| [x] | TypeScript 类型检查 / Type check | 通过 / PASS |');
lines.push('| [x] | 生产构建与静态导出 / Production build and static export | 通过，生成 199 个页面；有 2 组循环依赖警告 / PASS, 199 pages; 2 circular-dependency warning groups |');
lines.push('| [x] | 纯逻辑工具 / Pure logic tools | 532/532 断言通过 / assertions passed |');
lines.push('| [x] | 计算器 / Calculators | 45/45 断言通过 / assertions passed |');
lines.push('| [x] | 全量静态冒烟 / Full static smoke | 1503/1503 检查通过；176 工具页、12 分类页、17 资源 / checks passed; 176 tool pages, 12 categories, 17 assets |');
lines.push('| [x] | 浏览器冒烟 / Browser smoke | 6/7 通过：水合、英文搜索、语言切换、房贷计算、控制台 / passed: hydration, English search, locale switch, mortgage calculation, console |');
lines.push('| [ ] | 中文工具名搜索 / Search by Chinese localized tool name | 失败 / FAIL：`房贷` 未匹配“房贷计算器” |');
lines.push('', `功能级自动化已覆盖 / Function-level automation: **${auto.length}**；待手工功能验证 / Pending manual functional checks: **${total - auto.length}**。`);
lines.push('', '> 所有 176 个工具页均已通过构建与静态路由冒烟。下方“待测试”仅表示核心功能输出尚未用真实文件、真实设备或人工视觉判断验证。');
lines.push('> All 176 tool pages passed build and route smoke checks. "Pending" below means the core output still needs real files, real devices, or human visual judgment.', '');
lines.push('', '---', '');
lines.push(`## 已测试 / Tested（${auto.length} 个 / tools）`, '');
lines.push('运行 / Run: `node --experimental-strip-types scripts/calc-tests.mjs` and `node --experimental-strip-types scripts/tool-tests.mjs`', '');
lines.push('| 状态 | 中文名称 | English name | slug | 测试套件 / Suite |', '|---|---|---|---|---|');
for (const t of auto) lines.push(`| [x] | ${t.zhName} | ${t.name} | \`${t.slug}\` | ${t.suite} |`);
lines.push('', '---', '');
lines.push(`## 待测试 / Pending manual checks（${total - auto.length} 个 / tools）`, '');
const LABELS = {
  media: '媒体与图像处理 / Media and image processing（上传真实文件并检查输出 / use real files and inspect output）',
  docs: '文档处理 / Document processing（PDF / Excel / OCR 内容与版式 / content and layout）',
  device: '设备与实时音频 / Device and real-time audio（真实硬件与权限 / real hardware and permissions）',
  seo: 'SEO 生成器 / SEO generators（人工检查模板与标准符合性 / review templates and standards）',
  other: '其他前端工具 / Other browser tools（交互、剪贴板、计时或输出抽查 / interaction, clipboard, timing, or output checks）',
};
for (const [key, arr] of Object.entries(buckets)) {
  lines.push('', `### ${LABELS[key]}（${arr.length} 个 / tools）`, '');
  lines.push('| 状态 | 中文名称 | English name | slug |', '|---|---|---|---|');
  for (const t of arr) lines.push(`| [ ] | ${t.zhName} | ${t.name} | \`${t.slug}\` |`);
}
lines.push('', '---', '', '## 已发现问题 / Findings', '');
lines.push('- [ ] 中文搜索未使用本地化工具名：输入 `房贷` 无结果，但“房贷计算器”存在。 / Chinese search does not index localized tool names: `房贷` returns no result although Mortgage Calculator exists.');
lines.push('- [ ] 中文房贷页仍混有英文：字段名、How to use 与 FAQ 未翻译。 / The Chinese mortgage page still shows English field labels, How-to steps, and FAQs.');
lines.push('- [ ] Webpack 构建出现 2 组运行时 chunk 循环依赖警告。 / Webpack reports two runtime chunk circular-dependency warning groups.');
lines.push('- [ ] Node 测试出现 `MODULE_TYPELESS_PACKAGE_JSON` 性能警告。 / Node tests report the `MODULE_TYPELESS_PACKAGE_JSON` performance warning.');
lines.push('', '## 复现命令 / Reproduction commands', '');
lines.push('```powershell');
lines.push('npm run typecheck');
lines.push('node --experimental-strip-types scripts/tool-tests.mjs');
lines.push('node --experimental-strip-types scripts/calc-tests.mjs');
lines.push('npm run build');
lines.push('node scripts/static-smoke-tests.mjs');
lines.push('```');
fs.writeFileSync('../toolhub测试结果.md', lines.join('\n') + '\n');
console.log('\n已写出: toolhub测试结果.md');

console.log('\n[other 组明细]');
for (const t of buckets.other) console.log(` - ${t.slug} (${t.comp})`);
