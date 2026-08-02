import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getDictionary } from '@/dictionaries/dictionaries';
import { isValidLocale, type Locale } from '@/lib/i18n';
import { getAlternates } from '@/lib/seo';
import { getBrands } from '@/lib/api/brands';
import BrowseHeader from '@/components/browse/BrowseHeader';
import styles from './page.module.scss';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const locale = isValidLocale(lang) ? (lang as Locale) : 'es';
  const dict = await getDictionary(locale);
  return {
    title: dict.browse.allBrandsTitle,
    description: dict.browse.allBrandsSubtitle,
    alternates: getAlternates(`/${locale}/marcas`, locale),
  };
}

export default async function MarcasPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();
  const locale = lang as Locale;
  const [dict, brands] = await Promise.all([
    getDictionary(locale),
    getBrands(),
  ]);
  const d = dict.browse;

  return (
    <main className={styles.page}>
      <div className="container">
        <BrowseHeader
          title={d.allBrandsTitle}
          subtitle={d.allBrandsSubtitle}
          breadcrumbs={[{ label: d.allBrandsTitle }]}
          badge={String(brands.length)}
        />

        <ul className={styles.grid} role="list">
          {brands.map(({ slug, name, logo_url }) => (
            <li key={slug}>
              <Link
                href={`/${locale}/marcas/${slug}`}
                className={styles.card}
                aria-label={name}
              >
                {logo_url ? (
                  <span className={styles.logoWrap} aria-hidden="true">
                    <Image src={logo_url} alt={name} width={44} height={44} unoptimized className={styles.logo} />
                  </span>
                ) : (
                  <span className={styles.initial} aria-hidden="true">{name.charAt(0)}</span>
                )}
                <span className={styles.info}>
                  <span className={styles.name}>{name}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
