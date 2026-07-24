import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Printer, 
  Zap, 
  Terminal, 
  Layout, 
  Cpu,
  ScanBarcode,
  ArrowRight
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getDictionary } from '@/dictionaries/dictionaries';
import { isValidLocale, type Locale } from '@/lib/i18n';
import { getCategories } from '@/lib/api/categories';
import BrowseHeader from '@/components/browse/BrowseHeader';
import styles from './page.module.scss';

interface PageProps {
  params: Promise<{ lang: string }>;
}

const ICON_MAP: Record<string, LucideIcon> = {
  // Tipos de dispositivos e iconos generales de impresión
  'printer':           Printer,
  'printer-laser':     Printer,
  'printer-ink':       Printer,
  'printer-tank':      Printer,
  
  // Hardware especializado (Térmicas, POS, Plotters)
  'pos-printer':       Terminal,
  'printer-thermal':   Zap,         // O Flame/ScanBarcode dependiendo del estilo visual
  'label-printer':     ScanBarcode,
  'plotter':           Layout,
  'printer-wide':      Layout,

  // Hardware de oficina e industrial
  'copier':            Printer,
  'printer-office':    Printer,
  'printer-industrial': Printer,

  'matrix-printer':    Printer,       // Usa el icono general o uno de lista/filas si prefieres
  'mobile-printer':    Zap,           // Portátiles / térmicas de cinturón
  'scanner':           Layout,        // Para la línea híbrida "fi" de Fujitsu
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const locale = isValidLocale(lang) ? (lang as Locale) : 'es';
  const dict = await getDictionary(locale);
  return {
    title: dict.browse.allCategoriesTitle,
    description: dict.browse.allCategoriesSubtitle,
    alternates: { canonical: `/${locale}/categorias` },
  };
}

export default async function CategoriasPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();
  const locale = lang as Locale;
  const [dict, categories] = await Promise.all([
    getDictionary(locale),
    getCategories(locale),
  ]);
  const d = dict.browse;

  const sorted = categories
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, locale));

  const grouped = sorted.reduce<Record<string, typeof categories>>((acc, cat) => {
    const letter = cat.name.charAt(0).toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(cat);
    return acc;
  }, {});

  const letters = Object.keys(grouped).sort((a, b) => a.localeCompare(b, locale));

  return (
    <main className={styles.page}>
      <div className="container">
        <BrowseHeader
          title={d.allCategoriesTitle}
          subtitle={d.allCategoriesSubtitle}
          breadcrumbs={[{ label: d.allCategoriesTitle }]}
          badge={String(categories.length)}
        />

        <nav className={styles.alphaNav} aria-label={locale === 'es' ? 'Índice alfabético' : 'Alphabetical index'}>
          <div className={styles.alphaTrack}>
            {letters.map((letter) => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className={styles.alphaPill}
                aria-label={`${locale === 'es' ? 'Ir a' : 'Go to'} ${letter}`}
              >
                {letter}
              </a>
            ))}
          </div>
        </nav>

        <div className={styles.groups}>
          {letters.map((letter) => (
            <section
              key={letter}
              id={`letter-${letter}`}
              className={styles.group}
              aria-labelledby={`letter-title-${letter}`}
            >
              <header className={styles.groupHeader}>
                <span className={styles.letterBadge}>{letter}</span>
                <h2 id={`letter-title-${letter}`} className={styles.letterTitle}>
                  {locale === 'es' ? 'Categorías' : 'Categories'}
                </h2>
                <span className={styles.letterCount}>{grouped[letter].length}</span>
              </header>

              <ul className={styles.grid} role="list">
                {grouped[letter].map(({ slug, name, icon }) => {
                  const Icon = ICON_MAP[icon] ?? ICON_MAP[slug] ?? Cpu;
                  return (
                    <li key={slug}>
                      <Link
                        href={`/${locale}/categorias/${slug}`}
                        className={styles.card}
                        aria-label={name}
                      >
                        <span className={styles.iconWrap} aria-hidden="true">
                          <Icon size={20} />
                        </span>
                        <span className={styles.name}>{name}</span>
                        <ArrowRight size={16} className={styles.arrow} aria-hidden="true" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
