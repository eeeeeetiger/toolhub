// One-off: fill `howTo` and `faqs` into every tool config.ts that is missing them.
// This ONLY adds data fields to config files. It does not touch any other code.
// Safe to re-run: it skips fields that already exist.

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOOLS_DIR = join(__dirname, '..', 'src', 'tools');

// ---- helpers to serialize JS values into TS source (single-quoted strings) ----
function tsString(s) {
  return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}
function tsArr(arr) {
  const body = arr.map((s) => '    ' + tsString(s)).join(',\n');
  return '[\n' + body + ',\n  ]';
}
function tsFaqs(arr) {
  const body = arr.map((f) => '    { q: ' + tsString(f.q) + ', a: ' + tsString(f.a) + ' }').join(',\n');
  return '[\n' + body + ',\n  ]';
}

// ---- per-category templates (tool name woven in so each page is unique) ----
const HOWTO = {
  developer: (n) => [
    `Open ${n} in your browser — no install, no signup.`,
    `Paste your input (code, query, or value) into the box.`,
    `See the formatted, decoded, or generated result instantly, computed locally on your device.`,
  ],
  seo: (n) => [
    `Open ${n} in your browser.`,
    `Enter the URL or content you want to analyze.`,
    `Review the result — processed locally, nothing is sent to a server.`,
  ],
  image: (n) => [
    `Open ${n} in your browser — no install, no signup.`,
    `Add the image you want to work with (drag & drop or pick a file).`,
    `Adjust any options, then let it run locally on your device.`,
    `Download the result instantly. Your image never leaves your computer.`,
  ],
  pdf: (n) => [
    `Open ${n} in your browser.`,
    `Add your PDF (or select pages / options as needed).`,
    `Process it locally on your device — nothing is uploaded.`,
    `Download the resulting PDF.`,
  ],
  utility: (n) => [
    `Open ${n} in your browser.`,
    `Add your input or file.`,
    `Get the result instantly — processed locally, nothing is uploaded.`,
  ],
  video: (n) => [
    `Open ${n} in your browser.`,
    `Add your video file.`,
    `Choose the options you need, then process it locally with ffmpeg.wasm.`,
    `Download the result — your video never leaves your device.`,
  ],
  audio: (n) => [
    `Open ${n} in your browser.`,
    `Add your audio file.`,
    `Adjust options, then process it locally with Web Audio / ffmpeg.wasm.`,
    `Download the result — nothing is uploaded.`,
  ],
  calculators: (n) => [
    `Open ${n} in your browser.`,
    `Enter your numbers in the input fields.`,
    `See the result update instantly — everything is computed locally on your device.`,
  ],
  converters: (n) => [
    `Open ${n} in your browser.`,
    `Enter the value you want to convert.`,
    `Pick the units and read the result — calculated instantly on your device.`,
  ],
  design: (n) => [
    `Open ${n} in your browser.`,
    `Set your options or pick colors / values.`,
    `Copy or download the generated output — created locally on your device.`,
  ],
  text: (n) => [
    `Open ${n} in your browser.`,
    `Paste or type your text into the box.`,
    `Get the result instantly — your text stays on your device.`,
  ],
  documents: (n) => [
    `Open ${n} in your browser.`,
    `Add your document or data file.`,
    `Convert or process it locally on your device.`,
    `Download the output — your file never leaves your computer.`,
  ],
};

const FAQS = {
  developer: (n) => [
    { q: `Is ${n} free?`, a: `Yes, ${n} is 100% free and runs entirely in your browser.` },
    { q: 'Is my data sent anywhere?', a: 'No. Everything is processed locally on your device; nothing is uploaded.' },
    { q: 'Do I need to install anything?', a: `No. ${n} runs in any modern browser, no installation or signup required.` },
    { q: 'Is it safe for private code?', a: 'Yes. Your input stays in your browser and is never stored or transmitted.' },
  ],
  seo: (n) => [
    { q: `Is ${n} free?`, a: 'Yes, and it runs entirely in your browser.' },
    { q: 'Are my inputs uploaded?', a: 'No. Your inputs are processed locally and never leave your device.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
    { q: 'Does it work for any website?', a: 'Yes. Just enter the URL or content you want to analyze.' },
  ],
  image: (n) => [
    { q: `Is ${n} free?`, a: `Yes, ${n} is 100% free and runs entirely in your browser.` },
    { q: 'Are my images uploaded to a server?', a: 'No. Images are processed locally in your browser for full privacy — they never leave your device.' },
    { q: 'What formats are supported?', a: 'Common formats such as JPG, PNG, WebP and more, depending on the tool.' },
    { q: 'Do I need to install anything?', a: `No. ${n} works in any modern browser, no installation needed.` },
  ],
  pdf: (n) => [
    { q: `Is ${n} free?`, a: 'Yes, all PDF tools are free and run in your browser.' },
    { q: 'Are my PDFs uploaded?', a: 'No. Your PDFs are processed locally on your device and never leave it.' },
    { q: 'Is there a file size limit?', a: 'Very large files may be slower because processing happens on your device, but there is no hard upload limit.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
  ],
  utility: (n) => [
    { q: `Is ${n} free?`, a: 'Yes, Offline ToolHub tools are free and private.' },
    { q: 'Is my data uploaded?', a: 'No. Processing happens locally in your browser.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work offline?', a: `Once loaded, ${n} runs entirely on your device.` },
  ],
  video: (n) => [
    { q: `Is ${n} free?`, a: 'Yes, it is free and runs entirely in your browser.' },
    { q: 'Are my videos uploaded?', a: 'No. Videos are processed locally with ffmpeg.wasm for privacy.' },
    { q: 'What video formats are supported?', a: 'MP4, MOV, WebM, AVI, MKV and more depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
  ],
  audio: (n) => [
    { q: `Is ${n} free?`, a: 'Yes, all audio tools on Offline ToolHub are free.' },
    { q: 'Are my audio files uploaded?', a: 'No. Audio is processed locally in your browser with Web Audio and ffmpeg.wasm.' },
    { q: 'What audio formats are supported?', a: 'MP3, WAV, M4A, OGG and FLAC, depending on the tool.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
  calculators: (n) => [
    { q: `Is ${n} free?`, a: 'Yes, every calculator on Offline ToolHub is free.' },
    { q: 'Is my data stored?', a: 'No. Calculations happen instantly in your browser and nothing is saved.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
    { q: 'Does it work on mobile?', a: `Yes. ${n} runs in any modern browser, including phones.` },
  ],
  converters: (n) => [
    { q: `Is ${n} free?`, a: 'Yes, it is free and runs in your browser.' },
    { q: 'Are my values uploaded?', a: 'No. Conversions are computed locally on your device.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
    { q: 'Can I convert many values at once?', a: `Enter your values and ${n} computes the result instantly, all on your device.` },
  ],
  design: (n) => [
    { q: `Is ${n} free?`, a: 'Yes, and it runs entirely in your browser.' },
    { q: 'Is my work uploaded?', a: 'No. Everything is generated locally on your device.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
    { q: 'Can I export the result?', a: 'Yes. Copy or download the output directly from your browser.' },
  ],
  text: (n) => [
    { q: `Is ${n} free?`, a: 'Yes, it is free and private.' },
    { q: 'Is my text uploaded?', a: 'No. Your text stays on your device and is processed locally.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work with large text?', a: 'Yes. Processing happens in your browser, so your text never leaves your computer.' },
  ],
  documents: (n) => [
    { q: `Is ${n} free?`, a: 'Yes, all document tools are free to use.' },
    { q: 'Are my documents uploaded?', a: 'No. Documents are processed locally in your browser.' },
    { q: 'What formats are supported?', a: 'Depends on the tool — common office, CSV, JSON and XML formats.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};

// ---- process each config ----
let total = 0;
let howToAdded = 0;
let faqsAdded = 0;
const skipped = [];

for (const slug of readdirSync(TOOLS_DIR)) {
  const cfgPath = join(TOOLS_DIR, slug, 'config.ts');
  if (!existsSync(cfgPath)) continue;
  const content = readFileSync(cfgPath, 'utf8');

  const nameMatch = content.match(/name:\s*'([^']+)'/);
  const catMatch = content.match(/category:\s*'([^']+)'/);
  if (!nameMatch || !catMatch) continue;
  const name = nameMatch[1];
  const category = catMatch[1];

  const hasHowTo = /\bhowTo\s*:/.test(content);
  const hasFaqs = /\bfaqs\s*:/.test(content);
  if (hasHowTo && hasFaqs) continue;

  const howToFn = HOWTO[category] || HOWTO.utility;
  const faqsFn = FAQS[category] || FAQS.utility;
  const howTo = hasHowTo ? null : howToFn(name);
  const faqs = hasFaqs ? null : faqsFn(name);

  let block = '';
  if (howTo) block += '  howTo: ' + tsArr(howTo) + ',\n';
  if (faqs) block += '  faqs: ' + tsFaqs(faqs) + ',\n';

  // Insert before the final `};` of the config object.
  const closeIdx = content.lastIndexOf('};');
  if (closeIdx === -1) {
    skipped.push(slug + ' (no close brace)');
    continue;
  }
  const before = content.slice(0, closeIdx);
  const trailingComma = /,\s*$/.test(before);
  const newContent = before + (trailingComma ? '' : ',\n') + (trailingComma ? '\n' : '') + block + '};';

  writeFileSync(cfgPath, newContent, 'utf8');
  total++;
  if (howTo) howToAdded++;
  if (faqs) faqsAdded++;
}

console.log(`Updated ${total} config files.`);
console.log(`  howTo added:   ${howToAdded}`);
console.log(`  faqs added:    ${faqsAdded}`);
if (skipped.length) console.log('  skipped:', skipped.join(', '));
