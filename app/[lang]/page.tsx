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

export const metadata: Metadata = {
  title: "Vimovies — Códigos de error de electrodomésticos",
  description:
    "Encuentra soluciones paso a paso para los códigos de error de lavadoras, refrigeradores, hornos y más. Guías claras con causas, pasos y videos.",
};

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
