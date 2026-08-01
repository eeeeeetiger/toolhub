export const SITE_NAME = 'Offline ToolHub';

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://offlinetoolhub.com'
).replace(/\/+$/, '');

export function siteUrl(path = ''): string {
  if (!path) return SITE_URL;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_ID?.trim() ?? '';
