import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getErrors } from "@/lib/api/errorsList";
import { getBrands } from "@/lib/api/brands";
import { getCategories } from "@/lib/api/categories";
import { getStats } from "@/lib/api/stats";
import Hero from "@/components/home/Hero/Hero";
import BrandsGrid from "@/components/home/BrandsGrid/BrandsGrid";
import CategoriesGrid from "@/components/home/CategoriesGrid/CategoriesGrid";
import PopularGuides from "@/components/home/PopularGuides/PopularGuides";
import HowItWorks from "@/components/home/HowItWorks/HowItWorks";
import TrustStats from "@/components/home/TrustStats/TrustStats";
import FinalCta from "@/components/home/FinalCta/FinalCta";
import { getDictionary } from "@/dictionaries/dictionaries";
import { isValidLocale, type Locale } from "@/lib/i18n";

export const revalidate = 3600;

export function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }];
}

const HOME_COPY: Record<Locale, { title: string; description: string; ogLocale: string; altLocale: string }> = {
  es: {
    title: "Vimazdev — Soluciona Códigos de Error de Impresoras",
    description:
      "Encontrá qué significa cada código de error de tu impresora, por qué ocurre y cómo solucionarlo paso a paso, por marca y modelo: HP, Epson, Brother, Canon, Fujitsu y más.",
    ogLocale: "es_ES",
    altLocale: "en_US",
  },
  en: {
    title: "Vimazdev — Fix Printer Error Codes",
    description:
      "Find out what your printer's error code means, why it happens, and how to fix it step by step, by brand and model: HP, Epson, Brother, Canon, Fujitsu and more.",
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
  const copy = HOME_COPY[locale];

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        es: "/es",
        en: "/en",
      },
    },
    openGraph: {
      type: "website",
      url: `/${locale}`,
      locale: copy.ogLocale,
      alternateLocale: [copy.altLocale],
      title: copy.title,
      description: copy.description,
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const locale = lang as Locale;

  const [dict, brands, categories, popularResult, apiStats] = await Promise.all([
    getDictionary(locale),
    getBrands(),
    getCategories(locale),
    getErrors({ sort: 'popular', locale, limit: 6 }),
    getStats(),
  ]);
  const popularGuides = popularResult.items;

  return (
    <main>
      <Hero           locale={locale} dict={dict.hero} popularGuides={popularGuides} />
      <TrustStats     dict={dict.trustStats} apiStats={apiStats} />
      <BrandsGrid     locale={locale} dict={dict.brands} brands={brands} />
      <CategoriesGrid locale={locale} dict={dict.categories} categories={categories} />
      <PopularGuides  locale={locale} dict={dict.popularGuides} guides={popularGuides} />
      <HowItWorks     dict={dict.howItWorks} />
      <FinalCta       locale={locale} dict={dict.finalCta} />
    </main>
  );
}