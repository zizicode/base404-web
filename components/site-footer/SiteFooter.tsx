import Link from 'next/link';
import { Globe, Share2, Mail } from 'lucide-react';
import SiteLogo from '@/components/site-logo';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/dictionaries/dictionaries';
import styles from './SiteFooter.module.scss';

const BRANDS = [
  'HP',
  'Epson',
  'Canon',
  'Brother',
  'Zebra',
  'Fujitsu'
];

interface Props {
  locale: Locale;
  dict: Dictionary['footer'];
}

export default function SiteFooter({ locale, dict }: Props) {
  const p = `/${locale}`;

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.inner}>
        {/* Brand column */}
        <div className={styles.brand}>
          <SiteLogo href={p} ariaLabel={dict.logoAlt} />
          <p className={styles.tagline}>{dict.tagline}</p>
          <div className={styles.socials} aria-label="Redes sociales">
            <a href="https://twitter.com" className={styles.socialLink} target="_blank" rel="noopener noreferrer" aria-label={dict.socialRedes}>
              <Share2 size={18} />
            </a>
            <a href="https://youtube.com" className={styles.socialLink} target="_blank" rel="noopener noreferrer" aria-label={dict.socialYoutube}>
              <Globe size={18} />
            </a>
            <a href={`${p}/contacto`} className={styles.socialLink} aria-label={dict.socialContact}>
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Brands */}
        <nav className={styles.col} aria-label={dict.popularBrands}>
          <h3 className={styles.colTitle}>{dict.popularBrands}</h3>
          <ul className={styles.colList}>
            {BRANDS.map((brand) => (
              <li key={brand}>
                <Link href={`${p}/marcas/${brand.toLowerCase()}`} className={styles.colLink}>
                  {brand}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Categories */}
        <nav className={styles.col} aria-label={dict.categories}>
          <h3 className={styles.colTitle}>{dict.categories}</h3>
          <ul className={styles.colList}>
            {dict.categories_list.map((cat: string, i: number) => (
              <li key={i}>
                <Link
                  href={`${p}/categorias/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  className={styles.colLink}
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Resources + Legal */}
        <nav className={styles.col} aria-label={dict.resources}>
          <h3 className={styles.colTitle}>{dict.resources}</h3>
          <ul className={styles.colList}>
            <li><Link href={`${p}/blog`} className={styles.colLink}>{dict.resources_links.blog}</Link></li>
            <li><Link href={`${p}/como-funciona`} className={styles.colLink}>{dict.resources_links.howItWorks}</Link></li>
            <li><Link href={`${p}/contacto`} className={styles.colLink}>{dict.resources_links.contact}</Link></li>
          </ul>

          <h3 className={`${styles.colTitle} ${styles.colTitleSpaced}`}>{dict.legal}</h3>
          <ul className={styles.colList}>
            <li><Link href={`${p}/privacidad`} className={styles.colLink}>{dict.legal_links.privacy}</Link></li>
            <li><Link href={`${p}/terminos`} className={styles.colLink}>{dict.legal_links.terms}</Link></li>
          </ul>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Vimazdev. {dict.copyright}
        </p>
        <div className={styles.bottomRight}>
          <span className={styles.langSelector} aria-label={dict.lang}>
            <Link href="/es" className={styles.langOpt} hrefLang="es">ES</Link>
            <span className={styles.langSep} aria-hidden="true">/</span>
            <Link href="/en" className={styles.langOpt} hrefLang="en">EN</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
