# toolhub · Loop 开发手册

> 用「观察 → 规划 → 执行 → 校验」的循环方式开发 toolhub，让 AI Agent 自转、人只在关键节点确认。
> 适用：新增工具、修 bug、批量改组件、补 i18n 等日常开发任务。

---

## 1. 核心心法

Loop 开发不是"让 AI 一次性写完"，而是**把任务拆成可验证的小步，让 Agent 每改一轮就自己跑门禁，绿了才继续，红了就回修**。

- Agent 是"执行者"，你是"监理"。
- 每一轮必须有**客观反馈信号**（typecheck / build 通过），不接受"我觉得改好了"。
- 核心配置与对外敏感文件**不放进 Loop 自动改**，必须人工处理。

---

## 2. 门禁（Loop 的校验信号，必跑）

在 toolhub 根目录 `D:\workbuddy\aitools\toolhub` 下：

```bash
npm run typecheck   # tsc --noEmit，类型门禁
npm run build       # next build，构建门禁（最硬的一道）
npm run lint        # next lint（可选，规范门禁）
```

**规则**：每轮代码修改后，先 `typecheck` 再 `build`，两个都绿才算本轮通过。任一报错 → 回到执行环节修，再跑，直到绿。

**重试上限**：同一错误连续修 **3 次** 仍然不绿 → 停止循环，转人工介入。防止空转。

**构建前必查**：跑 `build` 前先确认没有遗留的 `next start` 进程占着 3000 端口（`netstat -ano | grep :3000`）。旧进程残留会导致新 build 的页面引用已删除的旧 chunk → 浏览器 ChunkLoadError → 页面一直 Loading。杀掉旧进程再 build。

---

## 3. 一次标准 Loop（以"新增一个工具"为例）

### 第 0 步 · 定目标与验收（人做）
写清：工具名、slug、分类、验收标准。
> 例：新增「二维码生成器 / qr-generator」，分类 `developer`。
> 验收 = typecheck 通过 + build 通过 + `/tools/qr-generator` 能渲染 + 已在 registry 与 ToolPageClient map 注册。

### 第 1 轮 Loop（Agent 自转）
1. **观察**：读最近的工具作参考——
   - `src/tools/uuid-generator/`（最简单、纯 client 工具）
   - `src/tools/image-compressor/`（带 wasm / worker 的复杂工具）
   - 约定文件：`src/tools/types.ts`、`src/tools/registry.ts`、`src/tools/categories.ts`、`src/app/tools/[slug]/ToolPageClient.tsx`
2. **规划**：拆 3 个小步 → ①写 `config.ts` ②写 `<Name>Client.tsx` ③注册进 `registry.ts` 与 `ToolPageClient.tsx` 的 map（若需 i18n 再 +1 步）
3. **执行**：依次创建 / 修改文件
4. **校验**：跑 `npm run typecheck` + `npm run build`
5. **反馈**：报错 → 回执行修；通过 → 收敛

### 人工卡点（人做）
按 §10 任务列表模式，只在标记了「人工卡点」的任务处暂停等你确认；非卡点任务 Agent 自动推进，不需要你逐轮看 diff。

---

## 4. 新增工具 · 文件清单模板

一个工具涉及 **4 处改动 + 可选 i18n**：

| 文件 | 动作 | 说明 |
|---|---|---|
| `src/tools/<slug>/config.ts` | 新建 | `ToolConfig` 元数据（见 §5） |
| `src/tools/<slug>/<Name>Client.tsx` | 新建 | `'use client'` 组件，实际逻辑 |
| `src/tools/registry.ts` | 改 | import 并加入 `allTools` 数组 |
| `src/app/tools/[slug]/ToolPageClient.tsx` | 改 | import 并加入 `toolComponentMap` |
| `src/i18n/locales/zh.ts` / `en.ts` | 改（可选） | 词条；不写则界面显示 fallback 英文 |

> 分类只能取 `text` / `developer` / `seo` / `image` / `pdf`（`src/tools/types.ts`）。
> 若新工具不属于现有分类，**先人工**在 `categories.ts` 加分类，再交给 Loop。

---

## 5. config.ts 模板

```ts
import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'my-tool',                       // 唯一，对应路由 /tools/my-tool
  name: 'My Tool',                       // 展示名
  description: '一句话描述，用于 SEO / 卡片。',
  longDescription: '更长的说明，用于工具页顶部。',
  category: 'developer',                 // 必须是 5 个枚举之一
  keywords: ['my tool', '工具关键词'],     // SEO
  icon: 'Code',                         // lucide-react 图标名
  isClientOnly: true,                   // 纯前端工具填 true
  features: ['特性1', '特性2'],
  relatedTools: ['uuid-generator'],      // 可选，关联工具 slug
};
```

## 6. Client 组件模板

```tsx
'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';
import { copyToClipboard } from '@/lib/utils';

export default function MyToolClient() {
  const { t } = useI18n();
  // 用 useState 管理状态，用 t('tools.my-tool.xxx', 'fallback') 取文案
  return (
    <div className="space-y-3">
      {/* 你的 UI，沿用 Tailwind 现有类（bg-brand / border-slate-200 等）*/}
    </div>
  );
}
```

---

## 7. 禁止 Loop 自动改的文件（白名单保护）

以下文件一旦被 Loop 误改，影响面大、难回滚，**必须人工确认后再动**：

- `next.config.ts`、`tsconfig.json`、`tailwind.config.js`、`postcss.config.mjs`
- `package.json` / `package-lock.json`（依赖变更需人审）
- `src/i18n/` 框架本身（只让 Loop 加词条，不动 provider/config 结构）
- `src/lib/seo.ts`、`src/lib/utils.ts`（公共依赖，改了会波及其他工具）
- 限流代理、AdSense 相关代码片段、任何含密钥 / Token 的文件
- `src/app/layout.tsx`、`src/app/providers.tsx`（全局壳，动一处全站受影响）

> 给 Agent 的提示词里显式写："只能改 `src/tools/<slug>/` 下的新文件，以及 registry.ts 和 ToolPageClient.tsx 的对应注册行；其余文件一律不要碰。"

---

## 8. 给 Agent 的 Loop 提示词模板（可直接复制）

```
你正在用 Loop 方式开发 toolhub（Next.js 15 + React 19 + Tailwind v3）。
任务：<说明要做什么，例如新增 qr-generator 工具>。

请按循环推进，每轮只做一小步：
1. 观察：先读 src/tools/uuid-generator/ 作为参考，理解 ToolConfig 约定。
2. 规划：拆成可验证的小步，列出来。
3. 执行：创建 / 修改文件。
4. 校验：跑 `npm run typecheck` 和 `npm run build`，两个都绿才算通过；报错就回修再跑。

约束（硬规则）：
- 只能新建 src/tools/<slug>/ 下的文件，以及改动 src/tools/registry.ts、src/app/tools/[slug]/ToolPageClient.tsx 的注册行。
- 禁止改动 next.config.ts / tsconfig.json / tailwind.config.js / package.json / src/i18n 框架 / src/lib/* / layout / providers。
- 不要碰任何含密钥、Token、AdSense、限流代理的代码。
- 同一错误连续修 3 次不绿 → 停下汇报，不空转。
- 每轮结束报告：改了哪些文件、typecheck/build 结果、是否需要我（人）确认。
- 如需自动推进多轮（不逐轮等确认），叠加 §10 的任务列表补丁。
```

---

## 9. 何时不用 Loop

- 改核心配置 / 全局壳 / 依赖升级 → 手动，别交给 Loop。
- 需求极度明确、一步到位的微型改动 → 直接做更快。
- 没有清晰验收标准（"优化一下体验"这种）→ 先人定标准，再 Loop。
- 涉及支付、鉴权、密钥等致命正确性场景 → 强约束 + 人工 review，不信任自转。

---

## 10. 结合任务列表自动推进

把任务列表（TaskCreate / TaskUpdate / TaskList）当作 Loop 的「规划产物 + 状态机」。目标拆成任务后，Agent 就能在无人逐步干预下自转多轮，只在人工卡点停顿。

### 映射关系

| Loop 环节 | 任务列表动作 |
|---|---|
| 规划（拆小步） | `TaskCreate` 把目标拆成 N 个带明确完成标准的子任务 |
| 执行（动手改） | `TaskList` 取下一个未阻塞任务 → `TaskUpdate(in_progress)` → 改代码 |
| 校验（门禁） | 改完跑 `typecheck`/`build`：通过 → `completed`；失败 → 留 `in_progress` 回修 |
| 人工卡点 | 标记需确认的任务（核心配置 / 白名单），到它时暂停等人 |
| 收敛 | `TaskList` 全 `completed` → 自动停止并汇总 |

### 自动推进流程

1. 目标确定后，一次性 `TaskCreate` 所有子任务，用 `blockedBy` 串好依赖（如 Client 依赖 config）。
2. Agent 循环：`TaskList` 找 `pending` 且无 `blockedBy` 的任务 → 置 `in_progress` → 观察 / 执行 → 跑门禁。
3. 门禁绿 → `completed` → 自动取下一个；红 → 当前任务内回修（不新建任务），再跑。
4. 遇到「需人工确认」标记的任务（或白名单文件改动），停下 `AskUserQuestion`，人确认后再 `completed`。
5. 全部 `completed` → 输出变更清单 + 构建结果，结束。

### 给 Agent 的提示词补丁（叠加到 §8）

```
用任务列表推进：先把目标拆成 TaskCreate 子任务（每个写清完成标准），
然后循环 TaskList→取下一个 in_progress→改代码→typecheck/build 门禁→
通过则 completed 并继续，失败则回修。遇到需改白名单文件或我标记的人
工卡点任务时，停下等我确认，不要自行 completed。全部 completed 后汇总。
```

### 要点

- 任务粒度 = 一个 Loop 子步，别太碎也别太大（一个工具 ≈ 3~5 个任务）。
- 每个任务必须有可验证的「完成标准」，否则 Agent 无法判断该不该 `completed`。
- 日常开发建议保留人工卡点，只在关键任务（需确认效果/合规/支付等）给你确认。完全无人值守需额外配置定时触发等基础设施，不是 Agent 自身能落地。

