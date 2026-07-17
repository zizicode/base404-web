import Link from "next/link";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            Base<span className={styles.logoAccent}>404</span>
          </Link>
          <p className={styles.tagline}>
            Soluciones paso a paso para códigos de error de electrodomésticos.
          </p>
        </div>

        <nav className={styles.links}>
          <h4 className={styles.linksTitle}>Navegación</h4>
          <Link href="/" className={styles.link}>
            Inicio
          </Link>
        </nav>
      </div>

      <div className={styles.bottom}>
        <p>
          © {new Date().getFullYear()} Base404 by Vimovies. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
