import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const cwd = 'D:/workbuddy/aitools/toolhub';
const TOKEN = fs.readFileSync('D:/workbuddy/aitools/github class token.txt', 'utf8').trim();
const OWNER = 'eeeeeetiger';
const REPO = 'toolhub';
const API = `https://api.github.com/repos/${OWNER}/${REPO}`;
const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: 'application/vnd.github+json',
  'User-Agent': 'toolhub-deploy',
  'Content-Type': 'application/json',
};

async function gh(method, url, body) {
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const txt = await res.text();
  if (!res.ok) throw new Error(`GitHub API ${method} ${url} -> ${res.status}: ${txt.slice(0, 800)}`);
  return txt ? JSON.parse(txt) : {};
}

const ref = await gh('GET', `${API}/git/refs/heads/main`);
const baseSha = ref.object.sha;
const baseCommit = await gh('GET', `${API}/git/commits/${baseSha}`);
const baseTree = baseCommit.tree.sha;
console.error('base commit', baseSha, 'tree', baseTree);

const files = execSync('git diff --cached --name-only', { cwd })
  .toString().split('\n').map((s) => s.trim()).filter(Boolean);
console.error('changed files:', files.length);

const treeEntries = [];
let i = 0;
for (const f of files) {
  const buf = fs.readFileSync(path.join(cwd, f));
  const b64 = buf.toString('base64');
  const blob = await gh('POST', `${API}/git/blobs`, { content: b64, encoding: 'base64' });
  treeEntries.push({ path: f, mode: '100644', type: 'blob', sha: blob.sha });
  i++;
  if (i % 25 === 0) console.error(`  blobs ${i}/${files.length}`);
}
console.error('all blobs done');

const tree = await gh('POST', `${API}/git/trees`, { base_tree: baseTree, tree: treeEntries });
console.error('tree', tree.sha);

const msg = 'feat: add per-tool SEO howTo/faqs, blog nav + sitemap blog entries';
const commit = await gh('POST', `${API}/git/commits`, { message: msg, tree: tree.sha, parents: [baseSha] });
console.error('commit', commit.sha);

await gh('PATCH', `${API}/git/refs/heads/main`, { sha: commit.sha, force: false });
console.error('PUSHED main ->', commit.sha);

process.stdout.write(commit.sha);
