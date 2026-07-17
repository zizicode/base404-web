import Link from 'next/link';
import {
  WashingMachine, Refrigerator, Wind, Utensils, Flame, AirVent, Cpu,
  Tv2, Microwave, Bath, Fan, Zap, Thermometer, Coffee, ShowerHead,
  Waves, Snowflake, Volume2, Camera, Printer, Monitor,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/dictionaries/dictionaries';
import type { Category } from '@/lib/api/types';
import styles from './CategoriesGrid.module.scss';

interface Props {
  locale: Locale;
  dict: Dictionary['categories'];
  categories: Category[];
}

const ICON_MAP: Record<string, LucideIcon> = {
  washing:               WashingMachine,
  refrigerator:          Refrigerator,
  dryer:                 Wind,
  dishwasher:            Utensils,
  oven:                  Flame,
  air:                   AirVent,
  lavadora:              WashingMachine,
  refrigerador:          Refrigerator,
  secadora:              Wind,
  lavavajillas:          Utensils,
  horno:                 Flame,
  'aire-acondicionado':  AirVent,
  tv:                    Tv2,
  television:            Tv2,
  microwave:             Microwave,
  microondas:            Microwave,
  bath:                  Bath,
  fan:                   Fan,
  ventilador:            Fan,
  electric:              Zap,
  heater:                Thermometer,
  calefactor:            Thermometer,
  coffee:                Coffee,
  cafetera:              Coffee,
  shower:                ShowerHead,
  washer:                Waves,
  freezer:               Snowflake,
  congelador:            Snowflake,
  audio:                 Volume2,
  camera:                Camera,
  printer:               Printer,
  impresora:             Printer,
  monitor:               Monitor,
  consola:               Monitor,
};

function getIcon(iconField: string, slug: string): LucideIcon {
  return ICON_MAP[iconField] ?? ICON_MAP[slug] ?? Cpu;
}

// Pad to at least 30 items by cycling, then triple for seamless loop
function buildTrack(cats: Category[]): Category[] {
  if (cats.length === 0) return [];
  const min = 30;
  const padded: Category[] = [];
  while (padded.length < min) padded.push(...cats);
  // Triple the padded set so CSS animation loops seamlessly
  return [...padded, ...padded, ...padded];
}

export default function CategoriesGrid({ locale, dict, categories }: Props) {
  const track = buildTrack(categories);

  return (
    <section className={styles.section} aria-labelledby="categories-heading">
      <header className={`container ${styles.header}`}>
        <h2 id="categories-heading" className={styles.title}>{dict.title}</h2>
        <p className={styles.subtitle}>{dict.subtitle}</p>
      </header>

      <div className={styles.sliderOuter} aria-label={dict.title}>
        {/* fade edges */}
        <div className={styles.fadeLeft}  aria-hidden="true" />
        <div className={styles.fadeRight} aria-hidden="true" />

        <div className={styles.track}>
          {track.map(({ slug, name, icon }, i) => {
            const Icon = getIcon(icon, slug);
            return (
              <Link
                key={`${slug}-${i}`}
                href={`/${locale}/categorias/${slug}`}
                className={styles.card}
                aria-label={`${dict.ariaLabel} ${name}`}
                tabIndex={i >= categories.length ? -1 : 0}
              >
                <span className={styles.iconWrap} aria-hidden="true">
                  <Icon size={24} />
                </span>
                <span className={styles.catName}>{name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
