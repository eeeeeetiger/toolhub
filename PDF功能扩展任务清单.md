# toolhub · PDF 功能扩展 Loop 任务清单

> 配套《LOOP_DEV.md》使用。本清单把「PDF 工具箱」按功能拆成可验证的小步，
> 让 Loop 每改一轮就跑 `typecheck` + `build`，绿了才继续。
> 目标：在现有 `pdf-merge` 基础上，把 PDF 分类补齐成一套完整工具。

---

## ✅ 实施完成（2026-07-13）

9 个工具已全部实现并通过 `typecheck` + `build`（41 页 SSG 预渲染全过）+ Node 核心逻辑冒烟测试。

**依赖变更（用户授权直接装，无需确认）**
- `pdfjs-dist`（v6.1.200）已装；worker 复制到 `public/pdf.worker.min.mjs`，供 PDF 转图片 / 提取文字 / 压缩 在浏览器端使用。
- `pdf-lib` 1.17.1 **不支持加密/密码**，故加密与解密改用分支库 `@cantoo/pdf-lib`（v2.7.2，MIT）。加密 API 为 `doc.encrypt({ userPassword, ownerPassword, permissions })` 后 `save()`；解密为 `load(bytes, { password })`。

**实际落地 slug → 路由**
| 功能 | slug | 路由 | 实现 |
|---|---|---|---|
| 拆分 | `pdf-split` | /tools/pdf-split | pdf-lib copyPages |
| 提取页 | `pdf-extract-pages` | /tools/pdf-extract-pages | pdf-lib copyPages |
| 旋转/重排/删除 | `pdf-reorganize` | /tools/pdf-reorganize | pdf-lib setRotation + 重序 |
| 加密码 | `pdf-encrypt` | /tools/pdf-encrypt | @cantoo/pdf-lib encrypt() |
| 去密码 | `pdf-decrypt` | /tools/pdf-decrypt | @cantoo/pdf-lib load(password) |
| 图片转PDF | `image-to-pdf` | /tools/image-to-pdf | pdf-lib embedJpg/Png |
| PDF转图片 | `pdf-to-image` | /tools/pdf-to-image | pdfjs 渲染 canvas→PNG |
| 提取文字 | `pdf-extract-text` | /tools/pdf-extract-text | pdfjs getTextContent |
| 压缩(方案B) | `pdf-compress` | /tools/pdf-compress | pdfjs 重渲染 + jpeg 重编码重建 |

**待人工浏览器实测**（沙箱无法起服务，视觉效果/交互需人确认）：上传→各工具操作→下载；压缩为栅格化方案（文字不再可选，已在 UI 注明）；扫描件无文本层提取文字会为空（已在 UI 提示）。



---

## 0. 现状与技术约束（开工前必读）

**现状**
- 已有 `pdf-merge`（`src/tools/pdf-merge/`），分类 `pdf`，依赖 `pdf-lib@1.17.1`。
- 每个工具固定 4 处改动 + 可选 i18n（见《LOOP_DEV.md》§4）：
  1. 新建 `src/tools/<slug>/config.ts`
  2. 新建 `src/tools/<slug>/<Name>Client.tsx`（`'use client'` 组件）
  3. 改 `src/tools/registry.ts`（import + 加进 `allTools`）
  4. 改 `src/app/tools/[slug]/ToolPageClient.tsx`（加进 `toolComponentMap`）
  5. 改 `src/i18n/locales/zh.ts` / `en.ts`（可选，不写则显示英文 fallback）

**能力对照表（决定哪些功能需要新依赖）**

| 功能 | 能否用 `pdf-lib` 实现 | 说明 |
|---|---|---|
| 拆分 / 提取页 | ✅ | `copyPages` + 单独 `save` |
| 旋转 / 重排 / 删除 | ✅ | `setRotation` + 按序 `copyPages`（删=跳过） |
| 加密码 | ✅ | `save({ encrypt: { userPassword, ownerPassword, permissions } })` |
| 去密码（已知密码） | ✅ | `load(bytes, { password })` 后不带 encrypt 再 `save` |
| 图片转 PDF | ✅ | `embedJpg` / `embedPng` 逐图成页 |
| 压缩 PDF | ⚠️ 仅轻量 | pdf-lib 重存只能重新 deflate 流，扫描件/大图无效 → 见 F3 人工卡点 |
| PDF 转图片 | ❌ | 需要渲染引擎 → 需引入 `pdfjs-dist`（人工卡点） |
| 提取文字 | ❌ | 需要文本层解析 → 需引入 `pdfjs-dist`（人工卡点） |

**两个「人工卡点」（白名单保护，Loop 不能自动改，需你先确认）**
- 🔒 **新增依赖 `pdfjs-dist`**：仅 F7a（PDF 转图片）、F8（提取文字）需要，属 `package.json` 改动，按《LOOP_DEV.md》§7 必须先人工确认再装。
- 🔒 **压缩策略选型**：F3 的压缩效果取决于方案，需先定策略（见 F3）。

---

## 1. 按功能拆分任务

> 每个功能块内的任务顺序即 Loop 子步：①写 config → ②写 Client → ③注册 → ④门禁校验。
> 「完成标准」用于判断是否 `completed`。

### F1 · PDF 拆分（Split）　slug: `pdf-split`
- [ ] **F1.1** 新建 `src/tools/pdf-split/config.ts`
  - 完成标准：`category: 'pdf'`，`isClientOnly: true`，`relatedTools: ['pdf-merge','pdf-extract-pages']`
- [ ] **F1.2** 新建 `src/tools/pdf-split/PdfSplitClient.tsx`
  - 技术要点：`PDFDocument.load` → 遍历 `getPageIndices()` → 每页 `copyPages` 到新 doc → 单独 `save` 下载；支持两种模式：①每页拆成独立文件（批量打包或直接逐个下载）②按页码区间（如 `1-3, 5, 8-10`）拆成多份
  - UI：上传单/多 PDF、选拆分模式、输出列表带下载
- [ ] **F1.3** 注册：`registry.ts` 加 import + `allTools`；`ToolPageClient.tsx` 加 map 项
- [ ] **F1.4** 门禁：`npm run typecheck` + `npm run build` 全绿；`/tools/pdf-split` 可渲染

### F2 · PDF 提取页面（Extract Pages）　slug: `pdf-extract-pages`
- [ ] **F2.1** 新建 `src/tools/pdf-extract-pages/config.ts`
  - 完成标准：`category: 'pdf'`，`relatedTools: ['pdf-merge','pdf-split']`
- [ ] **F2.2** 新建 `src/tools/pdf-extract-pages/PdfExtractPagesClient.tsx`
  - 技术要点：与 F1 区别——**保留选中页合成一份新 PDF**（而非拆散）；UI 用页码多选/缩略图勾选，输入形如 `1,3,5-9` 的页码
- [ ] **F2.3** 注册到 `registry.ts` + `ToolPageClient.tsx`
- [ ] **F2.4** 门禁：typecheck + build 绿；`/tools/pdf-extract-pages` 可渲染

### F3 · PDF 压缩（Compress）　slug: `pdf-compress`　🔒 含人工卡点
- [ ] **F3.0（人工卡点）** 确定压缩策略，二选一或递进：
  - 方案 A（轻量，纯 pdf-lib）：重新加载并 `save({ useObjectStreams: true })` + 丢弃元数据/冗余对象，对文本型 PDF 有效，对扫描件有限
  - 方案 B（强力）：引入图像重压缩（对页面内图片降分辨率/重编码）或 `ghostscript-wasm`（重，需评估体积与性能）——属新依赖，需你确认
  - 默认建议：**先交付方案 A**，压缩率不足再上 B
- [ ] **F3.1** 新建 `src/tools/pdf-compress/config.ts`
- [ ] **F3.2** 新建 `src/tools/pdf-compress/PdfCompressClient.tsx`
  - UI：上传、显示「压缩前/后」体积对比、进度、下载；若走方案 B 需加质量滑块
- [ ] **F3.3** 注册
- [ ] **F3.4** 门禁 + 用一份真实大 PDF 验证体积确实下降

### F4 · 旋转 / 重新排序 / 删除页（Reorganize）　slug: `pdf-reorganize`
- [ ] **F4.1** 新建 `src/tools/pdf-reorganize/config.ts`
  - 完成标准：三合一单工具，`category: 'pdf'`，`relatedTools: ['pdf-split','pdf-extract-pages']`
- [ ] **F4.2** 新建 `src/tools/pdf-reorganize/PdfReorganizeClient.tsx`
  - 技术要点：
    - **旋转**：`page.setRotation(degrees)`（90° 步进）
    - **重排**：用可拖拽的缩略图/列表，按目标顺序 `copyPages`
    - **删除**：目标顺序里跳过选中页即等于删除
  - UI：左侧页面缩略图网格（可拖拽排序、勾选删除、点旋转），右侧预览/操作，底部「应用并下载」
  - 注：缩略图预览可用 `pdfjs-dist` 渲染，但若不想引入依赖，可先用页码卡片占位（纯 pdf-lib 也能跑逻辑）
- [ ] **F4.3** 注册
- [ ] **F4.4** 门禁 + 实际操作一份多页 PDF 验证增删改序生效

### F5 · 加密码保护（Encrypt）　slug: `pdf-encrypt`
- [ ] **F5.1** 新建 `src/tools/pdf-encrypt/config.ts`
- [ ] **F5.2** 新建 `src/tools/pdf-encrypt/PdfEncryptClient.tsx`
  - 技术要点：`doc.save({ encrypt: { userPassword, ownerPassword, permissions: { printing: 'highResolution', copying: false, ... } } })`
  - UI：上传、设「打开密码」、可选「权限密码」+ 权限勾选（禁止打印/复制等）、下载
- [ ] **F5.3** 注册
- [ ] **F5.4** 门禁 + 用输出文件验证二次打开需密码

### F6 · 去密码（已知密码时）（Decrypt）　slug: `pdf-decrypt`
- [ ] **F6.1** 新建 `src/tools/pdf-decrypt/config.ts`
  - 完成标准：`relatedTools: ['pdf-encrypt']`
- [ ] **F6.2** 新建 `src/tools/pdf-decrypt/PdfDecryptClient.tsx`
  - 技术要点：`PDFDocument.load(bytes, { password })` → 直接 `save()`（不带 encrypt）→ 得到无密码副本
  - UI：上传加密 PDF、输入已知密码、错误密码要有友好提示、下载
- [ ] **F6.3** 注册
- [ ] **F6.4** 门禁 + 用 F5 产出的加密文件验证能正确去密码

### F7a · PDF 转图片（PDF → Image）　slug: `pdf-to-image`　🔒 需先装 `pdfjs-dist`
- [ ] **F7a.0（人工卡点）** 安装 `pdfjs-dist`（`npm i pdfjs-dist`，改 `package.json`/`package-lock.json`，需你确认）
- [ ] **F7a.1** 新建 `src/tools/pdf-to-image/config.ts`
- [ ] **F7a.2** 新建 `src/tools/pdf-to-image/PdfToImageClient.tsx`
  - 技术要点：用 `pdfjs-dist` 的 `getDocument` → 逐页 `getViewport` + 渲染到 `<canvas>` → `toBlob('image/png')` → 逐页/打包下载；可选缩放倍率（清晰度）
  - 注意 worker 配置（Next.js 下需正确指向 pdf.worker），属常见坑，Loop 里重点验证
- [ ] **F7a.3** 注册
- [ ] **F7a.4** 门禁 + 真实 PDF 验证每页都渲染出图

### F7b · 图片转 PDF（Image → PDF）　slug: `image-to-pdf`
- [ ] **F7b.1** 新建 `src/tools/image-to-pdf/config.ts`
  - 完成标准：`relatedTools: ['pdf-to-image']`
- [ ] **F7b.2** 新建 `src/tools/image-to-pdf/ImageToPdfClient.tsx`
  - 技术要点：`PDFDocument.create()` → 遍历图片文件 → `embedJpg`/`embedPng` → 按图片原始比例建页 → `save`
  - UI：多图上传、排序、可选页面尺寸（原图比例 / A4 适应）、下载
- [ ] **F7b.3** 注册
- [ ] **F7b.4** 门禁 + 多张混合 JPG/PNG 验证成册

### F8 · PDF 提取文字（Extract Text）　slug: `pdf-extract-text`　🔒 需 `pdfjs-dist`
- [ ] **F8.0（人工卡点）** 复用 F7a.0 已装的 `pdfjs-dist`（若先做 F7a 则此处无需重复装）
- [ ] **F8.1** 新建 `src/tools/pdf-extract-text/config.ts`
- [ ] **F8.2** 新建 `src/tools/pdf-extract-text/PdfExtractTextClient.tsx`
  - 技术要点：`pdfjs-dist` 逐页 `getTextContent()` → 拼接文本项 → 输出到文本框 + 复制/下载 `.txt`
  - ⚠️ 边界：扫描件（无文本层）提取为空，需在 UI 提示「此 PDF 可能是扫描件，需 OCR（超出本工具范围）」
- [ ] **F8.3** 注册
- [ ] **F8.4** 门禁 + 文本型 PDF 验证文字完整提取

---

## 2. 收尾任务（全部功能完成后）
- [ ] **X1** 更新 `src/tools/categories.ts` 中 `pdf` 分类的 `description` / `intro` / `keywords`，把新增能力写进 SEO 文案（属白名单「框架外」改动，建议人工 review 或明确授权 Loop 改）
- [ ] **X2** 交叉关联 `relatedTools`：确保各 PDF 工具互相引流（合并/拆分/提取/重排/加密/解密/转图 互相 link）
- [ ] **X3** 全量 `npm run build` 通过；本地 `npm run dev` 逐个访问 9 个路由确认无 ChunkLoadError（先 `netstat -ano | grep :3000` 杀旧 `next start` 进程，见《LOOP_DEV.md》§2）
- [ ] **X4（可选）** 补 `zh.ts` / `en.ts` 文案，去掉英文 fallback

---

## 3. 推荐执行顺序（按风险/依赖排序）
1. **第一批（纯 pdf-lib，零新依赖，风险低，可全自动驾驶）**
   F1 拆分 → F2 提取页 → F4 重排旋转删除 → F5 加密 → F6 解密 → F7b 图片转 PDF
2. **人工卡点（你确认后）**
   安装 `pdfjs-dist`；确认 F3 压缩策略
3. **第二批（依赖 pdfjs-dist）**
   F7a PDF 转图片 → F8 提取文字
4. **最后**
   F3 压缩（按选定策略实现）→ 收尾 X1~X4

> 提示：把本清单直接交给 Loop 时，叠加《LOOP_DEV.md》§8 + §10 的提示词补丁，
> 让 Agent 用 TaskCreate 把上面每个 `[ ]` 变成子任务、串好 `blockedBy`、
> 遇到 🔒 卡点任务停下等你确认。
