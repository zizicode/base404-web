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
  const title = lang === 'es' ? 'Buscar errores' : 'Search errors';

  return {
    title,
    description:
      lang === 'es'
        ? 'Buscá códigos de error de impresoras por marca, modelo o palabra clave.'
        : 'Search printer error codes by brand, model or keyword.',
    alternates: { canonical: `/${lang}/buscar` },
    ...(hasFilters && { robots: { index: false, follow: true } }),
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
          limit: 50,
        })
      : getErrors({
          sort: (sp.sort === 'popular' ? 'popular' : 'recent'),
          locale,
          limit: 50,
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
