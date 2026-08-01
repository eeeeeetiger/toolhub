import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('out');
const SITE = 'https://offlinetoolhub.com';
const errors = [];

function read(relativePath) {
  const file = path.join(OUT, relativePath);
  if (!fs.existsSync(file)) {
    errors.push(`Missing exported file: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

function check(condition, message) {
  if (!condition) errors.push(message);
}

function hasCanonical(html, expected) {
  return html.includes(`<link rel="canonical" href="${expected}"`);
}

const home = read('index.html');
const about = read('about.html');
const privacy = read('privacy.html');
const terms = read('terms.html');
const search = read('search.html');
const category = read(path.join('categories', 'pdf.html'));
const tool = read(path.join('tools', 'pdf-merge.html'));
const robots = read('robots.txt');
const sitemap = read('sitemap.xml');
const ads = read('ads.txt');

check(hasCanonical(home, SITE), 'Home canonical is incorrect.');
check(hasCanonical(about, `${SITE}/about`), 'About canonical is incorrect.');
check(hasCanonical(privacy, `${SITE}/privacy`), 'Privacy canonical is incorrect.');
check(hasCanonical(terms, `${SITE}/terms`), 'Terms canonical is incorrect.');
check(hasCanonical(search, `${SITE}/search`), 'Search canonical is incorrect.');
check(hasCanonical(category, `${SITE}/categories/pdf`), 'Category canonical is incorrect.');
check(hasCanonical(tool, `${SITE}/tools/pdf-merge`), 'Tool canonical is incorrect.');

check(
  /<meta name="robots" content="[^"]*noindex[^"]*"/.test(search),
  'Search page must include a noindex robots directive.',
);
check(robots.includes(`Sitemap: ${SITE}/sitemap.xml`), 'robots.txt sitemap is incorrect.');
check(robots.includes(`Host: ${SITE}`), 'robots.txt host is incorrect.');
check(!sitemap.includes(`<loc>${SITE}/search</loc>`), 'Search page must not be in sitemap.xml.');
check(sitemap.includes(`<loc>${SITE}/about</loc>`), 'About page is missing from sitemap.xml.');
check(sitemap.includes(`<loc>${SITE}/privacy</loc>`), 'Privacy page is missing from sitemap.xml.');
check(sitemap.includes(`<loc>${SITE}/terms</loc>`), 'Terms page is missing from sitemap.xml.');

const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
check(sitemapUrls.length >= 190, `Expected at least 190 sitemap URLs, found ${sitemapUrls.length}.`);
check(
  sitemapUrls.every((url) => url === SITE || url.startsWith(`${SITE}/`)),
  'Sitemap contains a URL from another domain.',
);

const exportedSignals = [home, about, privacy, terms, search, category, tool, robots, sitemap].join('\n');
check(!exportedSignals.includes('toolhub.dev'), 'Export still contains toolhub.dev.');
check(!ads.includes('pub-000000'), 'ads.txt contains a placeholder publisher ID.');
check(home.includes('Offline ToolHub'), 'Exported homepage is missing the Offline ToolHub brand.');

if (errors.length > 0) {
  console.error(`SEO readiness failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`SEO readiness passed: ${sitemapUrls.length} sitemap URLs verified.`);
