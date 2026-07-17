import Link from 'next/link';
import { Search, ArrowRight } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/dictionaries/dictionaries';
import styles from './FinalCta.module.scss';

interface Props { locale: Locale; dict: Dictionary['finalCta']; }

export default function FinalCta({ locale, dict }: Props) {
  return (
    <section className={styles.section} aria-labelledby="cta-heading">
      <div className="container">
        <div className={styles.card}>
          <div className={styles.iconWrap} aria-hidden="true">
            <Search size={28} />
          </div>

          <h2 id="cta-heading" className={styles.title}>{dict.title}</h2>
          <p className={styles.body}>{dict.body}</p>

          <div className={styles.actions}>
            <Link href={`/${locale}/buscar`} className="btn btn--primary">
              <Search size={16} aria-hidden="true" />
              {dict.searchBtn}
            </Link>
            <Link href={`/${locale}/como-funciona`} className="btn btn--outline">
              {dict.howBtn}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
