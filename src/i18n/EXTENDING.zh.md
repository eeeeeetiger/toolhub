# ToolHub 多语言扩展指南（中文）

当前框架已支持运行时切换语言、localStorage 记忆、未翻译自动回退英文（英文是源语言）。
加一门新语言（如越南语 `vi`、印地语 `hi`、西班牙语 `es`、法语 `fr`）只需两步。

## 第一步：注册语言代码

编辑 `src/i18n/config.ts`：

```ts
export const locales = ['en', 'zh', 'vi'] as const;   // 加上新代码
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  vi: 'Tiếng Việt',   // 加显示名（用该语言自称，便于切换器展示）
};
```

> 提示：所有语言显示名都写在 `localeLabels` 里，切换器（locale-switcher）会自动列出，无需改 UI 组件。

## 第二步：新建字典文件

复制 `src/i18n/locales/zh.ts` 为 `src/i18n/locales/vi.ts`，把中文改成对应语言。
文件结构必须与 `en.ts`（源字典）完全一致——键的路径、层级、数组顺序都要对齐，否则回退会错位。

```ts
// src/i18n/locales/vi.ts
export const vi = {
  common: { /* ... */ },
  brand: { /* ... */ },
  categories: { /* ... */ },
  tools: {
    'word-counter': {
      name: '...',          // 越南语
      description: '...',
      features: ['...', '...'],
    },
    // 其余工具照抄，只改文案
  },
};
```

然后在 `src/i18n/store.ts` 导入并登记：

```ts
import { vi } from './locales/vi';
const dictionaries: Record<Locale, Record<string, unknown>> = { en, zh, vi };
```

完成。无需改任何组件——`useI18n().t(key, fallback)` 会自动查新字典，查不到就回退英文。

## 翻译范围建议

- **全局文案**（首页/分类/页脚/导航）：`common` / `brand` / `categories` 三段，必须翻。
- **工具名 / 描述 / 特性**：`tools.<slug>.name` / `.description` / `.features`（卡片、工具头、相关工具都从这里取）。
- **工具内部 UI**（按钮、标签）：在 `tools.<slug>.ui` 下，按需补。未翻则显示英文（不影响使用）。

## 调试技巧

- 浏览器打开站点 → 右上角语言切换器切到目标语言。
- 若某处还是英文，说明该 key 在新字典里缺失，补上即可（无需重启，热更新）。
- `en.ts` 顶部注释也写了同样说明，可直接参考。

## 暂未做的事（如需再扩展）

- **URL 语言前缀**（`/vi/tools/...`、`hreflang`）：当前靠前端切换 + localStorage，未做独立 URL。
  若要做多语言 SEO（让 Google 分语言收录），需在 `next.config` 加 i18n 路由 + 中间件 + `generateStaticParams` 按语言生成页面，并补 `alternates.languages` 的 hreflang。本期未做。
- **RTL 语言**（阿拉伯语等）：`localeLabels` 可加 `dir` 字段，layout 据其设 `dir="rtl"`，当前未预置。
