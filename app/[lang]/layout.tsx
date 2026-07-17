import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteNavbar from "@/components/site-navbar";
import SiteFooter from "@/components/site-footer";
import LocaleInitializer from "@/components/LocaleInitializer";
import { PageTransitionProvider } from "@/components/page-transition/PageTransitionProvider";
import PageTransition from "@/components/page-transition/PageTransition";
import { getDictionary } from "@/dictionaries/dictionaries";
import { isValidLocale, type Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: {
    default: "Vimovies — Códigos de error de electrodomésticos",
    template: "%s | Vimovies",
  },
  description:
    "Encuentra soluciones paso a paso para los códigos de error de lavadoras, lavavajillas, hornos y más. Guías claras con causas, pasos y videos.",
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }> | { lang: string };
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return (
    <>
      <LocaleInitializer urlLocale={locale} />
      <PageTransitionProvider loadingLabel={locale === 'en' ? 'Loading…' : 'Cargando…'}>
        <SiteNavbar locale={locale} dict={dict.nav} />
        {children}
        <SiteFooter locale={locale} dict={dict.footer} />
        <PageTransition />
      </PageTransitionProvider>
    </>
  );
}
