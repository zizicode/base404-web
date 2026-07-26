import Link from 'next/link';
import { Search, Wrench, BookOpen } from 'lucide-react';
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
          {/* Eyebrow con badge */}
          <div className={styles.eyebrow}>
            <span className={styles.badge}>
              <BookOpen size={16} />
              {dict.eyebrow}
            </span>
          </div>

          {/* Heading principal optimizado para SEO */}
          <h1 id="hero-heading" className={styles.heading}>
            {dict.heading}
            <span className={styles.headingAccent}>{dict.headingAccent}</span>
            <span className={styles.headingEnd}>{dict.headingEnd}</span>
          </h1>

          {/* Subheading con palabras clave */}
          <p className={styles.subheading}>{dict.subheading}</p>

          {/* Buscador principal */}
          <div className={styles.searchWrap}>
            <div className={styles.searchBox}>
              <Search size={20} className={styles.searchIcon} />
              <SearchOverlay
                locale={locale}
                placeholder={dict.searchPlaceholder}
                searchLabel={dict.searchAriaLabel}
              />
            </div>
          </div>

          {/* Códigos populares mejorados */}
          {codes.length > 0 && (
            <div className={styles.chips} role="list" aria-label={dict.popular}>
              <span className={styles.chipsLabel}>
                <Wrench size={14} />
                {dict.popular}
              </span>
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

          {/* Trust indicators */}
          <div className={styles.trustIndicators}>
            <div className={styles.trustItem}>
              <span className={styles.trustNumber}>1</span>
              <span>{dict.trust1}</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustNumber}>2</span>
              <span>{dict.trust2}</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustNumber}>3</span>
              <span>{dict.trust3}</span>
            </div>
          </div>
        </div>

        {/* Visual removido - diseño más limpio */}
      </div>

      {/* Elementos decorativos de fondo */}
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.bgShape1} aria-hidden="true" />
      <div className={styles.bgShape2} aria-hidden="true" />
    </section>
  );
}
