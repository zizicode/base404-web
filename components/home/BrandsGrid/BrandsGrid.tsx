import Link from 'next/link';
import Image from 'next/image';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/dictionaries/dictionaries';
import type { Brand } from '@/lib/api/types';
import styles from './BrandsGrid.module.scss';

interface Props {
  locale: Locale;
  dict: Dictionary['brands'];
  brands: Brand[];
}

export default function BrandsGrid({ locale, dict, brands }: Props) {
  return (
    <section className={styles.section} aria-labelledby="brands-heading">
      <div className="container">
        <header className={styles.header}>
          <h2 id="brands-heading" className={styles.title}>{dict.title}</h2>
          <p className={styles.subtitle}>{dict.subtitle}</p>
        </header>

        <ul className={styles.grid} role="list">
          {brands.map(({ slug, name, logo_url }) => (
            <li key={slug}>
              <Link
                href={`/${locale}/marcas/${slug}`}
                className={styles.badge}
                aria-label={`${dict.ariaLabel} ${name}`}
              >
                {logo_url ? (
                  <Image
                    src={logo_url}
                    alt={name}
                    width={44}
                    height={44}
                    className={styles.logo}
                    unoptimized
                  />
                ) : (
                  <span className={styles.fallback} aria-hidden="true">
                    {name.charAt(0)}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.viewAll}>
          <Link href={`/${locale}/marcas`} className="btn btn--outline">
            {dict.viewAll}
          </Link>
        </div>
      </div>
    </section>
  );
}
