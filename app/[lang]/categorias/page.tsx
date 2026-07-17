import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Printer, 
  Zap, 
  Terminal, 
  Layout, 
  Cpu,
  ScanBarcode
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

export const ICON_MAP: Record<string, LucideIcon> = {
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
  const dict = await getDictionary(isValidLocale(lang) ? lang as Locale : 'es');
  return { title: dict.browse.allCategoriesTitle };
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

  return (
    <main className={styles.page}>
      <div className="container">
        <BrowseHeader
          title={d.allCategoriesTitle}
          subtitle={d.allCategoriesSubtitle}
          breadcrumbs={[{ label: d.allCategoriesTitle }]}
          badge={String(categories.length)}
        />

        <ul className={styles.grid} role="list">
          {categories.map(({ slug, name, icon }) => {
            const Icon = ICON_MAP[icon] ?? ICON_MAP[slug] ?? Cpu;
            return (
              <li key={slug}>
                <Link
                  href={`/${locale}/categorias/${slug}`}
                  className={styles.card}
                  aria-label={name}
                >
                  <span className={styles.iconWrap} aria-hidden="true">
                    <Icon size={28} />
                  </span>
                  <span className={styles.info}>
                    <span className={styles.name}>{name}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
