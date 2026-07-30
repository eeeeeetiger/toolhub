import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const exportRoot = path.join(projectRoot, 'out');
let pass = 0;
const failures = [];

function check(condition, name) {
  if (condition) pass++;
  else failures.push(name);
}

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

function existsInExport(relativePath) {
  return fs.existsSync(path.join(exportRoot, relativePath));
}

const registrySource = read('src/tools/registry.ts');
const configFolders = [...registrySource.matchAll(/from '\.\/([a-z0-9-]+)\/config'/g)].map((match) => match[1]);
const tools = configFolders.map((folder) => {
  const source = read(`src/tools/${folder}/config.ts`);
  return {
    folder,
    slug: source.match(/slug:\s*'([^']+)'/)?.[1],
    name: source.match(/name:\s*'([^']+)'/)?.[1],
    category: source.match(/category:\s*'([^']+)'/)?.[1],
  };
});

check(tools.length > 0, 'registry contains tools');
check(new Set(configFolders).size === configFolders.length, 'registry config imports are unique');
check(tools.every((tool) => tool.slug && tool.name && tool.category), 'every config has slug, name, and category');
check(new Set(tools.map((tool) => tool.slug)).size === tools.length, 'tool slugs are unique');
check(tools.every((tool) => tool.folder === tool.slug), 'config folder matches tool slug');

const toolPageSource = read('src/app/tools/[slug]/ToolPageClient.tsx');
const mappedSlugs = new Set(
  [...toolPageSource.matchAll(/(?:'([a-z0-9-]+)'|\b([a-z][a-z0-9-]*)):\s*[A-Z]\w+/g)].map((match) => match[1] ?? match[2]),
);
for (const tool of tools) check(mappedSlugs.has(tool.slug), `component mapping exists: ${tool.slug}`);

check(existsInExport('index.html'), 'home page export exists');
for (const route of ['about', 'privacy', 'search', 'terms']) {
  check(existsInExport(`${route}.html`), `static page export exists: ${route}`);
}
for (const file of ['robots.txt', 'sitemap.xml', 'icon.svg']) {
  check(existsInExport(file), `special route export exists: ${file}`);
}

const sitemap = fs.readFileSync(path.join(exportRoot, 'sitemap.xml'), 'utf8');
const referencedAssets = new Set();
function inspectHtml(relativePath, expectedRoute) {
  const absolutePath = path.join(exportRoot, relativePath);
  check(fs.existsSync(absolutePath), `HTML export exists: ${relativePath}`);
  if (!fs.existsSync(absolutePath)) return;
  const html = fs.readFileSync(absolutePath, 'utf8');
  check(/^<!DOCTYPE html>/i.test(html), `valid HTML document: ${relativePath}`);
  check(/<title>[^<]*ToolHub[^<]*<\/title>/i.test(html), `page has ToolHub title: ${relativePath}`);
  check(html.includes('__next_f.push'), `page has Next.js payload: ${relativePath}`);
  check(!/(Application error|Internal Server Error)/i.test(html), `no rendered error marker: ${relativePath}`);
  if (expectedRoute) check(html.includes(expectedRoute), `page contains expected route: ${relativePath}`);
  for (const match of html.matchAll(/(?:src|href)="(\/_next\/[^"?#]+)[^\"]*"/g)) {
    referencedAssets.add(decodeURIComponent(match[1]).slice(1));
  }
}

inspectHtml('index.html');
for (const tool of tools) {
  inspectHtml(`tools/${tool.slug}.html`, `/tools/${tool.slug}`);
  check(sitemap.includes(`/tools/${tool.slug}`), `sitemap contains tool: ${tool.slug}`);
}

const categories = [...new Set(tools.map((tool) => tool.category))];
for (const category of categories) inspectHtml(`categories/${category}.html`);
for (const asset of referencedAssets) check(existsInExport(asset), `referenced asset exists: ${asset}`);

console.log(`Static smoke tests: ${pass} passed / ${failures.length} failed`);
console.log(`Coverage: ${tools.length} tool pages, ${categories.length} category pages, ${referencedAssets.size} referenced assets`);
if (failures.length) {
  console.log('\nFailures:');
  for (const failure of failures) console.log(` - ${failure}`);
  process.exit(1);
}
