'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { X, Menu } from 'lucide-react';
import SiteLogo from '@/components/site-logo';
import { useLocaleStore } from '@/store/useLocaleStore';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/dictionaries/dictionaries';
import styles from './SiteNavbar.module.scss';

interface Props {
  locale: Locale;
  dict: Dictionary['nav'];
}

export default function SiteNavbar({ locale, dict }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const setLocale = useLocaleStore((s) => s.setLocale);

  const switchLang = () => {
    const next: Locale = locale === 'es' ? 'en' : 'es';
    setLocale(next);
    const newPath = pathname.replace(/^\/(es|en)/, `/${next}`);
    router.push(newPath);
  };

  const navLinks = [
    { href: `/${locale}/marcas`,    label: dict.brands },
    { href: `/${locale}/categorias`, label: dict.categories },
  ];

  return (
    <header className={styles.header} role="banner">
      <div className={styles.inner}>
        {/* Logo */}
        <SiteLogo href={`/${locale}`} ariaLabel={dict.logoAlt} />

        {/* Right side */}
        <div className={styles.right}>
          {/* Nav links — desktop */}
          <nav className={styles.nav} aria-label="Navegación principal">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className={styles.navLink}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Lang toggle */}
          <button
            type="button"
            className={styles.langBtn}
            onClick={switchLang}
            aria-pressed={locale === 'en'}
            aria-label={locale === 'es' ? dict.switchToEn : dict.switchToEs}
          >
            {locale.toUpperCase()}
          </button>

          {/* Hamburger — mobile */}
          <button
            type="button"
            className={`${styles.iconBtn} ${styles.hamburger}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? dict.closeMenu : dict.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav menu */}
      {menuOpen && (
        <nav id="mobile-menu" className={styles.mobileMenu} aria-label="Menú móvil">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={styles.mobileNavLink}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
