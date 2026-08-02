import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteNavbar from "@/components/site-navbar";
import SiteFooter from "@/components/site-footer";
import LocaleInitializer from "@/components/LocaleInitializer";
import { PageTransitionProvider } from "@/components/page-transition/PageTransitionProvider";
import PageTransition from "@/components/page-transition/PageTransition";
import { getDictionary } from "@/dictionaries/dictionaries";
import { isValidLocale, type Locale } from "@/lib/i18n";

const SITE_NAME = "Vimazdev";

const COPY: Record<Locale, { title: string; template: string; description: string; ogLocale: string; altLocale: string }> = {
  es: {
    title: "Vimazdev — Soluciona Códigos de Error de Impresoras",
    template: "%s | Vimazdev",
    description:
      "Descubrí qué significa cada código de error de tu impresora, por qué ocurre y cómo solucionarlo paso a paso: HP, Epson, Brother, Canon, Fujitsu y más.",
    ogLocale: "es_ES",
    altLocale: "en_US",
  },
  en: {
    title: "Vimazdev — Fix Printer Error Codes",
    template: "%s | Vimazdev",
    description:
      "Find out what each printer error code means, why it happens, and how to fix it, by brand and model: HP, Epson, Brother, Canon, Fujitsu, and more.",
    ogLocale: "en_US",
    altLocale: "es_ES",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? (lang as Locale) : "es";
  const copy = COPY[locale];

  return {
    title: {
      default: copy.title,
      template: copy.template,
    },
    description: copy.description,
    keywords: [
      "códigos de error impresora",
      "cómo solucionar error de impresora",
      "qué significa el error de mi impresora",
      "error impresora HP",
      "error impresora Epson",
      "error impresora Brother",
      "error impresora Canon",
      "error impresora matricial",
      "atasco de papel solución",
      "impresora no imprime error",
      "diagnóstico de fallas impresora",
      "reparar impresora",
      "tóner y cartucho compatible",
      "guía de reparación paso a paso",
    ],
    alternates: {
      languages: {
        es: "/es",
        en: "/en",
        "x-default": "/es",
      },
    },
    openGraph: {
      type: "website",
      locale: copy.ogLocale,
      alternateLocale: [copy.altLocale],
      siteName: SITE_NAME,
      title: copy.title,
      description: copy.description,
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
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