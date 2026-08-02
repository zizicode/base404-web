import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary } from "@/dictionaries/dictionaries";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getAlternates } from "@/lib/seo";
import styles from "./not-found.module.scss";

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? (lang as Locale) : "es";
  const dict = await getDictionary(locale);
  
  const title = dict.notFound?.title || (locale === 'es' ? 'Página no encontrada | Vimazdev' : 'Page not found | Vimazdev');
  const description = dict.notFound?.description || (locale === 'es' 
    ? 'La página que buscas no existe o ha sido eliminada. Volvé al inicio y buscá el código de error que necesitás.'
    : 'The page you are looking for does not exist or has been deleted. Go back to the homepage and search for the error code you need.');

  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: getAlternates(`/${locale}`, locale),
    openGraph: {
      type: 'website',
      url: `/${locale}`,
      siteName: 'Vimazdev',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      alternateLocale: [locale === 'es' ? 'en_US' : 'es_ES'],
      title,
      description,
      images: [
        {
          url: '/og.png',
          width: 1200,
          height: 630,
          alt: 'Vimazdev — Página no encontrada',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og.png'],
    },
  };
}

export default async function NotFound({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  let locale: Locale = 'es';
  let notFoundDict: Record<string, string> = {};

  try {
    const resolvedParams = await params;
    const lang = resolvedParams?.lang;
    
    if (!lang || !isValidLocale(lang)) {
      notFound();
    }

    locale = lang as Locale;
    const dict = await getDictionary(locale);
    notFoundDict = dict.notFound as Record<string, string> || {};
  } catch {
    notFound();
  }

  return (
    <section className={styles.page}>
      <span className={styles.badge}>404</span>
      <h1 className={styles.title}>
        {notFoundDict.title || (locale === 'es' ? 'No encontramos esa página' : 'Page not found')}
      </h1>
      <p className={styles.body}>
        {notFoundDict.description || (locale === 'es'
          ? 'Es posible que el enlace esté desactualizado o que la página haya sido eliminada. Volvé al inicio y buscá lo que necesitás.'
          : 'The link may be outdated or the page may have been deleted. Go back to the homepage and search for what you need.')}
      </p>
      <Link href={`/${locale}`} className={styles.cta}>
        ← {locale === 'es' ? 'Volver al inicio' : 'Back to homepage'}
      </Link>
    </section>
  );
}
