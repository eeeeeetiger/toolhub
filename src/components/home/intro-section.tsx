import { Zap, Lock, WifiOff } from 'lucide-react';

const ITEMS = [
  {
    icon: Zap,
    title: 'Free forever',
    body: 'Every tool on ToolHub is completely free to use. No account, no signup, no subscriptions and no hidden limits — open a tool and get the job done in seconds.',
  },
  {
    icon: Lock,
    title: 'Private by design',
    body: 'All processing happens locally in your browser. Your files, audio, video, images and text never leave your device, so nothing is uploaded, stored or shared.',
  },
  {
    icon: WifiOff,
    title: 'Works offline',
    body: 'Because tools run entirely on your device, many of them keep working even without an internet connection. Fast, dependable and available wherever you are.',
  },
];

export function IntroSection() {
  return (
    <section className="border-t border-slate-100 bg-slate-50/60">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-2 text-center text-2xl font-bold tracking-tight text-slate-900">
          Free online tools that respect your privacy
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm leading-relaxed text-slate-500">
          ToolHub brings together PDF, image, video and audio tools, finance and health
          calculators, developer and SEO utilities, text tools and document converters —
          all running instantly in your browser.
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand/[0.08] text-brand">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1.5 text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{item.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
