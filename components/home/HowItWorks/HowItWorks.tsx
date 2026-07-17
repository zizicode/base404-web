import { Search, BookOpen, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Dictionary } from '@/dictionaries/dictionaries';
import styles from './HowItWorks.module.scss';

interface Props { dict: Dictionary['howItWorks']; }

const STEP_ICONS: LucideIcon[] = [Search, BookOpen, Wrench];

export default function HowItWorks({ dict }: Props) {
  return (
    <section className={styles.section} aria-labelledby="how-heading">
      <div className="container">
        <header className={styles.header}>
          <h2 id="how-heading" className={styles.title}>{dict.title}</h2>
          <p className={styles.subtitle}>{dict.subtitle}</p>
        </header>

        <ol className={styles.steps} aria-label={dict.stepsAria}>
          {dict.steps.map((step, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <li key={i} className={styles.step}>
                <div className={styles.stepIcon} aria-hidden="true">
                  <Icon size={26} />
                </div>
                <div className={styles.stepNumber} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
