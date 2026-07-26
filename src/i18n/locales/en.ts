// English source dictionary — the canonical fallback for every locale.
// To add a new language: create src/i18n/locales/<code>.ts exporting a
// dictionary with the same shape, then register <code> in config.ts.
// Untranslated keys automatically fall back to English here.

export const en = {
  common: {
    home: 'Home',
    allTools: 'All Tools',
    browseTools: 'Browse Tools →',
    copy: 'Copy',
    copied: 'Copied!',
    download: 'Download',
    preview: 'Preview',
    input: 'Input',
    output: 'Output',
    relatedTools: 'Related Tools',
    privacyNote:
      'Your data is processed entirely in your browser. Nothing is uploaded to any server.',
    noUpload: 'No Upload',
    freeForever: 'Free Forever',
    adSpace: 'Ad Space',
    language: 'Language',
    search: 'Search',
    loading: 'Loading…',
    // Discovery layers (search / quick tools / recent / discover)
    searchPlaceholder: 'Search 130+ tools…',
    searchHint: 'Find any tool — type a keyword',
    allResults: 'See all results',
    noResults: 'No tools match “{q}”.',
    tryBrowse: 'Try browsing all tools',
    quickTools: 'Quick Tools',
    quickToolsDesc: 'Popular picks for everyday tasks. Tap ★ to pin your own.',
    recent: 'Recent',
    recentEmpty: 'Tools you open will show up here for quick access.',
    clearRecent: 'Clear',
    discover: 'Discover',
    discoverDesc: 'Handy tools you might not have found yet.',
    hiddenGems: 'Hidden gems',
    shuffle: 'Shuffle',
    whatDoYouWant: 'What do you want to do?',
    pin: 'Pin to Quick Tools',
    pinned: 'Pinned',
    viewAll: 'View all',
    resultsFor: 'Results for',
    browseByCategory: 'Browse by category',
    ui: {
      upload: 'Upload',
      addFiles: 'Add Files',
      addFolder: 'Add Folder',
      outputFormat: 'Output format',
      originalFormat: 'Original format',
      quality: 'Quality',
      compressAll: 'Compress All',
      downloadAll: 'Download All',
      downloadZip: 'Download All (ZIP)',
      clear: 'Clear',
      clearAll: 'Clear All',
      total: 'Total',
      images: 'images',
      processed: 'Processed',
      original: 'Original',
      estimated: 'Estimated',
      saved: 'Saved',
      waiting: 'Waiting',
      processing: 'Processing',
      done: 'Done',
      failed: 'Failed',
      remove: 'Remove',
      generate: 'Generate',
      convert: 'Convert',
      reset: 'Reset',
      select: 'Select',
      browse: 'Browse',
      save: 'Save',
      close: 'Close',
      options: 'Options',
      file: 'File',
      files: 'Files',
      size: 'Size',
      format: 'Format',
      type: 'Type',
      name: 'Name',
      value: 'Value',
      width: 'Width',
      height: 'Height',
      result: 'Result',
      error: 'Error',
      cancel: 'Cancel',
      confirm: 'Confirm',
      copyAll: 'Copy All',
      add: 'Add',
      from: 'From',
      to: 'To',
      category: 'Category',
      apply: 'Apply',
      all: 'All',
      start: 'Start',
      stop: 'Stop',
    },
  },
  brand: {
    badge: 'Free · Private · No Signup',
    heroTitle: 'Online Tools for Developers & Marketers',
    heroSubtitle:
      'A growing collection of free, browser-based utilities. Everything runs on your device — fast, private and always available.',
  },
  categories: {
    title: 'Tool Categories',
    legal: 'Legal',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    footerTagline:
      'Free, fast and private online tools for developers, marketers and creators. Everything runs in your browser — no upload, no signup.',
    footerCopyright: 'ToolHub. All tools are free to use.',
    utility: {
      label: 'Everyday Tools',
      short: 'Utilities',
      description:
        'QR codes, password generator, unit converter, calculators, timers and more handy daily tools.',
      intro:
        'A growing collection of free everyday online tools that just work in your browser. Generate QR codes and strong passwords, convert units and time, run quick calculators (BMI, loan, percentage, age), pick colors from an image, create favicons, view or strip photo EXIF data, and copy fancy text, emojis and special characters. No signup, no uploads — everything runs locally on your device, fast and private.',
    },
    writing: {
      label: 'Writing Tools',
      short: 'Writing',
      description:
        'Count words, estimate reading time, analyze readability and polish your copy instantly.',
      intro:
        'Free online writing tools for writers, bloggers, students and marketers. Count words and characters, estimate reading time, check the Flesch reading-ease score of your English copy, clean up messy text and compare two versions side by side — all in your browser, no signup required. Every tool processes text locally so your content never leaves your device.',
    },
    developer: {
      label: 'Developer Tools',
      short: 'Dev Tools',
      description:
        'Format JSON, encode Base64, decode JWT, generate UUIDs and test regex in the browser.',
      intro:
        'A collection of free developer utilities that run entirely client-side. Beautify and validate JSON, encode and decode Base64, escape or unescape URLs, decode JWT tokens to inspect their payload, generate RFC-4122 UUIDs in bulk, and build or debug regular expressions with live highlighting. Built for speed, privacy and zero configuration — perfect for API work, debugging and everyday coding.',
    },
    seo: {
      label: 'SEO & Webmaster Tools',
      short: 'SEO Tools',
      description:
        'Generate meta tags, robots.txt and sitemaps, and look up DNS records for any domain.',
      intro:
        'Essential free SEO and webmaster tools to help your site get discovered. Generate copy-ready Open Graph, Twitter Card and canonical meta tags, build a clean robots.txt, create an XML sitemap from a list of URLs, and perform DNS lookups to troubleshoot propagation and email delivery. These tools are designed for marketers, webmasters and indie founders who want actionable results without installing anything.',
    },
    image: {
      label: 'Image Tools',
      short: 'Image Tools',
      description:
        'Compress and convert images to shrink file size and speed up your website.',
      intro:
        'Free browser-based image tools to optimize visuals for the web. Compress JPG and PNG files with a live quality preview to cut page weight, and convert images between JPG, PNG and WebP formats in seconds. All processing happens locally using the Canvas API, so your photos are never uploaded to a server — fast, private and secure.',
    },
    pdf: {
      label: 'PDF Tools',
      short: 'PDF Tools',
      description: 'Merge multiple PDF files into one document right in your browser.',
      intro:
        'Simple, private PDF utilities that run entirely in your browser. Merge several PDF files into a single document by arranging them in the order you want, then download the result instantly. No uploads, no file-size limits from a server, no registration — your documents stay on your device the whole time.',
    },
    video: {
      label: 'Video Tools',
      short: 'Video Tools',
      description: 'Compress, convert, trim, merge and watermark videos — all in your browser, no upload.',
      intro:
        'Free, private browser-based video tools powered by ffmpeg.wasm. Compress large videos to share on social media, convert between MP4, MOV, WebM, AVI, MKV and GIF, trim or merge clips, change playback speed, add text watermarks, mute or extract audio, rotate and crop — all without uploading your file to any server. Your videos stay on your device the whole time, fast and secure.',
    },
    audio: {
      label: 'Audio Tools',
      short: 'Audio',
      description: 'Convert, cut, merge, compress and record audio — all in your browser, no upload.',
      intro:
        'Free browser-based audio tools that process everything locally on your device. Convert audio between MP3, WAV, M4A, OGG and FLAC, turn M4A voice memos into MP3, trim or merge clips, shrink file size, and record from your microphone — all without uploading a single byte. Private, fast and secure.',
    },
    calculators: {
      label: 'Calculators',
      short: 'Calculators',
      description: 'Everyday calculators: BMI, age, loan, tip, discount, percentage, compound interest, GPA and more.',
      intro:
        'A growing set of free online calculators for daily life, school and work. Check your BMI and weight category, calculate your exact age, work out loan or mortgage payments, split a restaurant tip, apply a discount, solve percentages, project compound interest, and compute your GPA. Every calculation runs instantly and privately in your browser.',
    },
    converters: {
      label: 'Unit Converters',
      short: 'Converters',
      description: 'Convert length, weight, temperature, area, volume, speed and data between units instantly.',
      intro:
        'Free instant unit converters for the units you actually use. Switch between meters and feet, kilograms and pounds, Celsius, Fahrenheit and Kelvin, hectares and acres, liters and gallons, km/h and mph, and bytes to terabytes — all computed in your browser with no upload and no waiting.',
    },
    design: {
      label: 'Design Tools',
      short: 'Design',
      description: 'CSS generators and color helpers for developers and designers.',
      intro:
        'Free browser-based design tools for developers, designers and creators. Generate CSS gradients and box shadows with live previews, check color contrast against WCAG accessibility guidelines, and compute aspect ratios for responsive layouts — all rendered instantly with copy-ready code. No uploads, no signup.',
    },
    text: {
      label: 'Text Tools',
      short: 'Text Tools',
      description: 'Transform, clean and encode text — sort, find-replace, morse, base convert and more.',
      intro:
        'A set of free online text tools that run entirely in your browser. Sort and de-duplicate lines, run regex find-and-replace, convert HTML entities, translate text to and from Morse code, switch number bases, reverse strings, count word frequency and normalize whitespace — all without uploading a single character.',
    },
    documents: {
      label: 'Document Tools',
      short: 'Documents',
      description: 'Convert between CSV, JSON, Excel, Word, PDF and Markdown — all in your browser.',
      intro:
        'Free client-side document converters for students, analysts and office workers. Turn CSV into JSON or Excel, convert Excel to CSV/JSON, transform Markdown into a PDF, and move content between Word and PDF — everything processed locally with no upload and no file-size limits.',
    },
  },

  tools: {
    'word-counter': {
      name: 'Word Counter',
      description: 'Count words, characters, sentences and lines in your text with reading time and keyword density — free and instant.',
      features: [
      'Words & characters',
      'Sentences & lines',
      'Reading time',
      'Keyword density',
      ],
    },
    'case-converter': {
      name: 'Case Converter',
      description: 'Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase and snake_case instantly.',
      features: [
      'UPPERCASE / lowercase',
      'Title & Sentence case',
      'camelCase / snake_case',
      'One-click copy',
      ],
    },
    'slug-generator': {
      name: 'Slug Generator',
      description: 'Turn any title or heading into a clean, SEO-friendly URL slug. Supports multiple separators and lowercase output.',
      features: [
      'SEO-friendly slugs',
      'Separator options',
      'Lowercase output',
      'One-click copy',
      ],
    },
    'json-formatter': {
      name: 'JSON Formatter',
      description: 'Format, validate and minify JSON with syntax error highlighting. Free online tool for developers.',
      features: [
      'Format & beautify',
      'Validate with errors',
      'Minify',
      'Copy result',
      ],
    },
    'base64': {
      name: 'Base64 Encode / Decode',
      description: 'Encode text to Base64 or decode Base64 back to text instantly in your browser. Supports UTF-8.',
      features: [
      'Encode text',
      'Decode Base64',
      'UTF-8 safe',
      'One-click copy',
      ],
    },
    'url-encoder': {
      name: 'URL Encode / Decode',
      description: 'Encode text for safe use in URLs or decode URL-encoded strings back to readable text.',
      features: [
      'Encode URI component',
      'Decode',
      'UTF-8 safe',
      'One-click copy',
      ],
    },
    'uuid-generator': {
      name: 'UUID Generator',
      description: 'Generate RFC-4122 version 4 UUIDs in bulk. Create one or thousands of unique identifiers instantly.',
      features: [
      'RFC-4122 v4',
      'Bulk generation',
      'Uppercase option',
      'Copy all',
      ],
    },
    'regex-tester': {
      name: 'Regex Tester',
      description: 'Test regular expressions against any text with live match highlighting and capture groups.',
      features: [
      'Live highlighting',
      'Flags support',
      'Capture groups',
      'Match count',
      ],
    },
    'jwt-decoder': {
      name: 'JWT Decoder',
      description: 'Decode JSON Web Tokens (JWT) and inspect the header and payload. No verification, fully client-side.',
      features: [
      'Decode header & payload',
      'Pretty JSON',
      'No signature check',
      'Private & instant',
      ],
    },
    'meta-tag-generator': {
      name: 'Meta Tag Generator',
      description: 'Generate Open Graph, Twitter Card and canonical meta tags for your page with a live HTML preview.',
      features: [
      'Open Graph tags',
      'Twitter Card',
      'Canonical tag',
      'Live preview & copy',
      ],
    },
    'robots-txt-generator': {
      name: 'Robots.txt Generator',
      description: 'Create a robots.txt file to control crawler access and point to your sitemap.',
      features: [
      'Allow / disallow bots',
      'Path rules',
      'Sitemap reference',
      'Copy & download',
      ],
    },
    'sitemap-generator': {
      name: 'Sitemap Generator',
      description: 'Turn a list of URLs into a standards-compliant XML sitemap for search engines.',
      features: [
      'XML output',
      'One URL per line',
      'Download .xml',
      'SEO ready',
      ],
    },
    'dns-lookup': {
      name: 'DNS Lookup',
      description: 'Query DNS records (A, AAAA, MX, TXT, CNAME, NS) for any domain using a public resolver.',
      features: [
      'A / AAAA / MX / TXT',
      'CNAME / NS',
      'TTL display',
      'Instant results',
      ],
    },
    'image-compressor': {
      name: 'Image Compressor',
      description: 'Batch-compress images in your browser. Original/JPG/WebP output, high-ratio PNG via color quantization or lossless oxipng, live size estimate, folder upload and ZIP download.',
      features: [
      'Original/JPG/WebP',
      'PNG: quant + oxipng',
      'Live estimate',
      'Batch & folder',
      'ZIP download',
      'Web Worker',
      '100% private',
      ],
    },
    'image-converter': {
      name: 'Image Converter',
      description: 'Convert images between JPG, PNG and WebP formats right in your browser. Fast and private.',
      features: [
      'JPG / PNG / WebP',
      'Batch & folder upload',
      'ZIP download',
      'Private',
      ],
    },
    'image-resize-crop': {
      name: 'Image Resizer & Cropper',
      description: 'Resize and crop images in your browser. Social presets, fill/crop, fit-with-border and blur background, multi-file batch, and multi-size export with per-size crop.',
      features: [
      'Social presets',
      'Fill / Border / Blur',
      'Drag & zoom',
      'Multi-file',
      'Multi-size export',
      '100% private',
      ],
    },
    'image-watermark': {
      name: 'Watermark & Text on Image',
      description: 'Add text or a logo watermark to your photos in the browser. Opacity, 9-grid positioning, tiled watermarks and batch processing with ZIP export.',
      features: [
      'Text & logo',
      'Opacity control',
      '9-grid position',
      'Tiled watermark',
      'Batch + ZIP',
      '100% private',
      ],
    },
    'image-collage': {
      name: 'Collage & Before-After Maker',
      description: 'Create photo collages and before/after comparison images in your browser. 2/3/4/9 grid layouts, split view, spacing, rounded corners, background color and aspect presets.',
      features: [
      '2/3/4/9 grids',
      'Before/After split',
      'Spacing & radius',
      'Background color',
      'Aspect presets',
      '100% private',
      ],
    },
    'image-upscaler': {
      name: 'Image Upscaler & Enhancer',
      description: 'Upscale and enhance images in your browser. 2x/4x enlargement with high-quality resampling, sharpening, noise reduction and contrast boost.',
      features: [
      '2x / 4x upscale',
      'Sharpen',
      'Noise reduction',
      'Contrast boost',
      'Before/After',
      '100% private',
      ],
    },
    'image-redact': {
      name: 'Blur, Pixelate & Redact Image',
      description: 'Hide sensitive parts of an image in your browser. Draw rectangles or brush over faces, plates, addresses and IDs with blur, pixelate or solid redaction.',
      features: [
      'Rectangle redact',
      'Brush redact',
      'Blur / Pixelate / Block',
      'Adjustable strength',
      'Undo',
      '100% private',
      ],
    },
    'pdf-merge': {
      name: 'PDF Merge',
      description: 'Combine multiple PDF files into a single document in your browser. No upload, no limits.',
      features: [
      'Merge multiple PDFs',
      'In-browser (pdf-lib)',
      'Private & secure',
      'Instant download',
      ],
    },
    'calculator': {
      name: 'Calculator Suite',
      description: 'Free online calculators for BMI, loan payments, percentages and age — quick answers in your browser.',
      features: [
      'BMI calculator',
      'Loan / mortgage',
      'Percentage',
      'Age calculator',
      ],
    },
    'color-picker': {
      name: 'Color Picker & Palette',
      description: 'Pick colors from an image or the color wheel, get HEX/RGB/HSL codes and generate matching palettes.',
      features: [
      'Pick from image',
      'HEX / RGB / HSL',
      'Palette generator',
      'One-click copy',
      ],
    },
    'diff-viewer': {
      name: 'Text Diff Viewer',
      description: 'Compare two versions of text side by side and highlight what changed — free and instant.',
      features: [
      'Line diff',
      'Add/remove highlight',
      'Change count',
      'Side by side',
      ],
    },
    'emoji-picker': {
      name: 'Emoji & Symbol Picker',
      description: 'Browse and copy emojis and special symbols — arrows, currency, math, punctuation and more.',
      features: [
      'Searchable',
      '12 categories',
      'One-click copy',
      'Emoji + symbols',
      ],
    },
    'exif-viewer': {
      name: 'EXIF Viewer & Cleaner',
      description: 'View photo metadata (camera, date, GPS) and strip it before sharing to protect your privacy.',
      features: [
      'View EXIF / GPS',
      'Strip metadata',
      'Private & local',
      'JPEG support',
      ],
    },
    'fancy-text-generator': {
      name: 'Fancy Text Generator',
      description: 'Turn plain text into stylish Unicode fonts — 𝔣𝔯𝔞𝔨𝔱𝔲𝔯, 𝓈𝒸𝓇𝒾𝓅𝓉, Ⓒⓘⓡⓒⓛⓔⓓ, bold and more for social posts.',
      features: [
      '12+ styles',
      'One-click copy',
      'Social-ready',
      'No signup',
      ],
    },
    'favicon-generator': {
      name: 'Favicon Generator',
      description: 'Generate multi-size favicons (16/32/180/192/512) from an image or text and download them as a ZIP.',
      features: [
      'Image or text input',
      '6 common sizes',
      'ZIP download',
      'HTML link code',
      ],
    },
    'image-background-remover': {
      name: 'Image Background Remover',
      description: 'Remove image backgrounds in your browser. Auto-detects solid vs complex backgrounds, batch-processes files and folders, and downloads a ZIP named <original>_nobg.png.',
      features: [
      'Solid + AI smart',
      'Auto-detect mode',
      'Batch & folder',
      'ZIP download',
      'Named _nobg',
      '100% private',
      ],
    },
    'image-border': {
      name: 'Image Border & Rounded Corners',
      description: 'Add rounded corners, a colored or gradient border and padding to any image — instantly.',
      features: [
      'Rounded corners',
      'Solid / gradient border',
      'Padding & bg',
      'Instant download',
      ],
    },
    'image-to-pdf': {
      name: 'Image to PDF',
      description: 'Turn JPG and PNG images into a single PDF. In your browser.',
      features: [
      'JPG & PNG support',
      'Multi-image order',
      'Original or A4 size',
      'Private & secure',
      ],
    },
    'password-generator': {
      name: 'Password Generator',
      description: 'Generate strong, random and secure passwords with custom length and character options — free and private.',
      features: [
      'Cryptographically secure',
      'Custom length & sets',
      'Exclude ambiguous chars',
      'Strength meter',
      ],
    },
    'pdf-compress': {
      name: 'PDF Compress',
      description: 'Shrink a PDF file size right in your browser.',
      features: [
      'Smaller file size',
      'Quality control',
      'Before / after size',
      'Private & secure',
      ],
    },
    'pdf-decrypt': {
      name: 'PDF Decrypt',
      description: 'Remove a password from a PDF when you know it. In your browser.',
      features: [
      'Remove open password',
      'Needs known password',
      'Instant unlock',
      'Private & secure',
      ],
    },
    'pdf-encrypt': {
      name: 'PDF Encrypt',
      description: 'Add a password and permissions to protect a PDF. In your browser.',
      features: [
      'Open password',
      'Permissions password',
      'Restrict print / copy',
      'Private & secure',
      ],
    },
    'pdf-extract-pages': {
      name: 'PDF Extract Pages',
      description: 'Extract selected pages from a PDF into a new single document. In your browser.',
      features: [
      'Pick pages visually',
      'Range input (1,3,5-9)',
      'One clean output',
      'Private & secure',
      ],
    },
    'pdf-extract-text': {
      name: 'PDF Extract Text',
      description: 'Pull the text out of a PDF into copyable plain text. In your browser.',
      features: [
      'Plain-text output',
      'Copy / download .txt',
      'Local pdf.js',
      'Private & secure',
      ],
    },
    'pdf-page-numbers': {
      name: 'Add Page Numbers to PDF',
      description: 'Add page numbers to every page of a PDF — choose position, start number and style.',
      features: [
      'Position options',
      'Start number',
      'Color & size',
      'Local processing',
      ],
    },
    'pdf-reorganize': {
      name: 'PDF Reorganize',
      description: 'Rotate, reorder and delete pages in a PDF. All in your browser.',
      features: [
      'Rotate 90° steps',
      'Reorder pages',
      'Delete pages',
      'Private & secure',
      ],
    },
    'pdf-rotate': {
      name: 'Rotate PDF',
      description: 'Rotate all pages of a PDF by 90°, 180° or 270° — fix sideways scans in one click.',
      features: [
      '90 / 180 / 270°',
      'All pages',
      'Keeps layout',
      'Local only',
      ],
    },
    'pdf-split': {
      name: 'PDF Split',
      description: 'Split a PDF into separate files by page or by page ranges. Runs in your browser.',
      features: [
      'Split every page',
      'Custom page ranges',
      'Batch download',
      'Private & secure',
      ],
    },
    'pdf-to-image': {
      name: 'PDF to Image',
      description: 'Render PDF pages to PNG images. In your browser.',
      features: [
      'Per-page PNG',
      'Zoom / quality control',
      'Batch download',
      'Private & secure',
      ],
    },
    'qr-code-generator': {
      name: 'QR Code Generator',
      description: 'Create custom QR codes from any text or URL — pick colors, error correction and download as PNG or SVG.',
      features: [
      'Text or URL',
      'Custom colors',
      'PNG & SVG download',
      'Adjustable error correction',
      ],
    },
    'readability-analyzer': {
      name: 'Readability Analyzer',
      description: 'Check the Flesch reading-ease score, grade level and sentence stats of your English text — free and instant.',
      features: [
      'Flesch score',
      'Grade level',
      'Sentence stats',
      'Difficulty band',
      ],
    },
    'reading-time': {
      name: 'Reading Time Estimator',
      description: 'Estimate how long your text takes to read, with mixed Chinese & English counting — free and instant.',
      features: [
      'Mixed CN/EN',
      'Separate counts',
      'Speech time',
      'Minute estimate',
      ],
    },
    'schema-generator': {
      name: 'Schema Markup Generator',
      description: 'Generate valid JSON-LD structured data (Article, FAQ, Product, Organization and more) for rich results in Google.',
      features: [
      '6 schema types',
      'Valid JSON-LD output',
      'Dynamic form fields',
      'One-click copy',
      ],
    },
    'serp-preview': {
      name: 'Google SERP Preview',
      description: 'Preview how your page title and meta description will look in Google search results, with pixel-width truncation warnings.',
      features: [
      'Desktop & mobile preview',
      'Pixel-width truncation',
      'Length warnings',
      'Live snippet render',
      ],
    },
    'stopwatch-timer': {
      name: 'Stopwatch & Timer',
      description: 'A free online stopwatch with laps and a countdown timer with sound alert — no install needed.',
      features: [
      'Stopwatch with laps',
      'Countdown timer',
      'Sound alert',
      'Precise timing',
      ],
    },
    'text-cleaner': {
      name: 'Text Cleaner',
      description: 'Tidy up messy copy: trim spaces, remove extra blank lines, normalize quotes and dashes — free and instant.',
      features: [
      'Trim spaces',
      'Strip blank lines',
      'ASCII quotes',
      'Live preview',
      ],
    },
    'timestamp-converter': {
      name: 'Unix Timestamp Converter',
      description: 'Convert Unix timestamps to human-readable dates and back — supports seconds and milliseconds, local and UTC.',
      features: [
      'Seconds & milliseconds',
      'Local & UTC',
      'Live current timestamp',
      'Two-way conversion',
      ],
    },
    'unit-converter': {
      name: 'Unit Converter',
      description: 'Convert length, weight, temperature, area, volume, speed and data units instantly — free online converter.',
      features: [
      '8 categories',
      'Metric & imperial',
      'Instant results',
      'No signup',
      ],
    },
  },
};
