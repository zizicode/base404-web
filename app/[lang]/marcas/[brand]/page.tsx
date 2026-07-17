import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/dictionaries/dictionaries';
import { isValidLocale, type Locale } from '@/lib/i18n';
import { getBrandBySlug, getBrands, getBrandErrors } from '@/lib/api/brands';
import BrowseHeader from '@/components/browse/BrowseHeader';
import BrowseShell from '@/components/browse/BrowseShell';
import styles from './page.module.scss';

interface PageProps {
  params: Promise<{ lang: string; brand: string }>;
}

export async function generateStaticParams() {
  const brands = await getBrands();
  return brands.flatMap(({ slug }) => [
    { lang: 'es', brand: slug },
    { lang: 'en', brand: slug },
  ]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, brand } = await params;
  if (!isValidLocale(lang)) return {};
  const [dict, brandData] = await Promise.all([
    getDictionary(lang as Locale),
    getBrandBySlug(brand),
  ]);
  if (!brandData) return {};
  return { title: dict.browse.brandTitle.replace('{{name}}', brandData.name) };
}

export default async function BrandPage({ params }: PageProps) {
  const { lang, brand } = await params;
  if (!isValidLocale(lang)) notFound();

  const locale = lang as Locale;
  const [dict, brandData] = await Promise.all([
    getDictionary(locale),
    getBrandBySlug(brand),
  ]);

  if (!brandData) notFound();

  const initialResults = (await getBrandErrors(brand, locale, 50)) ?? [];

  const d = dict.browse;
  const categoryNames = Object.fromEntries(
    Object.entries(dict.categories.items).map(([slug, v]) => [slug, (v as { name: string }).name])
  );

  return (
    <main className={styles.page}>
      <div className="container">
        <BrowseHeader
          title={d.brandTitle.replace('{{name}}', brandData.name)}
          breadcrumbs={[
            { label: d.backToBrands, href: `/${locale}/marcas` },
            { label: brandData.name },
          ]}
          badge={d.guidesCount.replace('{{count}}', String(initialResults.length))}
        />
        <Suspense>
          <BrowseShell
            locale={locale}
            dict={d}
            categoryNames={categoryNames}
            initialResults={initialResults}
            lockedBrand={brandData.name}
          />
        </Suspense>
      </div>
    </main>
  );
}
