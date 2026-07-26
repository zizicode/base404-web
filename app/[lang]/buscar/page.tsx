import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/dictionaries/dictionaries';
import { isValidLocale, type Locale } from '@/lib/i18n';
import { searchErrors } from '@/lib/api/errors';
import { getErrors } from '@/lib/api/errorsList';
import type { AnyErrorItem } from '@/lib/api/types';
import BrowseHeader from '@/components/browse/BrowseHeader';
import BrowseShell from '@/components/browse/BrowseShell';
import styles from './page.module.scss';

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string; brand?: string; category?: string; sort?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const sp = await searchParams;
  const hasFilters = sp.q || sp.brand || sp.category;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const d = dict.browse;

  const title = lang === 'es' ? 'Buscar errores de impresoras | Vimazdev' : 'Search printer errors | Vimazdev';
  const description = lang === 'es'
    ? 'Buscá códigos de error de impresoras HP, Epson, Brother, Canon y más. Encontrá soluciones paso a paso para tu impresora o escáner.'
    : 'Search printer error codes for HP, Epson, Brother, Canon and more. Find step-by-step solutions for your printer or scanner.';

  return {
    title,
    description,
    alternates: { canonical: `/${locale}/buscar` },
    robots: hasFilters ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type: 'website',
      url: `/${locale}/buscar`,
      siteName: 'Vimazdev',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      alternateLocale: [locale === 'es' ? 'en_US' : 'es_ES'],
      title,
      description,
      images: [
        {
          url: '/og.png',
          width: 1200,
          height: 630,
          alt: 'Vimazdev — Búsqueda de errores de impresoras',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og.png'],
    },
  };
}

export default async function BuscarPage({ params, searchParams }: PageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const locale = lang as Locale;
  const sp = await searchParams;
  const hasFilters = sp.q || sp.brand || sp.category;

  const [dict, initialResults] = await Promise.all([
    getDictionary(locale),
    hasFilters
      ? searchErrors({
          q:        sp.q        || undefined,
          brand:    sp.brand    || undefined,
          category: sp.category || undefined,
          locale,
          limit: 200,
        })
      : getErrors({
          sort: (sp.sort === 'popular' ? 'popular' : 'recent'),
          locale,
          limit: 200,
        }).then((r) => r.items as AnyErrorItem[]),
  ]);

  const d = dict.browse;
  const categoryNames = Object.fromEntries(
    Object.entries(dict.categories.items).map(([slug, v]) => [slug, v.name])
  );

  return (
    <main className={styles.page}>
      <div className="container">
        <BrowseHeader
          title={d.searchTitle}
          subtitle={d.searchSubtitle}
          breadcrumbs={[{ label: d.searchTitle }]}
        />
        <Suspense>
          <BrowseShell
            locale={locale}
            dict={d}
            categoryNames={categoryNames}
            initialResults={initialResults}
          />
        </Suspense>
      </div>
    </main>
  );
}
