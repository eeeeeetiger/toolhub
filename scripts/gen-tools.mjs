import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';

const ROOT = 'D:/workbuddy/aitools/toolhub';
const SRC = `${ROOT}/src`;

const ADDED = '2026-07-21';
const GENERIC_CALC = { import: '@/tools/_shared/CalculatorClient', name: 'GenericCalculatorClient' };
const AUDIO_PAIR = { import: '@/tools/_shared/AudioFormatPairClient', name: 'AudioFormatPairClient' };
const IMAGE_PAIR = { import: '@/tools/_shared/ImageFormatPairClient', name: 'ImageFormatPairClient' };
const VIDEO_PAIR = { import: '@/tools/_shared/VideoFormatPairClient', name: 'VideoFormatPairClient' };

// howTo 按分类给默认三步，让新页面自带使用说明
const HOWTO = {
  converters: ['Open the tool and add your file.', 'We process it locally in your browser.', 'Download the converted result.'],
  calculators: ['Enter your values in the fields above.', 'The result updates instantly.', 'Adjust inputs to compare scenarios.'],
  utility: ['Open the tester and allow access if prompted.', 'Interact with your device to see the live readout.', 'Use the result to confirm your hardware works.'],
  audio: ['Add your audio file (or allow mic/camera).', 'The tool processes it on your device.', 'Preview or download the result.'],
  image: ['Add your image file.', 'We convert it locally in your browser.', 'Download the result.'],
  video: ['Add your video file.', 'We convert it locally with ffmpeg.wasm.', 'Download the result.'],
  documents: ['Draw or enter your content in the tool.', 'Everything stays in your browser.', 'Download the exported file.'],
};

const NEW = [
  // ---- Calculators (high CPC) ----
  { slug: 'mortgage-calculator', name: 'Mortgage Calculator', category: 'calculators', icon: 'Calculator', client: GENERIC_CALC,
    description: 'Estimate your monthly mortgage payment, total interest and total cost — instantly, in your browser.',
    longDescription: 'Plan a home purchase with a clear monthly payment estimate. The mortgage calculator factors in loan amount, interest rate and term to show monthly payment, total interest and total paid. No upload, no signup.',
    keywords: ['mortgage calculator', 'monthly mortgage payment', 'home loan calculator', 'mortgage payment estimator'],
    features: ['Monthly payment', 'Total interest', 'No upload'] },
  { slug: 'sales-tax-calculator', name: 'Sales Tax Calculator', category: 'calculators', icon: 'Calculator', client: GENERIC_CALC,
    description: 'Add sales tax to any amount in one tap — perfect for shopping and invoicing.',
    longDescription: 'Quickly work out how much sales tax to add to a price. The sales tax calculator shows the tax and the final total for any rate and amount.',
    keywords: ['sales tax calculator', 'calculate sales tax', 'tax added to price', 'sales tax estimator'],
    features: ['Tax amount', 'Final total', 'Any rate'] },
  { slug: 'vat-calculator', name: 'VAT Calculator', category: 'calculators', icon: 'Calculator', client: GENERIC_CALC,
    description: 'Add or reverse VAT on any net amount for invoicing and accounting.',
    longDescription: 'A simple VAT calculator for Europe and beyond. Enter a net amount and VAT rate to get the VAT and gross total instantly.',
    keywords: ['vat calculator', 'calculate vat', 'vat inclusive', 'net to gross'],
    features: ['VAT amount', 'Gross total', 'Any rate'] },
  { slug: 'salary-calculator', name: 'Salary Calculator', category: 'calculators', icon: 'Calculator', client: GENERIC_CALC,
    description: 'Convert an hourly rate to annual, monthly and weekly salary.',
    longDescription: 'Turn an hourly wage into annual, monthly and weekly pay. The salary calculator helps you compare job offers and freelance rates.',
    keywords: ['salary calculator', 'hourly to salary', 'annual salary', 'pay calculator'],
    features: ['Annual', 'Monthly', 'Weekly'] },
  { slug: 'roi-calculator', name: 'ROI Calculator', category: 'calculators', icon: 'Calculator', client: GENERIC_CALC,
    description: 'Measure the return on any investment as a percentage and profit figure.',
    longDescription: 'See how profitable an investment is. The ROI calculator returns the percentage return and absolute profit from an initial amount and final value.',
    keywords: ['roi calculator', 'return on investment', 'investment calculator', 'profit calculator'],
    features: ['ROI %', 'Profit', 'Instant'] },
  { slug: 'break-even-calculator', name: 'Break-Even Calculator', category: 'calculators', icon: 'Calculator', client: GENERIC_CALC,
    description: 'Find how many units you must sell to cover costs.',
    longDescription: 'Work out the break-even point for a product or business. Enter fixed costs, price and unit cost to get break-even units and revenue.',
    keywords: ['break even calculator', 'break even point', 'units to break even', 'business calculator'],
    features: ['Break-even units', 'Revenue', 'No upload'] },
  { slug: 'savings-goal-calculator', name: 'Savings Goal Calculator', category: 'calculators', icon: 'Calculator', client: GENERIC_CALC,
    description: 'See how much to save each month to hit a savings goal.',
    longDescription: 'Plan a savings target. The savings goal calculator works out the monthly contribution needed, accounting for current savings and expected return.',
    keywords: ['savings goal calculator', 'savings calculator', 'monthly savings', 'save for goal'],
    features: ['Monthly to save', 'Future value', 'No upload'] },
  { slug: 'retirement-calculator', name: 'Retirement Calculator', category: 'calculators', icon: 'Calculator', client: GENERIC_CALC,
    description: 'Project your retirement savings from current age and contributions.',
    longDescription: 'Estimate how much you could have at retirement. The retirement calculator uses your age, current savings, monthly contributions and return rate.',
    keywords: ['retirement calculator', 'retirement savings', 'pension calculator', 'future savings'],
    features: ['Years to retire', 'Projected savings', 'No upload'] },
  { slug: 'inflation-calculator', name: 'Inflation Calculator', category: 'calculators', icon: 'Calculator', client: GENERIC_CALC,
    description: 'See how inflation changes the future cost of money.',
    longDescription: 'Understand purchasing power over time. The inflation calculator shows the future cost of today’s amount at a given inflation rate.',
    keywords: ['inflation calculator', 'future value inflation', 'purchasing power', 'cost inflation'],
    features: ['Future cost', 'Lost value', 'No upload'] },
  { slug: 'tdee-calculator', name: 'TDEE Calculator', category: 'calculators', icon: 'Calculator', client: GENERIC_CALC,
    description: 'Estimate your daily calorie needs (BMR and TDEE).',
    longDescription: 'Find how many calories you burn each day. The TDEE calculator uses the Mifflin-St Jeor formula for BMR and activity level for total daily energy expenditure.',
    keywords: ['tdee calculator', 'bmr calculator', 'calorie needs', 'maintenance calories'],
    features: ['BMR', 'TDEE', 'Goal calories'] },
  { slug: 'calorie-calculator', name: 'Calorie Calculator', category: 'calculators', icon: 'Calculator', client: GENERIC_CALC,
    description: 'Work out the calories to maintain, lose or gain weight.',
    longDescription: 'Plan your diet with daily calorie targets. The calorie calculator estimates maintenance and adjusted intakes for weight goals.',
    keywords: ['calorie calculator', 'daily calories', 'weight loss calories', 'calorie intake'],
    features: ['Maintain', 'Lose', 'Gain'] },
  { slug: 'pregnancy-due-date-calculator', name: 'Pregnancy Due Date Calculator', category: 'calculators', icon: 'Calculator', client: GENERIC_CALC,
    description: 'Estimate your due date from the first day of your last period.',
    longDescription: 'Get an estimated due date and conception window. The pregnancy due date calculator adds 280 days to your last period date.',
    keywords: ['due date calculator', 'pregnancy calculator', 'estimated due date', 'baby due date'],
    features: ['Due date', 'Conception', 'No upload'] },
  { slug: 'body-fat-calculator', name: 'Body Fat Calculator', category: 'calculators', icon: 'Calculator', client: GENERIC_CALC,
    description: 'Estimate body fat percentage with the U.S. Navy method.',
    longDescription: 'A quick body fat estimate using height, waist, neck (and hip for women) measurements. The body fat calculator applies the U.S. Navy formula.',
    keywords: ['body fat calculator', 'body fat percentage', 'navy body fat', 'body fat estimate'],
    features: ['Estimated %', 'Navy method', 'No upload'] },

  // ---- Audio format pairs ----
  { slug: 'wav-to-mp3', name: 'WAV to MP3', category: 'audio', icon: 'Music', client: AUDIO_PAIR,
    description: 'Convert WAV audio to MP3 to shrink file size — locally in your browser.',
    longDescription: 'Turn large WAV files into compact MP3. WAV to MP3 runs on your device with ffmpeg.wasm, so nothing is uploaded.',
    keywords: ['wav to mp3', 'convert wav to mp3', 'wav to mp3 converter', 'wav to mp3 online'],
    features: ['WAV → MP3', 'Smaller files', 'Local only'], relatedTools: ['audio-converter', 'flac-to-mp3'] },
  { slug: 'flac-to-mp3', name: 'FLAC to MP3', category: 'audio', icon: 'Music', client: AUDIO_PAIR,
    description: 'Convert lossless FLAC to MP3 for universal playback.',
    longDescription: 'Make FLAC files play anywhere by converting to MP3. FLAC to MP3 processes locally in your browser — no upload.',
    keywords: ['flac to mp3', 'convert flac to mp3', 'flac to mp3 converter', 'flac mp3'],
    features: ['FLAC → MP3', 'Universal playback', 'Local only'], relatedTools: ['audio-converter', 'wav-to-mp3'] },
  { slug: 'ogg-to-mp3', name: 'OGG to MP3', category: 'audio', icon: 'Music', client: AUDIO_PAIR,
    description: 'Convert OGG audio to MP3 in your browser.',
    longDescription: 'Change OGG files into MP3 for broader device support. OGG to MP3 runs entirely on your device.',
    keywords: ['ogg to mp3', 'convert ogg to mp3', 'ogg to mp3 converter', 'ogg mp3'],
    features: ['OGG → MP3', 'Local only', 'No upload'], relatedTools: ['audio-converter', 'flac-to-mp3'] },
  { slug: 'mp3-to-wav', name: 'MP3 to WAV', category: 'audio', icon: 'Music', client: AUDIO_PAIR,
    description: 'Convert MP3 to uncompressed WAV for editing.',
    longDescription: 'Get a WAV version of an MP3 for studio or editing work. MP3 to WAV runs locally in your browser.',
    keywords: ['mp3 to wav', 'convert mp3 to wav', 'mp3 to wav converter', 'mp3 wav'],
    features: ['MP3 → WAV', 'Uncompressed', 'Local only'], relatedTools: ['audio-converter', 'wav-to-mp3'] },
  { slug: 'm4a-to-wav', name: 'M4A to WAV', category: 'audio', icon: 'Music', client: AUDIO_PAIR,
    description: 'Convert M4A audio to WAV quickly and privately.',
    longDescription: 'Turn M4A files into WAV for editing and compatibility. M4A to WAV processes on your device.',
    keywords: ['m4a to wav', 'convert m4a to wav', 'm4a to wav converter', 'm4a wav'],
    features: ['M4A → WAV', 'Local only', 'No upload'], relatedTools: ['audio-converter', 'mp3-to-wav'] },
  { slug: 'wav-to-flac', name: 'WAV to FLAC', category: 'audio', icon: 'Music', client: AUDIO_PAIR,
    description: 'Convert WAV to lossless FLAC to save space without quality loss.',
    longDescription: 'Shrink WAV files with lossless FLAC compression. WAV to FLAC runs locally in your browser.',
    keywords: ['wav to flac', 'convert wav to flac', 'wav to flac converter', 'wav flac'],
    features: ['WAV → FLAC', 'Lossless', 'Local only'], relatedTools: ['audio-converter', 'flac-to-mp3'] },
  { slug: 'video-to-mp3', name: 'Video to MP3', category: 'audio', icon: 'Music', client: AUDIO_PAIR,
    description: 'Extract audio from a video and save it as MP3.',
    longDescription: 'Pull the soundtrack out of any video as an MP3. Video to MP3 runs locally with ffmpeg.wasm — your file never leaves your device.',
    keywords: ['video to mp3', 'extract audio from video', 'mp4 to mp3', 'video to mp3 converter'],
    features: ['Video → MP3', 'Extract audio', 'Local only'], relatedTools: ['audio-converter', 'audio-cutter'] },

  // ---- Image format pairs ----
  { slug: 'png-to-jpg', name: 'PNG to JPG', category: 'image', icon: 'Image', client: IMAGE_PAIR,
    description: 'Convert PNG images to JPG to reduce file size.',
    longDescription: 'Switch PNG to JPG for smaller photos. PNG to JPG runs in your browser — no upload, no server.',
    keywords: ['png to jpg', 'convert png to jpg', 'png to jpg converter', 'png jpg'],
    features: ['PNG → JPG', 'Smaller size', 'Local only'], relatedTools: ['image-converter', 'jpg-to-png'] },
  { slug: 'jpg-to-png', name: 'JPG to PNG', category: 'image', icon: 'Image', client: IMAGE_PAIR,
    description: 'Convert JPG images to PNG to keep transparency and quality.',
    longDescription: 'Turn JPG into PNG when you need lossless quality. JPG to PNG processes locally in your browser.',
    keywords: ['jpg to png', 'convert jpg to png', 'jpg to png converter', 'jpg png'],
    features: ['JPG → PNG', 'Lossless', 'Local only'], relatedTools: ['image-converter', 'png-to-jpg'] },
  { slug: 'webp-to-jpg', name: 'WEBP to JPG', category: 'image', icon: 'Image', client: IMAGE_PAIR,
    description: 'Convert WEBP images to JPG for maximum compatibility.',
    longDescription: 'Open WEBP files anywhere by converting to JPG. WEBP to JPG runs on your device.',
    keywords: ['webp to jpg', 'convert webp to jpg', 'webp to jpg converter', 'webp jpg'],
    features: ['WEBP → JPG', 'Compatible', 'Local only'], relatedTools: ['image-converter', 'webp-to-png'] },
  { slug: 'webp-to-png', name: 'WEBP to PNG', category: 'image', icon: 'Image', client: IMAGE_PAIR,
    description: 'Convert WEBP images to PNG without quality loss.',
    longDescription: 'Change WEBP to PNG when you need lossless output. WEBP to PNG processes locally in your browser.',
    keywords: ['webp to png', 'convert webp to png', 'webp to png converter', 'webp png'],
    features: ['WEBP → PNG', 'Lossless', 'Local only'], relatedTools: ['image-converter', 'webp-to-jpg'] },
  { slug: 'png-to-webp', name: 'PNG to WEBP', category: 'image', icon: 'Image', client: IMAGE_PAIR,
    description: 'Convert PNG to WEBP for smaller web images.',
    longDescription: 'Shrink PNG files for the web with WEBP. PNG to WEBP runs in your browser.',
    keywords: ['png to webp', 'convert png to webp', 'png to webp converter', 'png webp'],
    features: ['PNG → WEBP', 'Smaller web size', 'Local only'], relatedTools: ['image-converter', 'jpg-to-webp'] },
  { slug: 'jpg-to-webp', name: 'JPG to WEBP', category: 'image', icon: 'Image', client: IMAGE_PAIR,
    description: 'Convert JPG to WEBP to speed up your website.',
    longDescription: 'Make JPG photos lighter with WEBP. JPG to WEBP processes locally in your browser.',
    keywords: ['jpg to webp', 'convert jpg to webp', 'jpg to webp converter', 'jpg webp'],
    features: ['JPG → WEBP', 'Web optimized', 'Local only'], relatedTools: ['image-converter', 'png-to-webp'] },

  // ---- Video format pairs ----
  { slug: 'mov-to-mp4', name: 'MOV to MP4', category: 'video', icon: 'Video', client: VIDEO_PAIR,
    description: 'Convert MOV videos to MP4 for universal playback.',
    longDescription: 'Make QuickTime MOV files play anywhere by converting to MP4. MOV to MP4 runs locally with ffmpeg.wasm.',
    keywords: ['mov to mp4', 'convert mov to mp4', 'mov to mp4 converter', 'mov mp4'],
    features: ['MOV → MP4', 'Universal', 'Local only'], relatedTools: ['video-converter', 'mkv-to-mp4'] },
  { slug: 'mkv-to-mp4', name: 'MKV to MP4', category: 'video', icon: 'Video', client: VIDEO_PAIR,
    description: 'Convert MKV videos to MP4 for easier sharing.',
    longDescription: 'Turn MKV files into MP4 for broader device support. MKV to MP4 processes on your device.',
    keywords: ['mkv to mp4', 'convert mkv to mp4', 'mkv to mp4 converter', 'mkv mp4'],
    features: ['MKV → MP4', 'Shareable', 'Local only'], relatedTools: ['video-converter', 'mov-to-mp4'] },
  { slug: 'webm-to-mp4', name: 'WEBM to MP4', category: 'video', icon: 'Video', client: VIDEO_PAIR,
    description: 'Convert WEBM videos to MP4 for compatibility.',
    longDescription: 'Change WEBM to MP4 so videos play on any device. WEBM to MP4 runs locally with ffmpeg.wasm.',
    keywords: ['webm to mp4', 'convert webm to mp4', 'webm to mp4 converter', 'webm mp4'],
    features: ['WEBM → MP4', 'Compatible', 'Local only'], relatedTools: ['video-converter', 'mp4-to-webm'] },
  { slug: 'avi-to-mp4', name: 'AVI to MP4', category: 'video', icon: 'Video', client: VIDEO_PAIR,
    description: 'Convert AVI videos to MP4 to shrink and share.',
    longDescription: 'Modernize AVI files as MP4. AVI to MP4 processes locally in your browser.',
    keywords: ['avi to mp4', 'convert avi to mp4', 'avi to mp4 converter', 'avi mp4'],
    features: ['AVI → MP4', 'Smaller', 'Local only'], relatedTools: ['video-converter', 'mov-to-mp4'] },
  { slug: 'mp4-to-webm', name: 'MP4 to WEBM', category: 'video', icon: 'Video', client: VIDEO_PAIR,
    description: 'Convert MP4 to WEBM for lighter web video.',
    longDescription: 'Optimize MP4 for the web with WEBM. MP4 to WEBM runs locally with ffmpeg.wasm.',
    keywords: ['mp4 to webm', 'convert mp4 to webm', 'mp4 to webm converter', 'mp4 webm'],
    features: ['MP4 → WEBM', 'Web optimized', 'Local only'], relatedTools: ['video-converter', 'webm-to-mp4'] },
  { slug: 'mp4-to-mov', name: 'MP4 to MOV', category: 'video', icon: 'Video', client: VIDEO_PAIR,
    description: 'Convert MP4 videos to MOV for Apple devices.',
    longDescription: 'Get an MOV version of an MP4 for QuickTime and macOS. MP4 to MOV processes on your device.',
    keywords: ['mp4 to mov', 'convert mp4 to mov', 'mp4 to mov converter', 'mp4 mov'],
    features: ['MP4 → MOV', 'Apple friendly', 'Local only'], relatedTools: ['video-converter', 'mov-to-mp4'] },

  // ---- Test family ----
  { slug: 'keyboard-test', name: 'Keyboard Test', category: 'utility', icon: 'Keyboard', client: { import: '@/tools/keyboard-test/KeyboardTestClient', name: 'KeyboardTestClient' },
    description: 'Check every key on your keyboard right in the browser.',
    longDescription: 'See which keys register when you press them. The keyboard test helps you spot stuck or unresponsive keys — no install needed.',
    keywords: ['keyboard test', 'test keyboard keys', 'key tester', 'online keyboard test'],
    features: ['Key detection', 'No install', 'Live log'], relatedTools: ['mouse-test', 'dead-pixel-test'] },
  { slug: 'mouse-test', name: 'Mouse Test', category: 'utility', icon: 'MousePointer', client: { import: '@/tools/mouse-test/MouseTestClient', name: 'MouseTestClient' },
    description: 'Test mouse buttons, double-click and scroll in your browser.',
    longDescription: 'Verify your mouse works — left, middle and right buttons, double-click and scroll wheel. The mouse test runs entirely on your device.',
    keywords: ['mouse test', 'test mouse buttons', 'mouse click test', 'online mouse test'],
    features: ['Button test', 'Double-click', 'Scroll count'], relatedTools: ['keyboard-test', 'dead-pixel-test'] },
  { slug: 'dead-pixel-test', name: 'Dead Pixel Test', category: 'utility', icon: 'Monitor', client: { import: '@/tools/dead-pixel-test/DeadPixelTestClient', name: 'DeadPixelTestClient' },
    description: 'Find stuck or dead pixels with full-screen color panels.',
    longDescription: 'Cycle through solid colors to spot dead or stuck pixels on your screen. The dead pixel test needs no software install.',
    keywords: ['dead pixel test', 'stuck pixel test', 'pixel test', 'screen test'],
    features: ['Solid colors', 'No install', 'Quick check'], relatedTools: ['keyboard-test', 'mouse-test'] },
  { slug: 'webcam-test', name: 'Webcam Test', category: 'utility', icon: 'Camera', client: { import: '@/tools/webcam-test/WebcamTestClient', name: 'WebcamTestClient' },
    description: 'Preview your webcam and check image quality before a call.',
    longDescription: 'See your camera live and switch between connected webcams. The webcam test stream stays local in your browser.',
    keywords: ['webcam test', 'camera test', 'test my webcam', 'online webcam test'],
    features: ['Live preview', 'Camera switch', 'Local only'], relatedTools: ['mic-test', 'keyboard-test'] },

  // ---- Audio long-tail ----
  { slug: 'metronome', name: 'Metronome', category: 'audio', icon: 'Music', client: { import: '@/tools/metronome/MetronomeClient', name: 'MetronomeClient' },
    description: 'A precise metronome for practice — runs in your browser.',
    longDescription: 'Keep time with an adjustable metronome from 30 to 250 BPM. The metronome generates clicks with the Web Audio API, no install.',
    keywords: ['metronome', 'online metronome', 'beat metronome', 'practice metronome'],
    features: ['30–250 BPM', 'Web Audio', 'No install'], relatedTools: ['tuner', 'white-noise-generator'] },
  { slug: 'white-noise-generator', name: 'White Noise Generator', category: 'audio', icon: 'Volume2', client: { import: '@/tools/white-noise-generator/WhiteNoiseClient', name: 'WhiteNoiseClient' },
    description: 'Play white noise for focus, sleep or masking sound.',
    longDescription: 'Generate white noise instantly in your browser with adjustable volume. No files, no upload.',
    keywords: ['white noise', 'white noise generator', 'noise generator', 'focus noise'],
    features: ['Adjustable volume', 'Instant', 'Local only'], relatedTools: ['metronome', 'tuner'] },
  { slug: 'vocal-remover', name: 'Vocal Remover', category: 'audio', icon: 'AudioLines', client: { import: '@/tools/vocal-remover/VocalRemoverClient', name: 'VocalRemoverClient' },
    description: 'Remove vocals from a stereo track to make an instrumental.',
    longDescription: 'Turn a song into a karaoke-style instrumental using phase cancellation. The vocal remover processes your file locally and exports WAV.',
    keywords: ['vocal remover', 'remove vocals', 'karaoke maker', 'instrumental maker'],
    features: ['Center cancel', 'WAV export', 'Local only'], relatedTools: ['audio-converter', 'audio-cutter'] },
  { slug: 'tuner', name: 'Guitar Tuner', category: 'audio', icon: 'Mic', client: { import: '@/tools/tuner/TunerClient', name: 'TunerClient' },
    description: 'Tune a guitar, bass or violin with your microphone.',
    longDescription: 'A chromatic tuner that listens through your mic and shows the nearest note and cents. The tuner analyses audio locally.',
    keywords: ['guitar tuner', 'online tuner', 'chromatic tuner', 'microphone tuner'],
    features: ['Chromatic', 'Live pitch', 'Local only'], relatedTools: ['metronome', 'mic-test'] },

  // ---- Documents ----
  { slug: 'signature-maker', name: 'Signature Maker', category: 'documents', icon: 'PenTool', client: { import: '@/tools/signature-maker/SignatureMakerClient', name: 'SignatureMakerClient' },
    description: 'Draw your signature and download it as a PNG.',
    longDescription: 'Create a clean signature image for documents. The signature maker draws on a canvas and exports a PNG — everything stays in your browser.',
    keywords: ['signature maker', 'online signature', 'e signature', 'draw signature'],
    features: ['Draw & export', 'PNG', 'Local only'], relatedTools: ['pdf-watermark', 'pdf-stamp'] },
];

function camel(slug) {
  return slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) + 'Config';
}

function q(s) {
  return `'${s.replace(/'/g, "\\'")}'`;
}

let configCount = 0;
const regImports = [];
const regArray = [];
const mapImports = new Map(); // path -> name
const mapEntries = [];

for (const t of NEW) {
  const dir = `${SRC}/tools/${t.slug}`;
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const cfg = `import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: ${q(t.slug)},
  name: ${q(t.name)},
  description: ${q(t.description)},
  longDescription: ${q(t.longDescription)},
  category: ${q(t.category)},
  keywords: [${t.keywords.map(q).join(', ')}],
  icon: ${q(t.icon)},
  isClientOnly: true,
  features: [${t.features.map(q).join(', ')}],
  relatedTools: [${t.relatedTools ? t.relatedTools.map(q).join(', ') : ''}],
  howTo: [${HOWTO[t.category].map(q).join(', ')}],
  addedAt: ${q(ADDED)},
};
`;
  writeFileSync(`${dir}/config.ts`, cfg);
  configCount++;

  const varName = camel(t.slug);
  regImports.push(`import { config as ${varName} } from './${t.slug}/config';`);
  regArray.push(`  ${varName},`);

  const compName = t.client.name;
  if (!mapImports.has(t.client.import)) mapImports.set(t.client.import, compName);
  mapEntries.push(`  '${t.slug}': ${compName},`);
}

// ---- registry.ts ----
const regPath = `${SRC}/tools/registry.ts`;
let reg = readFileSync(regPath, 'utf8');
reg = reg.replace(
  "import type { ToolConfig } from './types';",
  `import type { ToolConfig } from './types';\n${regImports.join('\n')}`,
);
reg = reg.replace(
  /\n\];\n\nexport const getToolBySlug/,
  `\n  ${regArray.join('\n  ')}\n];\n\nexport const getToolBySlug`,
);
writeFileSync(regPath, reg);

// ---- ToolPageClient.tsx ----
const tpcPath = `${SRC}/app/tools/[slug]/ToolPageClient.tsx`;
let tpc = readFileSync(tpcPath, 'utf8');
const importLines = [...mapImports.entries()]
  .map(([p, n]) => `import ${n} from '${p}';`)
  .join('\n');
tpc = tpc.replace(
  /const toolComponentMap: Record<string, React.ComponentType> = \{/,
  `${importLines}\n\nconst toolComponentMap: Record<string, React.ComponentType> = {`,
);
tpc = tpc.replace(
  /\n\};(\n\nexport default function ToolPageClient)/,
  `\n  ${mapEntries.join('\n  ')}\n};$1`,
);
writeFileSync(tpcPath, tpc);

console.log(`Generated ${configCount} config files.`);
console.log(`Registry imports added: ${regImports.length}, array entries: ${regArray.length}`);
console.log(`ToolPageClient imports added: ${mapImports.size}, map entries: ${mapEntries.length}`);
