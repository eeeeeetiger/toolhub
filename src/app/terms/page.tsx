import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `The terms that govern your use of ${SITE_NAME} free online tools.`,
  alternates: { canonical: siteUrl('/terms') },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-2 text-lg font-bold text-slate-900">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">Terms of Service</h1>
      <p className="mb-8 text-sm text-slate-400">Last updated: July 21, 2026</p>

      <Section title="Acceptance of terms">
        <p>
          By accessing or using {SITE_NAME} (the “Service”), you agree to these Terms of Service. If you do
          not agree, please do not use the Service.
        </p>
      </Section>

      <Section title="Use of the tools">
        <p>
          {SITE_NAME} provides free online utilities for personal and commercial use. All processing happens
          in your browser. You are responsible for the content you process and for ensuring you have the
          right to use any files you upload.
        </p>
      </Section>

      <Section title="No warranty">
        <p>
          The tools are provided “as is” without warranty of any kind. While we strive for accuracy, we
          do not guarantee that outputs will be error-free or suitable for any particular purpose. Do not
          rely on the tools for life-safety, legal, medical, or financial decisions without independent
          verification.
        </p>
      </Section>

      <Section title="Advertising">
        <p>
          The Service may be supported by third-party advertising, including Google AdSense. Advertisers
          are responsible for their own content, and their terms apply to any interaction with them.
        </p>
      </Section>

      <Section title="Limitation of liability">
        <p>
          To the maximum extent permitted by law, {SITE_NAME} and its operators shall not be liable for any
          indirect, incidental, or consequential damages arising from your use of the Service.
        </p>
      </Section>

      <Section title="Changes">
        <p>
          We may update these terms from time to time. Continued use after changes constitutes acceptance
          of the updated terms.
        </p>
      </Section>

      <p className="mt-10 text-sm">
        <Link href="/" className="text-brand hover:underline">
          ← Back to all tools
        </Link>
      </p>
    </main>
  );
}
