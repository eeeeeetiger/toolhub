// toolhub 纯逻辑工具自动测试：直接导入生产代码 tool-logic.ts / conversions.ts，
// 用独立标准答案（RFC 向量、国际定义、WCAG 参考值）逐项比对。
// 运行：node --experimental-strip-types scripts/tool-tests.mjs

import {
  buildPasswordPool,
  chmodOctalToSymbolic,
  chmodSymbolicToOctal,
  contrastRatio,
  convertBase,
  convertTemp,
  convertUnit,
  crc32Hex,
  csvToJson,
  decodeHtmlEntities,
  describeCron,
  encodeHtmlEntities,
  findReplaceText,
  formatSql,
  gcd,
  getKeywordDensity,
  getWordStats,
  isChmodOctal,
  isChmodSymbolic,
  jsonToCsv,
  luminance,
  makeSlug,
  md5,
  morseToText,
  nextRuns,
  parseCsv,
  passwordEntropy,
  reverseText,
  runRegex,
  secureRandomInt,
  shaHex,
  signJwt,
  simplifyRatio,
  sortText,
  textToMorse,
  toCamel,
  toCsv,
  toSentenceCase,
  toSnake,
  toTitleCase,
  wordFrequency,
} from '../src/tools/_shared/tool-logic.ts';
import { converterDefs } from '../src/tools/_shared/conversions.ts';

let pass = 0, fail = 0;
const fails = [];

function eq(actual, expected, name) {
  const a = JSON.stringify(actual), e = JSON.stringify(expected);
  if (a === e) pass++;
  else { fail++; fails.push(`${name}: 期望 ${e} 实得 ${a}`); }
}

function near(actual, expected, tol, name) {
  if (typeof actual === 'number' && Math.abs(actual - expected) <= tol) pass++;
  else { fail++; fails.push(`${name}: 期望 ${expected}±${tol} 实得 ${actual}`); }
}

function ok(cond, name) {
  if (cond) pass++;
  else { fail++; fails.push(name); }
}

// ============================== case-converter ==============================
eq(toTitleCase('the lord of the rings'), 'The Lord of the Rings', 'title: lord of the rings');
eq(toTitleCase('a tale of two cities'), 'A Tale of Two Cities', 'title: two cities');
eq(toSentenceCase('hello world. bye now'), 'Hello world. Bye now', 'sentence case');
eq(toCamel('hello world foo'), 'helloWorldFoo', 'camelCase');
eq(toCamel('Hello-world'), 'helloWorld', 'camel: hyphen');
eq(toSnake('helloWorld Foo'), 'hello_world_foo', 'snake_case');
eq(toSnake('  Hello World  '), 'hello_world', 'snake: trim');

// ============================== word-counter ==============================
{
  const s = getWordStats('Hello world. Bye now!');
  eq(s.words, 4, 'wc: words');
  eq(s.chars, 21, 'wc: chars');
  eq(s.charsNoSpaces, 18, 'wc: charsNoSpaces');
  eq(s.sentences, 2, 'wc: sentences');
  eq(s.lines, 1, 'wc: lines');
  eq(s.paragraphs, 1, 'wc: paragraphs');
  eq(s.readingTime, 1, 'wc: readingTime');

  const p = getWordStats('Para one.\n\nPara two.\nStill two.');
  eq(p.paragraphs, 2, 'wc: multi paragraphs');
  eq(p.lines, 3, 'wc: multi lines');
  eq(p.sentences, 3, 'wc: multi sentences');
  eq(p.words, 6, 'wc: multi words');

  const empty = getWordStats('');
  eq(empty.words, 0, 'wc: empty words');
  eq(empty.sentences, 0, 'wc: empty sentences');

  const d = getKeywordDensity('the cat and the dog and the fish'); // 共 8 个词
  eq(d[0], { word: 'the', count: 3, pct: 38 }, 'density: top word');
  eq(d[1], { word: 'and', count: 2, pct: 25 }, 'density: second');
  eq(getKeywordDensity(''), [], 'density: empty');
}

// ============================== text tools ==============================
eq(sortText('banana\napple\ncherry', { asc: true, dedupe: false, trim: true, dropEmpty: true }), 'apple\nbanana\ncherry', 'sort: asc');
eq(sortText('a\nb\nc', { asc: false, dedupe: false, trim: true, dropEmpty: true }), 'c\nb\na', 'sort: desc');
eq(sortText('b\na\nb\na', { asc: true, dedupe: true, trim: true, dropEmpty: true }), 'a\nb', 'sort: dedupe');
eq(sortText('  x  \n\n y ', { asc: true, dedupe: false, trim: true, dropEmpty: true }), 'x\ny', 'sort: trim+dropEmpty');

eq(findReplaceText('Hello World', 'world', 'there', { useRegex: false, caseSensitive: false }), 'Hello there', 'findReplace: case-insensitive');
eq(findReplaceText('Hello World', 'world', 'there', { useRegex: false, caseSensitive: true }), 'Hello World', 'findReplace: case-sensitive no match');
eq(findReplaceText('a1b22', '\\d+', '#', { useRegex: true, caseSensitive: true }), 'a#b#', 'findReplace: regex');
eq(findReplaceText('x', '(', 'y', { useRegex: true, caseSensitive: true }), null, 'findReplace: invalid regex → null');
eq(findReplaceText('a.b', '.', '!', { useRegex: false, caseSensitive: true }), 'a!b', 'findReplace: literal dot (escaped)');

eq(encodeHtmlEntities(`<a href="x">&'`), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;', 'entities: encode');
eq(decodeHtmlEntities('&lt;p&gt;&amp;&nbsp;&#65;&#x42;&copy;'), '<p>& AB©', 'entities: decode mixed');
eq(decodeHtmlEntities('&foobar;'), '&foobar;', 'entities: unknown named passthrough');
eq(decodeHtmlEntities('plain & simple'), 'plain & simple', 'entities: no entity untouched');

eq(textToMorse('SOS'), '... --- ...', 'morse: SOS');
eq(textToMorse('Hi'), '.... ..', 'morse: Hi');
eq(morseToText('... --- ...'), 'SOS', 'morse: decode SOS');
eq(morseToText('.... . .-.. .-.. --- / .-- --- .-. .-.. -..'), 'HELLO WORLD', 'morse: HELLO WORLD');
eq(morseToText(textToMorse('ABC 123')), 'ABC 123', 'morse: roundtrip');

eq(convertBase('255', 10, 16), 'FF', 'base: 255→hex');
eq(convertBase('ff', 16, 2), '11111111', 'base: ff→bin');
eq(convertBase('1010', 2, 10), '10', 'base: bin→dec');
eq(convertBase('z', 36, 10), '35', 'base: z(36)→dec');
eq(convertBase('xyz', 10, 16), null, 'base: invalid → null');

eq(reverseText('abc', 'chars'), 'cba', 'reverse: chars');
eq(reverseText('one two three', 'words'), 'three two one', 'reverse: words');
eq(reverseText('l1\nl2\nl3', 'lines'), 'l3\nl2\nl1', 'reverse: lines');
eq(reverseText('a😀b', 'chars'), 'b😀a', 'reverse: surrogate pair safe');

eq(wordFrequency('the cat the dog the', 10), 'the: 3\ncat: 1\ndog: 1', 'wordFreq: basic');
eq(wordFrequency('the cat the', 1), 'the: 2', 'wordFreq: topN');
eq(wordFrequency('', 10), 'No words found', 'wordFreq: empty');

// ============================== dev tools ==============================
eq(formatSql('SELECT id,name FROM users WHERE active=1 ORDER BY name'),
  'SELECT id,name\nFROM users\nWHERE active=1\nORDER BY name', 'sql: basic format');
eq(formatSql('select * from t where x=1 and y=2'), 'select *\nFROM t\nWHERE x=1\nAND y=2', 'sql: keywords uppercased');

eq(describeCron(['*/5', '*', '*', '*', '*']),
  'Minute: every 5 min, Hour: every hr, Day: every day, Month: every mon, Weekday: every dow', 'cron: */5');
eq(describeCron(['0', '9', '1', '6', '3']), 'Minute: 0, Hour: 9, Day: 1, Month: 6, Weekday: 3', 'cron: fixed values');
eq(nextRuns(['*', '*', '*', '*', '*']).length, 5, 'cron: every minute → 5 runs');
eq(nextRuns(['61', '*', '*', '*', '*']).length, 0, 'cron: impossible minute → 0 runs');

eq(chmodOctalToSymbolic('755'), 'rwxr-xr-x', 'chmod: 755');
eq(chmodOctalToSymbolic('644'), 'rw-r--r--', 'chmod: 644');
eq(chmodOctalToSymbolic('700'), 'rwx------', 'chmod: 700');
eq(chmodOctalToSymbolic('000'), '---------', 'chmod: 000');
eq(chmodSymbolicToOctal('rwxr-xr-x'), '755', 'chmod: sym→755');
eq(chmodSymbolicToOctal('rw-r--r--'), '644', 'chmod: sym→644');
for (const oct of ['000', '111', '222', '333', '444', '555', '666', '777', '123', '456', '701', '640', '755', '644', '604', '750']) {
  eq(chmodSymbolicToOctal(chmodOctalToSymbolic(oct)), oct, `chmod roundtrip ${oct}`);
}
ok(isChmodOctal('755') && !isChmodOctal('888') && isChmodSymbolic('rwxr-xr-x') && !isChmodSymbolic('rwxrwxrwx1'), 'chmod: validators');

// jwt.io 官方 HS256 示例向量
{
  const h = JSON.parse('{"alg":"HS256","typ":"JWT"}');
  const p = JSON.parse('{"sub":"1234567890","name":"John Doe","iat":1516239022}');
  const token = await signJwt(h, p, 'your-256-bit-secret');
  eq(token, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', 'jwt: HS256 官方向量');
}

// ============================== util tools: hashes ==============================
// RFC 1321 官方 MD5 测试向量
eq(md5(''), 'd41d8cd98f00b204e9800998ecf8427e', 'md5: empty');
eq(md5('a'), '0cc175b9c0f1b6a831c399e269772661', 'md5: a');
eq(md5('abc'), '900150983cd24fb0d6963f7d28e17f72', 'md5: abc');
eq(md5('message digest'), 'f96b697d7cb7938d525a2f31aaf161d0', 'md5: message digest');
eq(md5('abcdefghijklmnopqrstuvwxyz'), 'c3fcd3d76192e4007dfb496cca67e13b', 'md5: alphabet');
eq(md5('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'), 'd174ab98d277d9f5a5611c2c9f419d9f', 'md5: alnum');
eq(md5('12345678901234567890123456789012345678901234567890123456789012345678901234567890'), '57edf4a22be3c955ac49da2e2107b67a', 'md5: 80-char multi-block');

const enc = new TextEncoder();
eq(crc32Hex(enc.encode('abc')), '352441c2', 'crc32: abc');
eq(crc32Hex(enc.encode('123456789')), 'cbf43926', 'crc32: 123456789');
eq(crc32Hex(enc.encode('')), '00000000', 'crc32: empty');

eq(await shaHex('SHA-256', enc.encode('abc')), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad', 'sha256: abc');
eq(await shaHex('SHA-1', enc.encode('abc')), 'a9993e364706816aba3e25717850c26c9cd0d89d', 'sha1: abc');
eq(await shaHex('SHA-512', enc.encode('abc')), 'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f', 'sha512: abc');

// ============================== design tools ==============================
near(luminance('#ffffff'), 1, 1e-9, 'lum: white');
near(luminance('#000000'), 0, 1e-9, 'lum: black');
near(contrastRatio('#ffffff', '#000000'), 21, 0.01, 'contrast: white/black = 21');
near(contrastRatio('#767676', '#ffffff'), 4.54, 0.01, 'contrast: #767676 ≈ 4.54 (AA pass)');
near(contrastRatio('#777777', '#ffffff'), 4.48, 0.01, 'contrast: #777777 ≈ 4.48 (AA fail)');
near(contrastRatio('#ff0000', '#ff0000'), 1, 1e-9, 'contrast: same color = 1');

eq(gcd(1920, 1080), 120, 'gcd: 1920/1080');
eq(simplifyRatio(1920, 1080), '16:9', 'ratio: 16:9');
eq(simplifyRatio(2560, 1440), '16:9', 'ratio: 2K 16:9');
eq(simplifyRatio(1024, 768), '4:3', 'ratio: 4:3');
eq(simplifyRatio(2560, 1080), '64:27', 'ratio: ultrawide = 64:27');
eq(simplifyRatio(1440, 900), '8:5', 'ratio: 8:5');

// ============================== csv / json ==============================
eq(parseCsv('a,b\n1,2'), [['a', 'b'], ['1', '2']], 'csv: basic');
eq(parseCsv('name,quote\n"say ""hi""",x'), [['name', 'quote'], ['say "hi"', 'x']], 'csv: escaped quote');
eq(parseCsv('a,b\r\n1,2'), [['a', 'b'], ['1', '2']], 'csv: CRLF');
eq(parseCsv('"multi\nline",b'), [['multi\nline', 'b']], 'csv: quoted newline');
eq(parseCsv('a,b\n'), [['a', 'b']], 'csv: trailing newline');
eq(parseCsv('a,,c\n1,,3'), [['a', '', 'c'], ['1', '', '3']], 'csv: empty fields');

eq(toCsv([['a', 'b'], ['1', '2']]), 'a,b\n1,2', 'toCsv: basic');
eq(toCsv([['a,b', 'c"d', 'e\nf']]), '"a,b","c""d","e\nf"', 'toCsv: quoting');

eq(csvToJson('a,b\n1,2\n3,4'), JSON.stringify([{ a: '1', b: '2' }, { a: '3', b: '4' }], null, 2), 'csvToJson: basic');
eq(csvToJson('a,b'), null, 'csvToJson: header only → null');

eq(jsonToCsv('[{"a":1,"b":2},{"a":3,"b":4}]'), 'a,b\n1,2\n3,4', 'jsonToCsv: basic');
eq(jsonToCsv('{"a":1}'), 'a\n1', 'jsonToCsv: single object');
eq(jsonToCsv('not json'), null, 'jsonToCsv: invalid → null');
eq(jsonToCsv('[1,2,3]'), null, 'jsonToCsv: non-object array → null');
eq(jsonToCsv('[{"a":1},{"b":2}]'), 'a,b\n1,\n,2', 'jsonToCsv: header union');
// roundtrip
eq(jsonToCsv(csvToJson('a,b\n1,2\n3,4')), 'a,b\n1,2\n3,4', 'csv↔json roundtrip');

// ============================== unit converters ==============================
// 国际定义精确值比对（factor 必须等于定义值）
const REF = {
  'length-converter': { mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254, km: 1000, cm: 0.01, mm: 0.001 },
  'weight-converter': { lb: 0.45359237, st: 6.35029318, t: 1000 },
  'area-converter': { acre: 4046.8564224, ft2: 0.09290304, ha: 10000, mi2: 2589988.110336 },
  'volume-converter': { gal: 3.785411784, qt: 0.946352946, pt: 0.473176473, cup: 0.2365882365, floz: 0.0295735296, ft3: 28.316846592 },
  'speed-converter': { mph: 0.44704, fps: 0.3048 },
  'data-converter': { bit: 0.125, kb: 1024, mb: 1048576, gb: 1073741824, tb: 1099511627776, pb: 1125899906842624 },
};
for (const [slug, refs] of Object.entries(REF)) {
  const def = converterDefs[slug];
  ok(!!def, `${slug}: def 存在`);
  for (const [key, exact] of Object.entries(refs)) {
    const u = def.units.find((x) => x.key === key);
    near(u ? u.factor : NaN, exact, Math.abs(exact) * 1e-9 + 1e-12, `${slug}.${key} factor`);
  }
}
// 近似定义（分数截断的）
near(converterDefs['speed-converter'].units.find((u) => u.key === 'kmh').factor, 1 / 3.6, 1e-8, 'speed.kmh ≈ 1/3.6');
near(converterDefs['speed-converter'].units.find((u) => u.key === 'knot').factor, 1852 / 3600, 1e-9, 'speed.knot ≈ 1852/3600');
near(converterDefs['weight-converter'].units.find((u) => u.key === 'oz').factor, 0.028349523125, 1e-9, 'weight.oz ≈ 0.028349523125');

// 功能性换算
near(convertUnit(converterDefs['length-converter'].units, 1, 'mi', 'ft'), 5280, 1e-9, '1 mile = 5280 feet');
near(convertUnit(converterDefs['length-converter'].units, 1, 'in', 'cm'), 2.54, 1e-9, '1 inch = 2.54 cm');
near(convertUnit(converterDefs['weight-converter'].units, 1, 'kg', 'lb'), 2.2046226218, 1e-8, '1 kg ≈ 2.2046 lb');
near(convertUnit(converterDefs['data-converter'].units, 1, 'mb', 'kb'), 1024, 1e-9, '1 MB = 1024 KB');
near(convertUnit(converterDefs['volume-converter'].units, 1, 'gal', 'l'), 3.785411784, 1e-9, '1 gal = 3.785 L');

// 全部单位双向往返一致性
for (const [slug, def] of Object.entries(converterDefs)) {
  if (def.special === 'temperature') continue;
  for (const a of def.units) {
    for (const b of def.units) {
      const x = 123.456;
      const back = convertUnit(def.units, convertUnit(def.units, x, a.key, b.key), b.key, a.key);
      near(back, x, Math.abs(x) * 1e-9 + 1e-9, `${slug}: ${a.key}→${b.key}→${a.key} 往返`);
    }
  }
}

// 温度
near(convertTemp(32, 'f', 'c'), 0, 1e-9, '32°F = 0°C');
near(convertTemp(212, 'f', 'c'), 100, 1e-9, '212°F = 100°C');
near(convertTemp(-40, 'f', 'c'), -40, 1e-9, '-40°F = -40°C');
near(convertTemp(0, 'c', 'f'), 32, 1e-9, '0°C = 32°F');
near(convertTemp(0, 'c', 'k'), 273.15, 1e-9, '0°C = 273.15K');
near(convertTemp(273.15, 'k', 'c'), 0, 1e-9, '273.15K = 0°C');
near(convertTemp(300, 'k', 'c'), 26.85, 0.001, '300K ≈ 26.85°C');
near(convertTemp(98.6, 'f', 'c'), 37, 0.001, '98.6°F ≈ 37°C');

// ============================== regex tester ==============================
{
  const r = runRegex('(\\w+)@(\\w+\\.\\w+)', 'g', 'Contact: alice@example.com or bob@test.org');
  eq(r.ok, true, 'regex: ok');
  eq(r.matches.length, 2, 'regex: 2 matches');
  eq(r.matches[0].value, 'alice@example.com', 'regex: first value');
  eq(r.matches[0].groups, ['alice', 'example.com'], 'regex: first groups');
  eq(r.matches[1].value, 'bob@test.org', 'regex: second value');

  const single = runRegex('\\d+', '', 'a1b22');
  eq(single.matches.length, 1, 'regex: no-g single match');
  eq(single.matches[0].value, '1', 'regex: no-g first only');

  const zw = runRegex('a*', 'g', 'bbb');
  ok(zw.ok && zw.matches.length === 4, 'regex: zero-width 不死循环且边界正确');

  const bad = runRegex('(', 'g', 'x');
  ok(!bad.ok && bad.error.length > 0, 'regex: invalid pattern → error');

  const dirty = runRegex('\\d+', 'gx9', 'a1');
  ok(dirty.ok && dirty.matches.length === 1, 'regex: flags 清洗');

  eq(runRegex('', 'g', 'x').matches.length, 0, 'regex: empty pattern → 0 matches');
}

// ============================== password generator ==============================
{
  const all = buildPasswordPool({ lower: true, upper: true, digits: true, symbols: true, noAmbiguous: false });
  eq(all.length, 88, 'pw pool: all = 88');
  const noAmb = buildPasswordPool({ lower: true, upper: true, digits: true, symbols: true, noAmbiguous: true });
  eq(noAmb.length, 82, 'pw pool: noAmbiguous 去掉 6 个易混字符');
  ok(!/[Il1O0o]/.test(noAmb), 'pw pool: noAmbiguous 内容确认');
  eq(buildPasswordPool({ lower: true, upper: false, digits: false, symbols: false, noAmbiguous: false }), 'abcdefghijklmnopqrstuvwxyz', 'pw pool: lower only');
  eq(buildPasswordPool({ lower: false, upper: false, digits: false, symbols: false, noAmbiguous: false }), '', 'pw pool: none → empty');

  near(passwordEntropy(88, 16), 103.35, 0.01, 'pw entropy: 88^16 ≈ 103 bits');
  near(passwordEntropy(26, 8), 37.6, 0.01, 'pw entropy: 26^8 ≈ 37.6 bits');
  eq(passwordEntropy(0, 16), 0, 'pw entropy: empty pool = 0');

  let inRange = true;
  for (let i = 0; i < 1000; i++) { const v = secureRandomInt(10); if (v < 0 || v >= 10 || !Number.isInteger(v)) inRange = false; }
  ok(inRange, 'secureRandomInt(10) 1000 次均在 [0,10)');
  eq(secureRandomInt(1), 0, 'secureRandomInt(1) = 0');
}

// ============================== slug generator ==============================
eq(makeSlug('How to Build a Fast Website in 2026', '-', true), 'how-build-fast-website-2026', 'slug: stopwords on');
eq(makeSlug('How to Build a Fast Website in 2026', '-', false), 'how-to-build-a-fast-website-in-2026', 'slug: stopwords off');
eq(makeSlug('Hello World Foo', '_', true), 'hello_world_foo', 'slug: underscore');
eq(makeSlug('Hello World', '.', false), 'hello.world', 'slug: dot');
eq(makeSlug('   ', '-', true), '', 'slug: empty input');

// ============================== 汇总 ==============================
console.log(`\n===== 纯逻辑工具测试 =====`);
console.log(`PASS: ${pass}  FAIL: ${fail}`);
if (fails.length) {
  console.log('\n失败明细:');
  fails.forEach((f) => console.log(' -', f));
  process.exit(1);
} else {
  console.log('全部通过 ✓');
}
