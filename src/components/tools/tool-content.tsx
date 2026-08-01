'use client';

import type { ToolConfig, ToolCategory } from '@/tools/types';

// 每个分类的通用 FAQ（工具未单独配置 faqs 时自动使用），兼顾 AdSense 内容厚度与 SEO。
const CATEGORY_FAQ: Record<ToolCategory, { q: string; a: string }[]> = {
  developer: [
    { q: 'Is this developer tool free?', a: 'Yes, it is 100% free and works entirely in your browser.' },
    { q: 'Is my data sent anywhere?', a: 'No. Everything is processed locally on your device.' },
    { q: 'Do I need to install anything?', a: 'No. The tool runs in any modern browser, no installation needed.' },
  ],
  seo: [
    { q: 'Is this SEO tool free?', a: 'Yes, and it runs entirely in your browser.' },
    { q: 'Are my inputs uploaded?', a: 'No. Your inputs are processed locally and never leave your device.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
  ],
  image: [
    { q: 'Is this image tool free?', a: 'Yes, every image tool on Offline ToolHub is free to use.' },
    { q: 'Are my images uploaded to a server?', a: 'No. Images are processed locally in your browser for full privacy.' },
    { q: 'What formats are supported?', a: 'Common formats such as JPG, PNG, WebP and more, depending on the tool.' },
  ],
  pdf: [
    { q: 'Is this PDF tool free?', a: 'Yes, all PDF tools are free and run in your browser.' },
    { q: 'Are my PDFs uploaded?', a: 'No. Your PDFs are processed locally on your device and never leave it.' },
    { q: 'Is there a file size limit?', a: 'Very large files may be slower because processing happens on your device, but there is no hard upload limit.' },
  ],
  utility: [
    { q: 'Is this tool free?', a: 'Yes, Offline ToolHub tools are free and private.' },
    { q: 'Is my data uploaded?', a: 'No. Processing happens locally in your browser.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
  ],
  video: [
    { q: 'Is this video tool free?', a: 'Yes, it is free and runs entirely in your browser.' },
    { q: 'Are my videos uploaded?', a: 'No. Videos are processed locally with ffmpeg.wasm for privacy.' },
    { q: 'What video formats are supported?', a: 'MP4, MOV, WebM, AVI, MKV and more depending on the tool.' },
  ],
  audio: [
    { q: 'Is this audio tool free?', a: 'Yes, all audio tools on Offline ToolHub are free.' },
    { q: 'Are my audio files uploaded?', a: 'No. Audio is processed locally in your browser with Web Audio and ffmpeg.wasm.' },
    { q: 'What audio formats are supported?', a: 'MP3, WAV, M4A, OGG and FLAC, depending on the tool.' },
  ],
  calculators: [
    { q: 'Is this calculator free?', a: 'Yes, every calculator on Offline ToolHub is free.' },
    { q: 'Is my data stored?', a: 'No. Calculations happen instantly in your browser and nothing is saved.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
  converters: [
    { q: 'Is this converter free?', a: 'Yes, it is free and runs in your browser.' },
    { q: 'Are my values uploaded?', a: 'No. Conversions are computed locally on your device.' },
    { q: 'Do I need to install anything?', a: 'No. It works in any modern browser.' },
  ],
  design: [
    { q: 'Is this design tool free?', a: 'Yes, and it runs entirely in your browser.' },
    { q: 'Is my work uploaded?', a: 'No. Everything is generated locally on your device.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
  ],
  text: [
    { q: 'Is this text tool free?', a: 'Yes, it is free and private.' },
    { q: 'Is my text uploaded?', a: 'No. Your text stays on your device and is processed locally.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
  ],
  documents: [
    { q: 'Is this document tool free?', a: 'Yes, all document tools are free to use.' },
    { q: 'Are my documents uploaded?', a: 'No. Documents are processed locally in your browser.' },
    { q: 'What formats are supported?', a: 'Depends on the tool — common office, CSV, JSON and XML formats.' },
  ],
};

const GENERIC_HOWTO = [
  'Open the tool above and add your file or input.',
  'Adjust any options you need.',
  'Get the result and download it — everything stays on your device.',
];

function faqLd(qa: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qa.map((x) => ({
      '@type': 'Question',
      name: x.q,
      acceptedAnswer: { '@type': 'Answer', text: x.a },
    })),
  };
}

export function ToolContent({ tool }: { tool: ToolConfig }) {
  const faqs = tool.faqs && tool.faqs.length > 0 ? tool.faqs : CATEGORY_FAQ[tool.category];
  const howTo = tool.howTo && tool.howTo.length > 0 ? tool.howTo : GENERIC_HOWTO;

  if (faqs.length === 0) return null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd(faqs)) }}
      />
      <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-base font-bold text-slate-900">How to use</h2>
        <ol className="mb-6 space-y-2">
          {howTo.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-600">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/[0.08] text-[11px] font-semibold text-brand">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <h2 className="mb-3 text-base font-bold text-slate-900">Frequently asked questions</h2>
        <div className="divide-y divide-slate-100">
          {faqs.map((f, i) => (
            <details key={i} className="group py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-slate-800">
                {f.q}
                <span className="ml-3 text-slate-400 transition-transform group-open:rotate-180">▾</span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
