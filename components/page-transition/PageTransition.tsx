'use client';

import { Loader2 } from 'lucide-react';
import { usePageTransition } from './PageTransitionProvider';
import styles from './PageTransition.module.scss';

export default function PageTransition() {
  const { isNavigating, loadingLabel } = usePageTransition();

  return (
    <div
      className={`${styles.overlay} ${isNavigating ? styles.visible : ''}`}
      aria-hidden={!isNavigating}
      role="status"
    >
      <div className={styles.spinner}>
        <Loader2 size={22} className={styles.icon} aria-hidden="true" />
        {isNavigating && <span className={styles.label}>{loadingLabel}</span>}
      </div>
    </div>
  );
}
