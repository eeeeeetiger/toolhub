import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 纯静态导出：构建产物输出到 out/ 目录，可被任意托管（Cloudflare Pages / Vercel / 阿里云 OSS 等）
  // 直接服务。同一份产物海外、国内通用，是「一套代码两地部署」的前提。
  output: 'export', // 纯静态导出：构建产物输出到 out/ 目录
  // 静态导出下不使用 Next 图片优化（项目未用 next/image，设为 true 以防万一）。
  images: { unoptimized: true },
  // Windows dev-server workaround: the WASM-heavy image-worker chunk crashes
  // Next's Jest worker child processes on the /tools/[slug] route. Forcing
  // static-worker requests off and limiting CPUs keeps dev SSR in-process and
  // stable. Production build is unaffected (it prerenders all tool routes fine).
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  // 视频工具路由的跨源隔离请求头（ffmpeg.wasm 需要 SharedArrayBuffer）：
  // 静态导出不支持 next.config 里的 headers()，改由 public/_headers 在托管端下发（见 public/_headers）。
};

export default nextConfig;
