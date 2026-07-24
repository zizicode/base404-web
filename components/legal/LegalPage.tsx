import styles from './LegalPage.module.scss';

interface Props {
  title: string;
  html: string;
}

export default function LegalPage({ title, html }: Props) {
  return (
    <main className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>{title}</h1>
        <article
          className={styles.prose}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </main>
  );
}
