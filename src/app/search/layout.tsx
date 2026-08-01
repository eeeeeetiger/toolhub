import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Search Tools',
  description: 'Search the complete Offline ToolHub collection.',
  alternates: { canonical: siteUrl('/search') },
  robots: { index: false, follow: true },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
