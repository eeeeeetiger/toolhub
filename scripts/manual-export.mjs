// Manual static export: replicates `next build` + `output:'export'` file copy,
// but writes into a fresh `out_export/` directory (the sandbox locks `out/`).
// Copies prerendered .html from .next/server/app + static assets + public/.
import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';

const ROOT = process.cwd();
const SRC_APP = join(ROOT, '.next/server/app');
const SRC_STATIC = join(ROOT, '.next/static');
const SRC_PUBLIC = join(ROOT, 'public');
const OUT = join(ROOT, 'out_export');

if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// 1) Copy each prerendered .html preserving route path; _not-found.html -> 404.html
let htmlCount = 0;
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) { walk(full); continue; }
    if (!name.endsWith('.html')) continue;
    let rel = full.slice(SRC_APP.length + 1).replace(/\\/g, '/');
    if (rel === '_not-found.html') rel = '404.html';
    const dest = join(OUT, rel);
    mkdirSync(dirname(dest), { recursive: true });
    cpSync(full, dest);
    htmlCount++;
  }
}
walk(SRC_APP);

// 1b) Copy special non-HTML routes emitted by Next as `<route>/<file>.body`
//     (e.g. robots.txt, sitemap.xml, icon.svg, favicon.ico). These are critical
//     for SEO/AdSense (sitemap.xml) and are skipped by the .html-only walk above.
const SPECIAL_ROUTES = ['robots.txt', 'sitemap.xml', 'icon.svg', 'favicon.ico'];
let specialCount = 0;
for (const route of SPECIAL_ROUTES) {
  const body = join(SRC_APP, route + '.body');
  if (existsSync(body)) {
    cpSync(body, join(OUT, route));
    specialCount++;
  }
}

// 2) Copy static assets -> out_export/_next/static
if (existsSync(SRC_STATIC)) {
  cpSync(SRC_STATIC, join(OUT, '_next/static'), { recursive: true });
}

// 3) Copy public/ (overwrites) -> out_export/
if (existsSync(SRC_PUBLIC)) {
  cpSync(SRC_PUBLIC, OUT, { recursive: true });
}

writeFileSync(join(OUT, '.exported'), new Date().toISOString());
console.log('Manual export complete:', htmlCount, 'html pages,', specialCount, 'special routes ->', OUT);
