import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/dictionaries/dictionaries';
import { isValidLocale, type Locale } from '@/lib/i18n';
import { getCategoryBySlug, getCategories, getCategoryErrors } from '@/lib/api/categories';
import BrowseHeader from '@/components/browse/BrowseHeader';
import BrowseShell from '@/components/browse/BrowseShell';
import styles from './page.module.scss';

interface PageProps {
  params: Promise<{ lang: string; category: string }>;
}

export async function generateStaticParams() {
  const categories = await getCategories('es');
  return categories.flatMap(({ slug }) => [
    { lang: 'es', category: slug },
    { lang: 'en', category: slug },
  ]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, category } = await params;
  if (!isValidLocale(lang)) return {};
  const [dict, catData] = await Promise.all([
    getDictionary(lang as Locale),
    getCategoryBySlug(category, lang),
  ]);
  if (!catData) return {};
  return { title: dict.browse.categoryTitle.replace('{{name}}', catData.name) };
}

export default async function CategoryPage({ params }: PageProps) {
  const { lang, category } = await params;
  if (!isValidLocale(lang)) notFound();

  const locale = lang as Locale;
  const [dict, catData] = await Promise.all([
    getDictionary(locale),
    getCategoryBySlug(category, locale),
  ]);

  if (!catData) notFound();

  const initialResults = (await getCategoryErrors(category, locale, 50)) ?? [];

  const d = dict.browse;
  const categoryNames = Object.fromEntries(
    Object.entries(dict.categories.items).map(([slug, v]) => [slug, (v as { name: string }).name])
  );

  return (
    <main className={styles.page}>
      <div className="container">
        <BrowseHeader
          title={d.categoryTitle.replace('{{name}}', catData.name)}
          breadcrumbs={[
            { label: d.backToCategories, href: `/${locale}/categorias` },
            { label: catData.name },
          ]}
          badge={d.guidesCount.replace('{{count}}', String(initialResults.length))}
        />
        <Suspense>
          <BrowseShell
            locale={locale}
            dict={d}
            categoryNames={categoryNames}
            initialResults={initialResults}
            lockedCategory={catData.name}
          />
        </Suspense>
      </div>
    </main>
  );
}
