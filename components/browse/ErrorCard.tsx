import Link from 'next/link';
import { ArrowRight, Eye } from 'lucide-react';
import type { AnyErrorItem } from '@/lib/api/types';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/dictionaries/dictionaries';
import styles from './ErrorCard.module.scss';

interface Props {
  item: AnyErrorItem;
  locale: Locale;
  dict: Dictionary['browse'];
}

export default function ErrorCard({ item, locale, dict }: Props) {
  const brandName   = 'brandName'   in item ? item.brandName   : null;
  const categoryName = 'categoryName' in item ? item.categoryName : null;
  const views       = 'views'       in item && item.views > 0
    ? item.views.toLocaleString()
    : null;

  return (
    <Link
      href={`/${locale}/error/${item.slug}`}
      className={styles.card}
      aria-label={item.title}
    >
      <div className={styles.top}>
        <span className={styles.code}>{item.errorCode}</span>
        {categoryName && <span className={styles.category}>{categoryName}</span>}
      </div>

      <h3 className={styles.title}>{item.title}</h3>

      <div className={styles.meta}>
        {brandName && <span className={styles.brand}>{brandName}</span>}
        {item.model && <span className={styles.model}>· {item.model}</span>}
      </div>

      <div className={styles.footer}>
        {views && (
          <span className={styles.stat}>
            <Eye size={12} aria-hidden="true" />
            {views}
          </span>
        )}
        <span className={styles.cta}>
          {dict.viewGuide}
          <ArrowRight size={13} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
