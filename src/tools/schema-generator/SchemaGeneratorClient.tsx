'use client';

import { useMemo, useState } from 'react';
import { copyToClipboard } from '@/lib/utils';
import { useI18n } from '@/i18n';

type SchemaType = 'Article' | 'FAQPage' | 'Product' | 'Organization' | 'BreadcrumbList' | 'LocalBusiness';

const SCHEMA_TYPES: { value: SchemaType; label: string }[] = [
  { value: 'Article', label: 'Article' },
  { value: 'FAQPage', label: 'FAQ Page' },
  { value: 'Product', label: 'Product' },
  { value: 'Organization', label: 'Organization' },
  { value: 'BreadcrumbList', label: 'Breadcrumb' },
  { value: 'LocalBusiness', label: 'Local Business' },
];

type Fields = Record<string, string>;
type FaqItem = { q: string; a: string };
type Crumb = { name: string; url: string };

function build(type: SchemaType, f: Fields, faqs: FaqItem[], crumbs: Crumb[]): object {
  const base = { '@context': 'https://schema.org' };
  switch (type) {
    case 'Article':
      return {
        ...base,
        '@type': 'Article',
        headline: f.headline || '',
        author: { '@type': 'Person', name: f.author || '' },
        datePublished: f.datePublished || '',
        image: f.image ? [f.image] : undefined,
        publisher: f.publisher ? { '@type': 'Organization', name: f.publisher } : undefined,
        description: f.description || undefined,
      };
    case 'FAQPage':
      return {
        ...base,
        '@type': 'FAQPage',
        mainEntity: faqs
          .filter((x) => x.q.trim())
          .map((x) => ({
            '@type': 'Question',
            name: x.q,
            acceptedAnswer: { '@type': 'Answer', text: x.a },
          })),
      };
    case 'Product':
      return {
        ...base,
        '@type': 'Product',
        name: f.name || '',
        image: f.image ? [f.image] : undefined,
        description: f.description || undefined,
        brand: f.brand ? { '@type': 'Brand', name: f.brand } : undefined,
        offers: f.price
          ? {
              '@type': 'Offer',
              price: f.price,
              priceCurrency: f.currency || 'USD',
              availability: `https://schema.org/${f.availability || 'InStock'}`,
            }
          : undefined,
      };
    case 'Organization':
      return {
        ...base,
        '@type': 'Organization',
        name: f.name || '',
        url: f.url || undefined,
        logo: f.logo || undefined,
        sameAs: f.sameAs ? f.sameAs.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
      };
    case 'BreadcrumbList':
      return {
        ...base,
        '@type': 'BreadcrumbList',
        itemListElement: crumbs
          .filter((c) => c.name.trim())
          .map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.name,
            item: c.url || undefined,
          })),
      };
    case 'LocalBusiness':
      return {
        ...base,
        '@type': 'LocalBusiness',
        name: f.name || '',
        image: f.image || undefined,
        telephone: f.telephone || undefined,
        priceRange: f.priceRange || undefined,
        address: {
          '@type': 'PostalAddress',
          streetAddress: f.street || '',
          addressLocality: f.city || '',
          addressRegion: f.region || '',
          postalCode: f.postalCode || '',
          addressCountry: f.country || '',
        },
      };
  }
}

/** Remove undefined / empty values recursively for clean output. */
function clean(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(clean).filter((v) => v !== undefined);
  if (obj && typeof obj === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const cv = clean(v);
      if (cv !== undefined && cv !== '' && !(Array.isArray(cv) && cv.length === 0)) out[k] = cv;
    }
    return out;
  }
  return obj;
}

export default function SchemaGeneratorClient() {
  const { t } = useI18n();
  const [type, setType] = useState<SchemaType>('Article');
  const [fields, setFields] = useState<Fields>({});
  const [faqs, setFaqs] = useState<FaqItem[]>([{ q: '', a: '' }]);
  const [crumbs, setCrumbs] = useState<Crumb[]>([{ name: '', url: '' }]);
  const [copied, setCopied] = useState(false);

  const set = (k: string, v: string) => setFields((p) => ({ ...p, [k]: v }));

  const jsonLd = useMemo(() => {
    const obj = clean(build(type, fields, faqs, crumbs));
    return `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`;
  }, [type, fields, faqs, crumbs]);

  const copy = async () => {
    const ok = await copyToClipboard(jsonLd);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 1500); }
  };

  const field = 'w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand';
  const Input = ({ k, ph }: { k: string; ph: string }) => (
    <input value={fields[k] || ''} onChange={(e) => set(k, e.target.value)} placeholder={ph} className={field} />
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Left: form */}
      <div className="space-y-3">
        <select value={type} onChange={(e) => setType(e.target.value as SchemaType)} className={field}>
          {SCHEMA_TYPES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {type === 'Article' && (
          <>
            <Input k="headline" ph={t('tools.schema-generator.ui.headline', 'Headline / title')} />
            <Input k="author" ph={t('tools.schema-generator.ui.author', 'Author name')} />
            <Input k="publisher" ph={t('tools.schema-generator.ui.publisher', 'Publisher / site name')} />
            <input type="date" value={fields.datePublished || ''} onChange={(e) => set('datePublished', e.target.value)} className={field} />
            <Input k="image" ph={t('tools.schema-generator.ui.imageUrl', 'Image URL')} />
            <textarea value={fields.description || ''} onChange={(e) => set('description', e.target.value)} placeholder={t('tools.schema-generator.ui.description', 'Short description')} className={`${field} h-20 resize-y`} />
          </>
        )}

        {type === 'FAQPage' && (
          <div className="space-y-3">
            {faqs.map((item, i) => (
              <div key={i} className="space-y-2 rounded-lg border border-slate-200 p-3">
                <input value={item.q} onChange={(e) => setFaqs((p) => p.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))} placeholder={t('tools.schema-generator.ui.question', 'Question')} className={field} />
                <textarea value={item.a} onChange={(e) => setFaqs((p) => p.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))} placeholder={t('tools.schema-generator.ui.answer', 'Answer')} className={`${field} h-16 resize-y`} />
                {faqs.length > 1 && (
                  <button onClick={() => setFaqs((p) => p.filter((_, j) => j !== i))} className="text-xs text-red-500 hover:underline">
                    {t('common.remove', 'Remove')}
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => setFaqs((p) => [...p, { q: '', a: '' }])} className="text-sm font-medium text-brand hover:underline">
              + {t('tools.schema-generator.ui.addQuestion', 'Add question')}
            </button>
          </div>
        )}

        {type === 'Product' && (
          <>
            <Input k="name" ph={t('tools.schema-generator.ui.productName', 'Product name')} />
            <Input k="brand" ph={t('tools.schema-generator.ui.brand', 'Brand')} />
            <Input k="image" ph={t('tools.schema-generator.ui.imageUrl', 'Image URL')} />
            <div className="flex gap-2">
              <Input k="price" ph={t('tools.schema-generator.ui.price', 'Price')} />
              <Input k="currency" ph="USD" />
            </div>
            <select value={fields.availability || 'InStock'} onChange={(e) => set('availability', e.target.value)} className={field}>
              <option value="InStock">In Stock</option>
              <option value="OutOfStock">Out of Stock</option>
              <option value="PreOrder">Pre-Order</option>
            </select>
            <textarea value={fields.description || ''} onChange={(e) => set('description', e.target.value)} placeholder={t('tools.schema-generator.ui.description', 'Short description')} className={`${field} h-20 resize-y`} />
          </>
        )}

        {type === 'Organization' && (
          <>
            <Input k="name" ph={t('tools.schema-generator.ui.orgName', 'Organization name')} />
            <Input k="url" ph={t('tools.schema-generator.ui.website', 'Website URL')} />
            <Input k="logo" ph={t('tools.schema-generator.ui.logoUrl', 'Logo URL')} />
            <Input k="sameAs" ph={t('tools.schema-generator.ui.socialProfiles', 'Social profile URLs (comma-separated)')} />
          </>
        )}

        {type === 'BreadcrumbList' && (
          <div className="space-y-3">
            {crumbs.map((c, i) => (
              <div key={i} className="space-y-2 rounded-lg border border-slate-200 p-3">
                <input value={c.name} onChange={(e) => setCrumbs((p) => p.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} placeholder={t('tools.schema-generator.ui.crumbName', 'Page name')} className={field} />
                <input value={c.url} onChange={(e) => setCrumbs((p) => p.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))} placeholder="https://example.com/page" className={field} />
                {crumbs.length > 1 && (
                  <button onClick={() => setCrumbs((p) => p.filter((_, j) => j !== i))} className="text-xs text-red-500 hover:underline">
                    {t('common.remove', 'Remove')}
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => setCrumbs((p) => [...p, { name: '', url: '' }])} className="text-sm font-medium text-brand hover:underline">
              + {t('tools.schema-generator.ui.addCrumb', 'Add breadcrumb')}
            </button>
          </div>
        )}

        {type === 'LocalBusiness' && (
          <>
            <Input k="name" ph={t('tools.schema-generator.ui.bizName', 'Business name')} />
            <Input k="telephone" ph={t('tools.schema-generator.ui.phone', 'Phone')} />
            <div className="flex gap-2">
              <Input k="priceRange" ph="$$" />
              <Input k="image" ph={t('tools.schema-generator.ui.imageUrl', 'Image URL')} />
            </div>
            <Input k="street" ph={t('tools.schema-generator.ui.street', 'Street address')} />
            <div className="flex gap-2">
              <Input k="city" ph={t('tools.schema-generator.ui.city', 'City')} />
              <Input k="region" ph={t('tools.schema-generator.ui.region', 'Region / state')} />
            </div>
            <div className="flex gap-2">
              <Input k="postalCode" ph={t('tools.schema-generator.ui.postalCode', 'Postal code')} />
              <Input k="country" ph={t('tools.schema-generator.ui.country', 'Country')} />
            </div>
          </>
        )}
      </div>

      {/* Right: output */}
      <div className="space-y-3">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between bg-slate-50 px-3 py-2">
            <span className="text-xs font-medium text-slate-500">JSON-LD</span>
            <button onClick={copy} className="rounded bg-brand px-3 py-1 text-xs font-medium text-white hover:bg-brand-dark">
              {copied ? t('common.copied', 'Copied!') : t('common.copy', 'Copy')}
            </button>
          </div>
          <pre className="max-h-[28rem] overflow-auto p-3 text-xs leading-relaxed text-slate-700">{jsonLd}</pre>
        </div>
        <p className="text-xs text-slate-400">
          {t('tools.schema-generator.ui.note', 'Paste this snippet into your page <head>. Validate with Google Rich Results Test before publishing.')}
        </p>
      </div>
    </div>
  );
}
