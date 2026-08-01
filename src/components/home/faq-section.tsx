import Link from 'next/link';

const FAQS = [
  {
    q: 'Are Offline ToolHub tools really free?',
    a: 'Yes. Every tool on Offline ToolHub is free to use, with no account or signup required.',
  },
  {
    q: 'Is my data uploaded to a server?',
    a: 'No. All processing runs in your browser. Your files, audio, video and text never leave your device.',
  },
  {
    q: 'What kinds of tools are available?',
    a: 'Offline ToolHub covers PDF, image, video and audio editing, unit and finance calculators, developer and SEO utilities, text tools and document converters.',
  },
  {
    q: 'Do I need to install anything?',
    a: 'No. Offline ToolHub works in any modern web browser — just open a tool and start.',
  },
  {
    q: 'Are there any usage limits or watermarks?',
    a: 'No. There are no daily limits, no file-size throttling for typical use, and no watermarks added to your output. Use the tools as often as you like.',
  },
];

export function FaqSection() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((x) => ({
      '@type': 'Question',
      name: x.q,
      acceptedAnswer: { '@type': 'Answer', text: x.a },
    })),
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-slate-900">
        Frequently asked questions
      </h2>
      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white px-6">
        {FAQS.map((f, i) => (
          <details key={i} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-slate-800">
              {f.q}
              <span className="ml-3 text-slate-400 transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.a}</p>
          </details>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-slate-600">
        Looking for something specific?{' '}
        <Link href="/search" className="text-brand underline underline-offset-2">
          Search all tools
        </Link>
        .
      </p>
    </section>
  );
}
