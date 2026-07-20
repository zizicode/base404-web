import Link from "next/link";
import Image from "next/image";
import styles from "./SiteLogo.module.scss";

interface Props {
  href: string;
  ariaLabel?: string;
}

export default function SiteLogo({ href, ariaLabel = "Vimazdev — Inicio" }: Props) {
  return (
    <Link href={href} className={styles.logo} aria-label={ariaLabel}>
      <span className={styles.logoIcon} aria-hidden="true">
        <Image
          src="/favicon-32x32.png"
          alt=""
          width={32}
          height={32}
          className={styles.logoImage}
          priority
        />
      </span>
      <span className={styles.logoWord}>
        Vimaz<span className={styles.logoAccent}>dev</span>
      </span>
    </Link>
  );
}
