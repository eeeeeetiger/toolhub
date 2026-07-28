import type { ToolCategory } from './types';

export interface CategoryMeta {
  slug: ToolCategory;
  label: string;
  short: string;
  description: string;
  /** Original intro copy for the category hub page (topical authority / AdSense). */
  intro: string;
  keywords: string[];
  icon: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: 'utility',
    label: 'Everyday Tools',
    short: 'Utilities',
    description: 'QR codes, password generator, unit converter, calculators, timers and more handy daily tools.',
    intro:
      'A growing collection of free everyday online tools that just work in your browser. Generate QR codes and strong passwords, convert units and time, run quick calculators (BMI, loan, percentage, age), pick colors from an image, create favicons, view or strip photo EXIF data, and copy fancy text, emojis and special characters. No signup, no uploads — everything runs locally on your device, fast and private.',
    keywords: ['qr code generator', 'password generator', 'unit converter', 'timestamp converter', 'online calculator', 'color picker', 'favicon generator', 'everyday tools'],
    icon: 'Wrench',
  },
  {
    slug: 'developer',
    label: 'Developer Tools',
    short: 'Dev Tools',
    description: 'Format JSON, encode Base64, decode JWT, generate UUIDs, convert case and test regex in the browser.',
    intro:
      'A collection of free developer utilities that run entirely client-side. Beautify and validate JSON, encode and decode Base64, escape or unescape URLs, decode JWT tokens to inspect their payload, generate RFC-4122 UUIDs in bulk, switch between UPPERCASE, lowercase, Title Case and camelCase, and build or debug regular expressions with live highlighting. Built for speed, privacy and zero configuration — perfect for API work, debugging and everyday coding.',
    keywords: ['json formatter', 'base64 encoder', 'jwt decoder', 'uuid generator', 'regex tester', 'case converter', 'developer tools'],
    icon: 'Code',
  },
  {
    slug: 'seo',
    label: 'SEO & Webmaster Tools',
    short: 'SEO Tools',
    description: 'Generate meta tags, robots.txt and sitemaps, and look up DNS records for any domain.',
    intro:
      'Essential free SEO and webmaster tools to help your site get discovered. Generate copy-ready Open Graph, Twitter Card and canonical meta tags, build a clean robots.txt, create an XML sitemap from a list of URLs, and perform DNS lookups to troubleshoot propagation and email delivery. These tools are designed for marketers, webmasters and indie founders who want actionable results without installing anything.',
    keywords: ['meta tag generator', 'robots.txt generator', 'sitemap generator', 'dns lookup', 'seo tools'],
    icon: 'Search',
  },
  {
    slug: 'image',
    label: 'Image Tools',
    short: 'Image Tools',
    description: 'Compress and convert images to shrink file size and speed up your website.',
    intro:
      'Free browser-based image tools to optimize visuals for the web. Compress JPG and PNG files with a live quality preview to cut page weight, and convert images between JPG, PNG and WebP formats in seconds. All processing happens locally using the Canvas API, so your photos are never uploaded to a server — fast, private and secure.',
    keywords: ['image compressor', 'image converter', 'compress jpg', 'convert png to webp', 'optimize images'],
    icon: 'Image',
  },
  {
    slug: 'pdf',
    label: 'PDF Tools',
    short: 'PDF Tools',
    description: 'Merge, split, compress, rotate, encrypt and convert PDFs right in your browser.',
    intro:
      'A full set of private, browser-based PDF utilities — no uploads, no server file-size limits, no registration. Merge several PDFs into one, split or extract the exact pages you need, rotate / reorder / delete pages, shrink bulky files, lock a document with a password (or remove a password you already know), turn images into a PDF and PDF pages into images, and pull text out of a document. Everything runs locally with pdf-lib and pdf.js, so your files stay on your device the whole time.',
    keywords: [
      'merge pdf',
      'split pdf',
      'compress pdf',
      'rotate pdf',
      'encrypt pdf',
      'pdf to image',
      'image to pdf',
      'extract text from pdf',
      'pdf tools',
    ],
    icon: 'FileText',
  },
  {
    slug: 'video',
    label: 'Video Tools',
    short: 'Video Tools',
    description: 'Compress, convert, trim, merge and watermark videos — all in your browser, no upload.',
    intro:
      'Free, private browser-based video tools powered by ffmpeg.wasm. Compress large videos to share on social media, convert between MP4, MOV, WebM, AVI, MKV and GIF, trim or merge clips, change playback speed, add text watermarks, mute or extract audio, rotate and crop — all without uploading your file to any server. Your videos stay on your device the whole time, fast and secure.',
    keywords: [
      'video compressor',
      'video converter',
      'video to gif',
      'trim video',
      'merge video',
      'video watermark',
      'mute video',
      'video tools',
    ],
    icon: 'Video',
  },
  {
    slug: 'audio',
    label: 'Audio Tools',
    short: 'Audio',
    description: 'Convert, cut, merge, compress and record audio — all in your browser, no upload.',
    intro:
      'Free browser-based audio tools that process everything locally on your device. Convert audio between MP3, WAV, M4A, OGG and FLAC, turn M4A voice memos into MP3, trim or merge clips, shrink file size, and record from your microphone — all without uploading a single byte. Private, fast and secure.',
    keywords: ['audio converter', 'm4a to mp3', 'audio cutter', 'merge audio', 'audio recorder', 'audio tools'],
    icon: 'Music',
  },
  {
    slug: 'calculators',
    label: 'Calculators',
    short: 'Calculators',
    description: 'Everyday calculators: BMI, age, loan, tip, discount, percentage, compound interest, GPA and more.',
    intro:
      'A growing set of free online calculators for daily life, school and work. Check your BMI and weight category, calculate your exact age, work out loan or mortgage payments, split a restaurant tip, apply a discount, solve percentages, project compound interest, and compute your GPA. Every calculation runs instantly and privately in your browser.',
    keywords: ['bmi calculator', 'loan calculator', 'percentage calculator', 'tip calculator', 'age calculator', 'online calculators'],
    icon: 'Calculator',
  },
  {
    slug: 'converters',
    label: 'Unit Converters',
    short: 'Converters',
    description: 'Convert length, weight, temperature, area, volume, speed and data between units instantly.',
    intro:
      'Free instant unit converters for the units you actually use. Switch between meters and feet, kilograms and pounds, Celsius, Fahrenheit and Kelvin, hectares and acres, liters and gallons, km/h and mph, and bytes to terabytes — all computed in your browser with no upload and no waiting.',
    keywords: ['unit converter', 'length converter', 'temperature converter', 'weight converter', 'data converter'],
    icon: 'Ruler',
  },
  {
    slug: 'design',
    label: 'Design Tools',
    short: 'Design',
    description: 'CSS generators and color helpers for developers and designers.',
    intro:
      'Free browser-based design tools for developers, designers and creators. Generate CSS gradients and box shadows with live previews, check color contrast against WCAG accessibility guidelines, and compute aspect ratios for responsive layouts — all rendered instantly with copy-ready code. No uploads, no signup.',
    keywords: ['css gradient generator', 'box shadow generator', 'color contrast checker', 'aspect ratio calculator', 'design tools'],
    icon: 'Palette',
  },
  {
    slug: 'text',
    label: 'Text Tools',
    short: 'Text Tools',
    description: 'Transform, clean and encode text — sort, find-replace, morse, base convert and more.',
    intro:
      'A set of free online text tools that run entirely in your browser. Sort and de-duplicate lines, run regex find-and-replace, convert HTML entities, translate text to and from Morse code, switch number bases, reverse strings, count word frequency and normalize whitespace — all without uploading a single character.',
    keywords: ['text tools', 'sort text', 'regex replace', 'morse code', 'base converter', 'html entity encoder'],
    icon: 'Type',
  },
  {
    slug: 'documents',
    label: 'Document Tools',
    short: 'Documents',
    description: 'Convert between CSV, JSON, Excel, Word, PDF and Markdown — all in your browser.',
    intro:
      'Free client-side document converters for students, analysts and office workers. Turn CSV into JSON or Excel, convert Excel to CSV/JSON, transform Markdown into a PDF, and move content between Word and PDF — everything processed locally with no upload and no file-size limits.',
    keywords: ['csv to json', 'excel to csv', 'markdown to pdf', 'word to pdf', 'pdf to word', 'document converter'],
    icon: 'FileText',
  },
];

export const getCategory = (slug: string): CategoryMeta | undefined =>
  CATEGORIES.find((c) => c.slug === slug);
