import Link from 'next/link';
import { ChevronRight, Eye, ThumbsUp, Printer } from 'lucide-react';
import type { ErrorsListItem } from '@/lib/api/types';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/dictionaries/dictionaries';
import styles from './PopularGuides.module.scss';

interface Props {
  guides: ErrorsListItem[];
  locale: Locale;
  dict: Dictionary['popularGuides'];
}

function getVoteCount(guide: ErrorsListItem): number {
  if (typeof guide.votes === 'number') return guide.votes;
  return (guide.helpfulVotes ?? 0) + (guide.unhelpfulVotes ?? 0);
}

function getPopularityScore(guide: ErrorsListItem): number {
  return (guide.views ?? 0) + getVoteCount(guide);
}

export default function PopularGuides({ guides, locale, dict }: Props) {
  const items = [...guides]
    .sort((a, b) => getPopularityScore(b) - getPopularityScore(a))
    .slice(0, 10);

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
                  <span className={styles.stats}>
                    {guide.views > 0 && (
                      <span className={styles.stat} title={`${guide.views.toLocaleString()} ${dict.views}`}>
                        <Eye size={11} aria-hidden="true" />
                        <span className={styles.statValue}>{guide.views.toLocaleString()}</span>
                        <span className={styles.statLabel}>{dict.views}</span>
                      </span>
                    )}
                    {getVoteCount(guide) > 0 && (
                      <span className={styles.stat} title={`${getVoteCount(guide).toLocaleString()} ${dict.useful}`}>
                        <ThumbsUp size={11} aria-hidden="true" />
                        <span className={styles.statValue}>{getVoteCount(guide).toLocaleString()}</span>
                        <span className={styles.statLabel}>{dict.useful}</span>
                      </span>
                    )}
                  </span>
                </div>
                <h3 className={`clamp-2 ${styles.cardTitle}`}>{guide.title}</h3>
                {guide.model && (
                  <div className={styles.cardMeta}>
                    <Printer size={10} aria-hidden="true" />
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
