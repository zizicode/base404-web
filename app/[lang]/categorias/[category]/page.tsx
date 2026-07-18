import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/dictionaries/dictionaries';
import { isValidLocale, type Locale } from '@/lib/i18n';
import { getCategoryBySlug, getCategoryErrors } from '@/lib/api/categories';
import type { Category } from '@/lib/api/types';
import BrowseHeader from '@/components/browse/BrowseHeader';
import BrowseShell from '@/components/browse/BrowseShell';
import styles from './page.module.scss';

interface PageProps {
  params: Promise<{ lang: string; category: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  if (!isValidLocale(lang)) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.page}>No se pudo cargar esta página.</div>
        </div>
      </main>
    );
  }

  const locale = lang as Locale;
  const [dict, catData] = await Promise.all([
    getDictionary(locale),
    getCategoryBySlug(category, locale).catch(() => null),
  ]);

  const resolvedCategory = (catData ?? { slug: category, name: category, id: 0, deviceType: '', icon: '' }) as Category;
  const initialResults = (await getCategoryErrors(category, locale, 50).catch(() => [])) ?? [];

  const d = dict.browse;
  const categoryNames = Object.fromEntries(
    Object.entries(dict.categories.items).map(([slug, v]) => [slug, (v as { name: string }).name])
  );

  return (
    <main className={styles.page}>
      <div className="container">
        <BrowseHeader
          title={d.categoryTitle.replace('{{name}}', resolvedCategory.name)}
          breadcrumbs={[
            { label: d.backToCategories, href: `/${locale}/categorias` },
            { label: resolvedCategory.name },
          ]}
          badge={d.guidesCount.replace('{{count}}', String(initialResults.length))}
        />
        <Suspense>
          <BrowseShell
            locale={locale}
            dict={d}
            categoryNames={categoryNames}
            initialResults={initialResults}
            lockedCategory={resolvedCategory.name}
          />
        </Suspense>
      </div>
    </main>
  );
}
