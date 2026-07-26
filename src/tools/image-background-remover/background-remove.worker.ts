// 成熟纯色去背算法：色彩键控（魔棒 + 洪水填充）
// 原理与 Photoshop「选择颜色范围 + 删除背景」一致，纯原生像素计算，零依赖、可离线。
// 不引入任何 AI / 机器学习模型。
//
// 三步：
//   1. inferBackgroundColor  —— 扫描四条边缘，按 16 档粗桶找众数色 → 背景色
//   2. floodFillBackground    —— 从四条边种子点出发，按 RGB 平方欧氏距离 ≤ tolerance 蔓延，
//                                只删「连着边、且同色」的区域（物体没碰边/不连边则不误删）
//   3. 边缘处理               —— 背景像素直接透明；边缘附近按色距做半透明羽化(feather)；
//                                再做去色溢(spill suppression)消除主体边缘残留的背景光圈

export interface SolidOptions {
  tolerance?: number; // 容差，范围 8–96（按 0–255 计），默认 48。越大越宽容
  feather?: number;   // 羽化强度，范围 0–4，默认 1。越大边缘越柔
}

type RGB = [number, number, number];

// 第 1 步：猜背景色
// 扫描图片四条边缘像素，按每通道 16 档粗桶归类，找出现次数最多的颜色当作背景色。
// 若边缘没有任何不透明像素，默认白色。
export function inferBackgroundColor(img: ImageData): RGB {
  const { data, width, height } = img;
  const bucket = (v: number) => Math.floor(v / 16) * 16; // 16 档量化，抗噪
  const counts = new Map<string, { r: number; g: number; b: number; count: number; a: number }>();

  const consider = (x: number, y: number) => {
    const i = (y * width + x) * 4;
    if (data[i + 3] < 128) return; // 跳过透明边缘像素
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key = `${bucket(r)},${bucket(g)},${bucket(b)}`;
    const e = counts.get(key);
    if (e) { e.r += r; e.g += g; e.b += b; e.count++; }
    else counts.set(key, { r, g, b, count: 1, a: 0 });
  };

  // 四条边各采一条（宽度 1px 即可，足够代表背景）
  for (let x = 0; x < width; x++) { consider(x, 0); consider(x, height - 1); }
  for (let y = 0; y < height; y++) { consider(0, y); consider(width - 1, y); }

  if (counts.size === 0) return [255, 255, 255]; // 无边缘像素 → 默认白

  let best = { r: 255, g: 255, b: 255, count: 0 };
  for (const e of counts.values()) {
    if (e.count > best.count) best = e;
  }
  return [
    Math.round(best.r / best.count),
    Math.round(best.g / best.count),
    Math.round(best.b / best.count),
  ];
}

// 第 2 步：洪水填充标背景
// 从四条边上的像素出发，凡是「和背景色够接近」标记为背景；再向上下左右蔓延，
// 只要邻居也接近背景色就一并标记；遇到色差大的像素就停。
// 返回：bgMask（1=背景）、edgeDist（每个像素到背景色的色距，用于羽化/去色溢）
function floodFillBackground(
  img: ImageData,
  bg: RGB,
  tol: number,
): { bgMask: Uint8Array; dist: Float32Array } {
  const { data, width, height } = img;
  const N = width * height;
  const bgMask = new Uint8Array(N);
  const dist = new Float32Array(N); // 平方欧氏距离（用于羽化 + 去色溢）
  const tol2 = tol * tol;

  // 预计算每像素到背景色的平方距离
  for (let i = 0; i < N; i++) {
    const j = i * 4;
    const dr = data[j] - bg[0];
    const dg = data[j + 1] - bg[1];
    const db = data[j + 2] - bg[2];
    dist[i] = dr * dr + dg * dg + db * db;
  }

  // 栈式非递归洪水填充（避免大图爆栈）
  const stack: number[] = [];
  const seed = (x: number, y: number) => {
    const idx = y * width + x;
    if (bgMask[idx]) return;
    if (dist[idx] <= tol2) { bgMask[idx] = 1; stack.push(idx); }
  };
  // 从四条边播种
  for (let x = 0; x < width; x++) { seed(x, 0); seed(x, height - 1); }
  for (let y = 0; y < height; y++) { seed(0, y); seed(width - 1, y); }

  while (stack.length) {
    const idx = stack.pop()!;
    const px = idx % width;
    const py = (idx / width) | 0;
    // 4 邻域
    if (px + 1 < width) { const ni = idx + 1; if (!bgMask[ni] && dist[ni] <= tol2) { bgMask[ni] = 1; stack.push(ni); } }
    if (px - 1 >= 0)    { const ni = idx - 1; if (!bgMask[ni] && dist[ni] <= tol2) { bgMask[ni] = 1; stack.push(ni); } }
    if (py + 1 < height){ const ni = idx + width; if (!bgMask[ni] && dist[ni] <= tol2) { bgMask[ni] = 1; stack.push(ni); } }
    if (py - 1 >= 0)    { const ni = idx - width; if (!bgMask[ni] && dist[ni] <= tol2) { bgMask[ni] = 1; stack.push(ni); } }
  }

  return { bgMask, dist };
}

// 边缘羽化：对 bgMask 做若干次盒式模糊，得到 0–255 的 alpha（背景→0，主体→255）
function featherAlpha(bgMask: Uint8Array, width: number, height: number, passes: number): Float32Array {
  const N = width * height;
  let alpha = new Float32Array(N);
  for (let i = 0; i < N; i++) alpha[i] = bgMask[i] ? 0 : 255; // 背景=透(0)，主体=不透(255)
  for (let p = 0; p < passes; p++) {
    const next = alpha.slice();
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x;
        let s = alpha[i];
        let n = 1;
        if (x > 0) { s += alpha[i - 1]; n++; }
        if (x < width - 1) { s += alpha[i + 1]; n++; }
        if (y > 0) { s += alpha[i - width]; n++; }
        if (y < height - 1) { s += alpha[i + width]; n++; }
        next[i] = s / n;
      }
    }
    alpha = next;
  }
  return alpha;
}

// 第 3 步：去色溢（spill suppression）
// 把主体边缘残留的背景色「扣掉」：对已保留（alpha>8）的像素，若其原始颜色仍接近背景色，
// 按比例把它往灰度方向拉，消除主体边缘那圈背景色光圈。
function despill(
  img: ImageData,
  alpha: Float32Array,
  bg: RGB,
  tol: number,
): void {
  const { data, width, height } = img;
  const N = width * height;
  const tol2 = tol * tol;
  for (let i = 0; i < N; i++) {
    const j = i * 4;
    if (alpha[i] <= 8) continue; // 已透明的背景不处理
    const dr = data[j] - bg[0];
    const dg = data[j + 1] - bg[1];
    const db = data[j + 2] - bg[2];
    const d2 = dr * dr + dg * dg + db * db;
    if (d2 < tol2) {
      // 仍残留背景色 → 按「接近程度」做去色溢：越接近背景色，扣得越多
      const k = 1 - Math.sqrt(d2) / tol; // 0(边界)~1(完全背景色)
      const gray = (data[j] + data[j + 1] + data[j + 2]) / 3;
      data[j] = Math.round(data[j] + (gray - data[j]) * k);
      data[j + 1] = Math.round(data[j + 1] + (gray - data[j + 1]) * k);
      data[j + 2] = Math.round(data[j + 2] + (gray - data[j + 2]) * k);
    }
  }
}

// 主入口：纯色去背
// 返回去背后的 ImageData 与「背景像素占比」（供 fallback 判断）
export function removeSolidBackground(
  img: ImageData,
  opts: SolidOptions = {},
): { data: ImageData; bgRatio: number } {
  const tol = opts.tolerance ?? 48;
  const featherPasses = opts.feather ?? 1;

  const bg = inferBackgroundColor(img);
  const { bgMask, dist } = floodFillBackground(img, bg, tol);

  // 背景占比（用于 auto 模式判断是否 fallback 智能）
  let bgCount = 0;
  for (let i = 0; i < bgMask.length; i++) if (bgMask[i]) bgCount++;
  const bgRatio = bgCount / (img.width * img.height);

  // 羽化得到 alpha
  const alpha = featherAlpha(bgMask, img.width, img.height, Math.max(1, Math.round(featherPasses)));

  // 拷贝像素 + 应用 alpha + 去色溢
  const out = new Uint8ClampedArray(img.data.length);
  out.set(img.data);
  for (let i = 0; i < img.width * img.height; i++) {
    out[i * 4 + 3] = alpha[i];
  }
  const result = new ImageData(out, img.width, img.height);
  despill(result, alpha, bg, tol);

  return { data: result, bgRatio };
}
