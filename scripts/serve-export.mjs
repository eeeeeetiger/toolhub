// Static server for the exported site in out/ (or EXPORT_DIR when provided).
// Supports Next.js export clean URLs: /tools/foo -> /tools/foo.html, / -> /index.html.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';

const ROOT = join(process.cwd(), process.env.EXPORT_DIR || 'out');
const PORT = Number(process.env.PORT || 8080);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.wasm': 'application/wasm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

async function resolve(reqPath) {
  const clean = decodeURIComponent(reqPath.split('?')[0]);
  const base = normalize(join(ROOT, clean));
  if (!base.startsWith(ROOT)) return null; // path traversal guard
  const candidates = [base];
  if (!extname(base)) {
    candidates.push(base + '.html');
    candidates.push(join(base, 'index.html'));
  } else if (base.endsWith('/')) {
    candidates.push(join(base, 'index.html'));
  }
  for (const c of candidates) {
    try { const s = await stat(c); if (s.isFile()) return c; } catch {}
  }
  return null;
}

createServer(async (req, res) => {
  try {
    const file = await resolve(req.url || '/');
    if (!file) { res.writeHead(404, { 'Content-Type': 'text/html' }); res.end('<h1>404</h1>'); return; }
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(body);
  } catch (e) {
    res.writeHead(500); res.end('Server error: ' + e.message);
  }
}).listen(PORT, () => console.log(`Serving out_export on http://localhost:${PORT}`));
