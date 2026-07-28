import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About ToolHub',
  description: 'A free, private, browser-based toolbox for everyday tasks.',
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">About ToolHub</h1>
      <p className="mb-8 text-sm text-slate-400">Free online tools that run on your device</p>

      <div className="space-y-4 text-sm leading-relaxed text-slate-600">
        <p>
          ToolHub is a growing collection of free online utilities that run entirely in your browser. Your
          files stay on your device — private, secure and always free. Convert and compress images, edit
          PDFs, trim audio and video, run calculators, and more — all in one place.
        </p>
        <p>
          Our guiding principle is <strong>privacy by design</strong>. Every tool runs entirely in your
          browser using WebAssembly and modern web APIs, so your files never leave your device. There is
          no account to create and nothing to install.
        </p>
        <p>
          The site is funded by advertising, which lets us keep every tool free to use. See our{' '}
          <Link href="/privacy" className="text-brand hover:underline">
            Privacy Policy
          </Link>{' '}
          for details on cookies and advertising.
        </p>
        <p>
          Have a suggestion for a tool we should add? Email{' '}
          <a href="mailto:etiger2005@gmail.com" className="text-brand hover:underline">
            etiger2005@gmail.com
          </a>
          .
        </p>
      </div>

      <p className="mt-10 text-sm">
        <Link href="/" className="text-brand hover:underline">
          ← Back to all tools
        </Link>
      </p>
    </main>
  );
}
