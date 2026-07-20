import { BookOpen, Building2, ThumbsUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Dictionary } from '@/dictionaries/dictionaries';
import type { SiteStats } from '@/lib/api/stats';
import styles from './TrustStats.module.scss';

interface Props {
  dict: Dictionary['trustStats'];
  apiStats?: SiteStats | null;
}

const ICONS: LucideIcon[] = [BookOpen, Building2, ThumbsUp];

function fmt(n: number): string {
  if (n >= 1_000_000) return `+${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `+${Math.floor(n / 1_000).toLocaleString()}k`;
  return `+${n.toLocaleString()}`;
}

export default function TrustStats({ dict, apiStats }: Props) {
  console.log(apiStats)
  const stats = [
    {
      value: apiStats ? fmt(apiStats.errors) : dict.guides,
      label: dict.guidesLabel,
    },
    {
      value: apiStats ? fmt(apiStats.brands) : dict.brands,
      label: dict.brandsLabel,
    },
    {
      value: apiStats?.votes != null ? fmt(apiStats.votes) : dict.votes,
      label: dict.votesLabel,
    },
  ];

  return (
    <section className={styles.section} aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">{dict.guidesLabel}</h2>
      <div className="container">
        <ul className={styles.grid} role="list">
          {stats.map(({ value, label }, i) => {
            const Icon = ICONS[i];
            return (
              <li key={label} className={styles.item}>
                <span className={styles.iconWrap} aria-hidden="true">
                  <Icon size={24} />
                </span>
                <strong className={styles.value}>{value}</strong>
                <span className={styles.label}>{label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
