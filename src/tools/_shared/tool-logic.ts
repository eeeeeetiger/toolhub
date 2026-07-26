// 纯函数逻辑层：从各工具组件抽出的核心算法，供组件复用 + Node 自动化测试直接导入。
// 约束：禁止引入 React / next / 浏览器专属 API（document、navigator、window）。
// 约束：本模块必须零 import（Node strip-types 测试要求 ESM 显式扩展名，依赖越少越好）。
// 允许使用 Node 22 与浏览器共有的 API：crypto.subtle、crypto.getRandomValues、btoa、TextEncoder。

// 与 src/lib/utils.ts 的 slugify 保持一致（改动请两边同步）。
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ============================== case-converter ==============================

// English headline-style Title Case: capitalize major words, lowercase
// short articles/conjunctions/prepositions (unless first or last word).
const TITLE_SMALL = new Set([
  'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'yet', 'so',
  'as', 'at', 'by', 'in', 'of', 'on', 'to', 'up', 'via', 'per', 'out', 'off',
]);

export function toTitleCase(s: string): string {
  const words = s.toLowerCase().match(/[^\s]+/g) || [];
  return words
    .map((w, i) => {
      const clean = w.replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, '');
      if (i !== 0 && i !== words.length - 1 && TITLE_SMALL.has(clean)) {
        return w.toLowerCase();
      }
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(' ');
}

export function toSentenceCase(s: string): string {
  return s
    .replace(/\.\s+([a-z])/g, (_, c) => '. ' + (c as string).toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function toCamel(s: string): string {
  return s
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => (c ? (c as string).toUpperCase() : ''))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

export function toSnake(s: string): string {
  return s
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/^_+|_+$/g, '');
}

// ============================== word-counter ==============================

export interface WordStats {
  words: number;
  chars: number;
  charsNoSpaces: number;
  sentences: number;
  lines: number;
  paragraphs: number;
  readingTime: number;
}

export function getWordStats(text: string): WordStats {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const sentences = trimmed ? (trimmed.match(/[.!?]+(\s|$)/g) || []).length : 0;
  const lines = text ? text.split(/\n/).filter((l) => l.trim()).length : 0;
  const paragraphs = text ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
  const readingTime = Math.max(1, Math.ceil(words / 200));
  return { words, chars, charsNoSpaces, sentences, lines, paragraphs, readingTime };
}

export interface KeywordDensityItem { word: string; count: number; pct: number }

export function getKeywordDensity(text: string, limit = 8): KeywordDensityItem[] {
  if (!text.trim()) return [];
  const words = text.toLowerCase().match(/[a-z0-9']+/g) || [];
  const counts: Record<string, number> = {};
  words.forEach((w) => (counts[w] = (counts[w] || 0) + 1));
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count, pct: Math.round((count / words.length) * 100) }));
}

// ============================== text tools (TextToolClient) ==============================

export interface SortTextOptions { asc: boolean; dedupe: boolean; trim: boolean; dropEmpty: boolean }

export function sortText(input: string, opts: SortTextOptions): string {
  let lines = input.split(/\r?\n/);
  if (opts.trim) lines = lines.map((l) => l.trim());
  if (opts.dropEmpty) lines = lines.filter((l) => l.length > 0);
  let set = lines;
  if (opts.dedupe) set = Array.from(new Set(opts.asc ? lines : lines.slice().reverse()));
  set.sort((a, b) => (opts.asc ? a.localeCompare(b) : b.localeCompare(a)));
  return set.join('\n');
}

export interface FindReplaceOptions { useRegex: boolean; caseSensitive: boolean }

/** 返回替换结果；正则非法时返回 null（组件层显示 'Invalid pattern'）。 */
export function findReplaceText(input: string, find: string, replace: string, opts: FindReplaceOptions): string | null {
  try {
    const flags = opts.caseSensitive ? 'g' : 'gi';
    const re = opts.useRegex ? new RegExp(find, flags) : new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    return input.replace(re, replace);
  } catch {
    return null;
  }
}

const HTML_ENTITIES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function encodeHtmlEntities(input: string): string {
  return input.replace(/[&<>"']/g, (c) => HTML_ENTITIES[c]);
}

// 常见命名实体（覆盖绝大多数实际使用）；数字实体 &#NN; / &#xHH; 全支持。
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  copy: '©', reg: '®', trade: '™', hellip: '…', mdash: '—', ndash: '–',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', laquo: '«', raquo: '»',
  times: '×', divide: '÷', deg: '°', plusmn: '±', micro: 'µ', para: '¶',
  sect: '§', middot: '·', bull: '•', dagger: '†', Dagger: '‡', permil: '‰',
  prime: '′', Prime: '″', euro: '€', pound: '£', yen: '¥', cent: '¢',
  curren: '¤', brvbar: '¦', uml: '¨', ordf: 'ª', ordm: 'º', iexcl: '¡',
  iquest: '¿', szlig: 'ß', agrave: 'à', aacute: 'á', acirc: 'â', atilde: 'ã',
  auml: 'ä', aring: 'å', aelig: 'æ', ccedil: 'ç', egrave: 'è', eacute: 'é',
  ecirc: 'ê', euml: 'ë', igrave: 'ì', iacute: 'í', icirc: 'î', iuml: 'ï',
  ntilde: 'ñ', ograve: 'ò', oacute: 'ó', ocirc: 'ô', otilde: 'õ', ouml: 'ö',
  oslash: 'ø', ugrave: 'ù', uacute: 'ú', ucirc: 'û', uuml: 'ü', yacute: 'ý', yuml: 'ÿ',
};

export function decodeHtmlEntities(input: string): string {
  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (whole, body: string) => {
    if (body[0] === '#') {
      const isHex = body[1] === 'x' || body[1] === 'X';
      const code = parseInt(body.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      if (isNaN(code) || code < 0 || code > 0x10ffff) return whole;
      try {
        return String.fromCodePoint(code);
      } catch {
        return whole;
      }
    }
    return NAMED_ENTITIES[body] ?? whole;
  });
}

const MORSE: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..',
  J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.',
  S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.', ' ': '/',
};

export function textToMorse(input: string): string {
  return input.toUpperCase().split('').map((c) => MORSE[c] ?? c).join(' ');
}

export function morseToText(input: string): string {
  return input.split(/\s+/).map((m) => Object.keys(MORSE).find((k) => MORSE[k] === m) ?? m).join('');
}

/** 进制转换；非法输入返回 null（组件层显示 'Invalid number'）。 */
export function convertBase(num: string, fromBase: number, toBase: number): string | null {
  try {
    const dec = parseInt(num.trim(), fromBase);
    if (isNaN(dec)) return null;
    return dec.toString(toBase).toUpperCase();
  } catch {
    return null;
  }
}

export type ReverseMode = 'chars' | 'words' | 'lines';

export function reverseText(input: string, mode: ReverseMode): string {
  if (mode === 'chars') return [...input].reverse().join('');
  if (mode === 'words') return input.split(/\s+/).reverse().join(' ');
  return input.split(/\r?\n/).reverse().join('\n');
}

export function wordFrequency(input: string, topN: number): string {
  const map = new Map<string, number>();
  input.toLowerCase().match(/[a-z0-9']+/g)?.forEach((w) => map.set(w, (map.get(w) ?? 0) + 1));
  const arr = Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, topN);
  return arr.map(([w, c]) => `${w}: ${c}`).join('\n') || 'No words found';
}

export interface WhitespaceOptions { trim: boolean; collapse: boolean; dropEmpty: boolean; crlf: boolean }

export function cleanWhitespace(input: string, opts: WhitespaceOptions): string {
  let lines = input.split(/\r?\n/);
  if (opts.trim) lines = lines.map((l) => l.trim());
  if (opts.collapse) lines = lines.map((l) => l.replace(/[ \t]+/g, ' '));
  if (opts.dropEmpty) lines = lines.filter((l) => l.length > 0);
  return lines.join(opts.crlf ? '\r\n' : '\n');
}

// ============================== dev tools (DevToolClient) ==============================

const SQL_KEYWORDS = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'UNION ALL', 'UNION'];

export function formatSql(sql: string): string {
  let s = sql.replace(/\s+/g, ' ').trim();
  for (const kw of SQL_KEYWORDS) {
    s = s.replace(new RegExp(`\\s+${kw}\\b`, 'gi'), `\n${kw}`);
  }
  return s.replace(/\n\s*\n/g, '\n').trim();
}

export function describeCron(parts: string[]): string {
  const [m, h, dom, mon, dow] = parts;
  const step = (f: string, unit: string) => (f.includes('/') ? `every ${f.split('/')[1]} ${unit}` : f === '*' ? `every ${unit}` : f);
  return `Minute: ${step(m, 'min')}, Hour: ${step(h, 'hr')}, Day: ${step(dom, 'day')}, Month: ${step(mon, 'mon')}, Weekday: ${step(dow, 'dow')}`;
}

export function nextRuns(parts: string[]): string[] {
  const [m, h, dom, mon, dow] = parts;
  const out: string[] = [];
  const d = new Date();
  for (let i = 0; i < 5; i++) {
    d.setMinutes(d.getMinutes() + 1);
    const mm = String(d.getMinutes());
    const hh = String(d.getHours());
    const dd = String(d.getDate());
    const mo = String(d.getMonth() + 1);
    const dw = String(d.getDay());
    const ok = (m === '*' || m === mm || (m.includes('/') && parseInt(mm) % parseInt(m.split('/')[1]) === 0)) &&
      (h === '*' || h === hh) && (dom === '*' || dom === dd) && (mon === '*' || mon === mo) && (dow === '*' || dow === dw);
    if (ok) out.push(d.toLocaleString());
    if (out.length >= 5) break;
  }
  return out;
}

const CHMOD_SYM_RE = /^([r-][w-][x-]){3}$/;
const CHMOD_OCT_RE = /^[0-7]{3,4}$/;

export function isChmodSymbolic(s: string): boolean { return CHMOD_SYM_RE.test(s.trim()); }
export function isChmodOctal(s: string): boolean { return CHMOD_OCT_RE.test(s.trim()); }

export function chmodOctalToSymbolic(octal: string): string {
  const n = parseInt(octal.trim(), 8);
  const s = (v: number) => `${(v & 4) ? 'r' : '-'}${(v & 2) ? 'w' : '-'}${(v & 1) ? 'x' : '-'}`;
  return `${s((n >> 6) & 7)}${s((n >> 3) & 7)}${s(n & 7)}`;
}

export function chmodSymbolicToOctal(sym: string): string {
  const s = sym.trim();
  const v = (c: string) => (c.includes('r') ? 4 : 0) + (c.includes('w') ? 2 : 0) + (c.includes('x') ? 1 : 0);
  const n = (v(s.slice(0, 3)) << 6) + (v(s.slice(3, 6)) << 3) + v(s.slice(6, 9));
  return n.toString(8).padStart(3, '0');
}

const b64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

/** HS256 JWT 签名；header/payload 为已解析的 JSON 对象。失败抛异常由组件层捕获。 */
export async function signJwt(header: object, payload: object, secret: string): Promise<string> {
  const b64 = (o: object) => b64url(new TextEncoder().encode(JSON.stringify(o)));
  const data = `${b64(header)}.${b64(payload)}`;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return `${data}.${b64url(new Uint8Array(sig))}`;
}

// ============================== util tools (UtilToolClient) ==============================

// 标准 MD5（RFC 1321）。每 16 轮一组的旋转量：s[4*floor(r/16) + r%4]。
const MD5_S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];

export function md5(s: string): string {
  function rot(n: number, c: number) { return (n << c) | (n >>> (32 - c)); }
  function add(a: number, b: number) { return (a + b) & 0xffffffff; }
  const K = [0, 1, 2, 3].flatMap((i) => Array.from({ length: 16 }, (_, j) => Math.floor(Math.abs(Math.sin(i * 16 + j + 1)) * 4294967296)));
  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
  const msg = new TextEncoder().encode(s);
  const bitLen = msg.length * 8;
  let with1 = new Uint8Array([...msg, 0x80]);
  while (with1.length % 64 !== 56) { const t = new Uint8Array(with1.length + 1); t.set(with1); t[with1.length] = 0; with1 = t; }
  const lenBytes = new Uint8Array(8);
  new DataView(lenBytes.buffer).setUint32(0, bitLen >>> 0, true);
  new DataView(lenBytes.buffer).setUint32(4, Math.floor(bitLen / 0x100000000), true);
  const full = new Uint8Array([...with1, ...lenBytes]);
  for (let i = 0; i < full.length; i += 64) {
    const M = new Int32Array(16);
    for (let j = 0; j < 16; j++) M[j] = new DataView(full.buffer, full.byteOffset + i + j * 4).getInt32(0, true);
    let A = a0, B = b0, C = c0, D = d0;
    for (let r = 0; r < 64; r++) {
      let F: number, g: number;
      if (r < 16) { F = (B & C) | (~B & D); g = r; }
      else if (r < 32) { F = (D & B) | (~D & C); g = (5 * r + 1) % 16; }
      else if (r < 48) { F = B ^ C ^ D; g = (3 * r + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * r) % 16; }
      const d = F + A + K[r] + (M[g] | 0);
      A = D; D = C; C = B; B = add(B, rot(d, MD5_S[Math.floor(r / 16) * 4 + (r % 4)]));
    }
    a0 = add(a0, A); b0 = add(b0, B); c0 = add(c0, C); d0 = add(d0, D);
  }
  // MD5 输出规范：每个 32 位字按小端字节序转 hex
  const hex = (n: number) => [0, 8, 16, 24].map((s) => ((n >>> s) & 0xff).toString(16).padStart(2, '0')).join('');
  return hex(a0) + hex(b0) + hex(c0) + hex(d0);
}

export function crc32Hex(bytes: Uint8Array): string {
  let c = ~0;
  for (let i = 0; i < bytes.length; i++) { c ^= bytes[i]; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); }
  return ((~c) >>> 0).toString(16).padStart(8, '0');
}

export async function shaHex(algo: string, bytes: Uint8Array): Promise<string> {
  const buf = await crypto.subtle.digest(algo, bytes as BufferSource);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ============================== design tools (DesignToolClient) ==============================

export function luminance(hex: string): number {
  const m = hex.replace('#', '');
  const r = parseInt(m.slice(0, 2), 16) / 255, g = parseInt(m.slice(2, 4), 16) / 255, b = parseInt(m.slice(4, 6), 16) / 255;
  const f = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function contrastRatio(a: string, b: string): number {
  const l1 = luminance(a), l2 = luminance(b);
  const hi = Math.max(l1, l2), lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

export function gcd(a: number, b: number): number { return b ? gcd(b, a % b) : a; }

export function simplifyRatio(w: number, h: number): string {
  const g = gcd(w, h) || 1;
  return `${w / g}:${h / g}`;
}

// ============================== csv/json (CsvJsonClient) ==============================

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else q = false;
      } else field += c;
    } else {
      if (c === '"') q = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (c === '\r') { /* skip */ }
      else field += c;
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim().length > 0));
}

export function toCsv(rows: string[][]): string {
  return rows.map((r) => r.map((c) => (/[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(',')).join('\n');
}

/** CSV → JSON 字符串；行数不足返回 null（组件层提示）。 */
export function csvToJson(raw: string): string | null {
  const rows = parseCsv(raw);
  if (rows.length < 2) return null;
  const headers = rows[0];
  const objs = rows.slice(1).map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
  return JSON.stringify(objs, null, 2);
}

/** JSON → CSV；非法 JSON / 非对象数组返回 null（组件层提示）。 */
export function jsonToCsv(raw: string): string | null {
  let data: unknown;
  try { data = JSON.parse(raw); } catch { return null; }
  const arr = Array.isArray(data) ? data : [data];
  if (arr.length === 0 || typeof arr[0] !== 'object' || arr[0] === null) return null;
  const headers = Array.from(new Set(arr.flatMap((o) => Object.keys(o as object))));
  const rows = [headers, ...arr.map((o) => headers.map((h) => String((o as Record<string, unknown>)[h] ?? '')))];
  return toCsv(rows);
}

// ============================== unit converter (unit-converter-shell) ==============================

export function convertTemp(value: number, from: string, to: string): number {
  const c = from === 'c' ? value : from === 'f' ? ((value - 32) * 5) / 9 : value - 273.15;
  return to === 'c' ? c : to === 'f' ? (c * 9) / 5 + 32 : c + 273.15;
}

export interface UnitLike { key: string; factor: number }

/** 乘法型换算：value[from] → 基准 → [to]。找不到单位返回 NaN。 */
export function convertUnit(units: UnitLike[], value: number, fromKey: string, toKey: number | string): number {
  const from = units.find((u) => u.key === fromKey);
  const to = units.find((u) => u.key === toKey);
  if (!from || !to) return NaN;
  return (value * from.factor) / to.factor;
}

// ============================== regex tester (RegexTesterClient) ==============================

export interface RegexMatch { value: string; groups: string[] }
export interface RegexRunResult { ok: boolean; matches: RegexMatch[]; error: string }

export function runRegex(pattern: string, flags: string, text: string): RegexRunResult {
  if (!pattern) return { ok: true, matches: [], error: '' };
  try {
    const re = new RegExp(pattern, flags.replace(/[^gimsuy]/g, ''));
    const matches: RegexMatch[] = [];
    let m: RegExpExecArray | null;
    if (flags.includes('g')) {
      while ((m = re.exec(text)) !== null) {
        matches.push({ value: m[0], groups: m.slice(1) });
        if (m.index === re.lastIndex) re.lastIndex++;
      }
    } else {
      const single = re.exec(text);
      if (single) matches.push({ value: single[0], groups: single.slice(1) });
    }
    return { ok: true, matches, error: '' };
  } catch (e) {
    return { ok: false, matches: [], error: (e as Error).message };
  }
}

// ============================== password generator (PasswordGeneratorClient) ==============================

export const PW_LOWER = 'abcdefghijklmnopqrstuvwxyz';
export const PW_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const PW_DIGITS = '0123456789';
export const PW_SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>?/';
export const PW_AMBIGUOUS = 'Il1O0o';

export interface PasswordPoolOptions { lower: boolean; upper: boolean; digits: boolean; symbols: boolean; noAmbiguous: boolean }

export function buildPasswordPool(opts: PasswordPoolOptions): string {
  let pool = '';
  if (opts.lower) pool += PW_LOWER;
  if (opts.upper) pool += PW_UPPER;
  if (opts.digits) pool += PW_DIGITS;
  if (opts.symbols) pool += PW_SYMBOLS;
  if (opts.noAmbiguous) pool = pool.split('').filter((c) => !PW_AMBIGUOUS.includes(c)).join('');
  return pool;
}

export function passwordEntropy(poolSize: number, length: number): number {
  return length > 0 && poolSize > 1 ? Math.log2(poolSize) * length : 0;
}

export function secureRandomInt(max: number): number {
  const arr = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / max) * max;
  let x = 0;
  do { crypto.getRandomValues(arr); x = arr[0]; } while (x >= limit);
  return x % max;
}

// ============================== slug generator (SlugGeneratorClient) ==============================

const SLUG_STOPWORDS = new Set(['a', 'an', 'the', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'for', 'with', 'at', 'by', 'from']);

export function makeSlug(text: string, sep: '-' | '_' | '.', removeStopwords: boolean): string {
  if (!text.trim()) return '';
  let t = text.toLowerCase().trim();
  if (removeStopwords) {
    t = t
      .split(/\s+/)
      .filter((w) => !SLUG_STOPWORDS.has(w.replace(/[^a-z0-9]/g, '')))
      .join(' ');
  }
  return slugify(t).replace(/-/g, sep);
}
