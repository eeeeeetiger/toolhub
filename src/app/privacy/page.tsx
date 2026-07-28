import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How ToolHub handles your data, cookies and advertising.',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-2 text-lg font-bold text-slate-900">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">Privacy Policy</h1>
      <p className="mb-8 text-sm text-slate-400">Last updated: July 21, 2026</p>

      <Section title="Our core promise">
        <p>
          ToolHub is a collection of free, browser-based utilities. The defining feature is privacy:
          <strong> your files and text are processed entirely on your device</strong>. They are never
          uploaded to our servers, and we do not have access to their contents.
        </p>
      </Section>

      <Section title="Information we collect">
        <p>
          Because processing happens in your browser, we do not collect the files, images, audio, video
          or text you process with our tools. We may collect limited, anonymous technical data
          (such as browser type and pages visited) through privacy-friendly analytics to understand
          which tools are useful.
        </p>
      </Section>

      <Section title="Advertising & cookies">
        <p>
          This website is supported by advertising, including Google AdSense. Google and its partners
          may use cookies to serve ads based on your prior visits to this or other websites. This is
          known as personalized advertising.
        </p>
        <p>
          You can opt out of personalized advertising by visiting{' '}
          <a
            href="https://www.google.com/settings/ads"
            className="text-brand hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Ads Settings
          </a>
          , or control cookies through the consent banner shown in your region.
        </p>
        <p>
          For users in the European Economic Area and the UK, advertising and non-essential cookies are
          loaded only after you provide consent via our Consent Management Platform, as required by the
          GDPR and the ePrivacy Directive.
        </p>
      </Section>

      <Section title="Third-party links">
        <p>
          Our pages may link to third-party sites. We are not responsible for the privacy practices of
          those sites.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about this policy? Email us at{' '}
          <a href="mailto:etiger2005@gmail.com" className="text-brand hover:underline">
            etiger2005@gmail.com
          </a>
          .
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
