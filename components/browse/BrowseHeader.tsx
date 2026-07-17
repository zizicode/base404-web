import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import styles from './BrowseHeader.module.scss';

interface Crumb { label: string; href?: string; }

interface Props {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  badge?: string;
}

export default function BrowseHeader({ title, subtitle, breadcrumbs, badge }: Props) {
  return (
    <div className={styles.header}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className={styles.crumbItem}>
              {crumb.href ? (
                <Link href={crumb.href} className={styles.crumbLink}>{crumb.label}</Link>
              ) : (
                <span className={styles.crumbCurrent} aria-current="page">{crumb.label}</span>
              )}
              {i < breadcrumbs.length - 1 && (
                <ChevronRight size={13} className={styles.crumbSep} aria-hidden="true" />
              )}
            </span>
          ))}
        </nav>
      )}

      <div className={styles.titleRow}>
        <h1 className={styles.title}>{title}</h1>
        {badge && <span className={styles.badge}>{badge}</span>}
      </div>

      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
