import Link from "next/link";
import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <section className={styles.page}>
      <span className={styles.badge}>404</span>
      <h1 className={styles.title}>No encontramos ese código de error</h1>
      <p className={styles.body}>
        Es posible que el enlace esté desactualizado o que el error haya sido
        eliminado. Podés volver al inicio y buscar el código que necesitás.
      </p>
      <Link href="/" className={styles.cta}>
        ← Volver al inicio
      </Link>
    </section>
  );
}
