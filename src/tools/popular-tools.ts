// Seed list of "popular" (Quick tools) for normal users — not developers / webmasters.
// Picked by real-world search-demand tiers (see 交互设计方案.md). This is a seed
// used until GA4 event data can replace it. Order = display order on the home page.
//
// To refresh later: paste the real GA4 top-tool_open ranking here (or wire the
// `tool_open` event to a `popular.json` fetched at build time).

export const POPULAR_TOOL_SLUGS: string[] = [
  'image-compressor',      // 1  compress image (everyone emailing / uploading files)
  'pdf-merge',             // 2  merge PDF (work, resumes, homework)
  'pdf-compress',          // 3  compress PDF (attachment size limits)
  'word-counter',          // 4  word count (students, writers, creators)
  'qr-code-generator',     // 5  QR code (merchants, events, sharing)
  'batch-background-remover', // 6  remove background (ecommerce, photos, ID)
  'image-converter',       // 7  image format convert (PNG/JPG/WebP)
  'heic-to-jpg',           // 8  HEIC → JPG (iPhone users, fast-growing)
  'bmi-calculator',        // 9  BMI (health / weight-loss)
  'percentage-calculator', // 10 percentage (shopping, finance, study)
  'image-resize-crop',     // 11 image resize / crop (social, ID photos)
  'word-to-pdf',           // 12 Word → PDF (work, resumes)
  'image-to-pdf',          // 13 image → PDF (scans, combine docs)
  'password-generator',    // 14 password generator (everyone signing up)
  'video-compressor',      // 15 video compress (upload size limits)
  'ocr',                   // 16 image to text (copy from screenshots)
];

// "Hidden gems" pool for the Discover section — useful long-tail tools that
// normal users might not know to look for. Rotated with "Shuffle".
export const HIDDEN_GEM_SLUGS: string[] = [
  'heic-to-jpg',
  'ocr',
  'bpm-detector',
  'roman-numeral-converter',
  'cron-parser',
  'markdown-to-pdf',
  'xml-to-json',
  'mic-test',
  'gpa-calculator',
  'svg-to-png',
  'video-to-gif',
  'audio-merger',
  'pdf-flatten',
  'slug-generator',
  'timestamp-converter',
  'image-watermark',
  'favicon-generator',
  'exif-viewer',
  'emoji-picker',
  'fancy-text-generator',
];
