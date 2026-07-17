import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/dictionaries/dictionaries';
import type { ErrorsListItem } from '@/lib/api/types';
import SearchOverlay from '@/components/search-overlay/SearchOverlay';
import styles from './Hero.module.scss';

interface Props {
  locale: Locale;
  dict: Dictionary['hero'];
  popularGuides?: ErrorsListItem[];
}

function pickPopularCodes(guides: ErrorsListItem[] | undefined): string[] {
  if (!guides || guides.length === 0) return [];
  const seen = new Set<string>();
  const codes: string[] = [];
  for (const guide of guides) {
    const code = guide.errorCode?.trim();
    if (code && !seen.has(code)) {
      seen.add(code);
      codes.push(code);
      if (codes.length >= 6) break;
    }
  }
  return codes;
}

export default function Hero({ locale, dict, popularGuides }: Props) {
  const codes = pickPopularCodes(popularGuides);

  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.eyebrow}>
            <span className="badge badge--primary">{dict.eyebrow}</span>
          </div>

          <h1 id="hero-heading" className={styles.heading}>
            {dict.heading}{' '}
            <span className={styles.headingAccent}>{dict.headingAccent}</span>
            {dict.headingEnd}
          </h1>

          <p className={styles.subheading}>{dict.subheading}</p>

          <div className={styles.searchWrap}>
            <SearchOverlay
              locale={locale}
              placeholder={dict.searchPlaceholder}
              searchLabel={dict.searchAriaLabel}
            />
          </div>

          {codes.length > 0 && (
            <div className={styles.chips} role="list" aria-label={dict.popular}>
              <span className={styles.chipsLabel}>{dict.popular}</span>
              <div className={styles.chipsTrack}>
                {codes.map((code) => (
                  <Link
                    key={code}
                    href={`/${locale}/buscar?q=${encodeURIComponent(code)}`}
                    className={styles.chip}
                    role="listitem"
                  >
                    {code}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.visual} aria-hidden="true">
          <div className={styles.phone}>
            <div className={styles.phoneTop}>
              <span className={styles.phoneDot} />
              <span className={styles.phoneBar} />
            </div>
            <div className={styles.phoneScreen}>
              <span className={styles.bubble}>CODE: 1E</span>
              <span className={styles.bubble}>Samsung</span>
              <span className={styles.bubble}>Lavadora</span>
              <div className={styles.phoneResult}>
                <span className={styles.phoneLine} />
                <span className={styles.phoneLineShort} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.bgShape1} aria-hidden="true" />
      <div className={styles.bgShape2} aria-hidden="true" />
    </section>
  );
}
