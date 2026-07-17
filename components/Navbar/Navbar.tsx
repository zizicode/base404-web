import Link from "next/link";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Base<span className={styles.logoAccent}>404</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Inicio
          </Link>
        </nav>
      </div>
    </header>
  );
}
