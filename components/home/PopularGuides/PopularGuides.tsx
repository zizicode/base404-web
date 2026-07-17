import Link from 'next/link';
import { ChevronRight, Eye } from 'lucide-react';
import type { ErrorsListItem } from '@/lib/api/types';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/dictionaries/dictionaries';
import styles from './PopularGuides.module.scss';

interface Props {
  guides: ErrorsListItem[];
  locale: Locale;
  dict: Dictionary['popularGuides'];
}

export default function PopularGuides({ guides, locale, dict }: Props) {
  const items = [...guides]
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, 6);

  if (items.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="popular-heading">
      <div className="container">
        <header className={styles.header}>
          <div>
            <h2 id="popular-heading" className={styles.title}>{dict.title}</h2>
            <p className={styles.subtitle}>{dict.subtitle}</p>
          </div>
          <Link href={`/${locale}/buscar`} className={`btn btn--outline ${styles.viewAllBtn}`}>
            {dict.viewAll}
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </header>

        <ul className={styles.grid} role="list">
          {items.map((guide) => (
            <li key={guide.slug}>
              <Link href={`/${locale}/error/${guide.slug}`} className={`card ${styles.card}`}>
                <div className={styles.cardTop}>
                  <span className="badge badge--primary">{guide.errorCode}</span>
                  {guide.views > 0 && (
                    <span className={styles.views}>
                      <Eye size={11} aria-hidden="true" />
                      {guide.views.toLocaleString()}
                    </span>
                  )}
                </div>
                <h3 className={`clamp-2 ${styles.cardTitle}`}>{guide.title}</h3>
                {guide.model && (
                  <div className={styles.cardMeta}>
                    <span className={styles.model}>{guide.model}</span>
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
