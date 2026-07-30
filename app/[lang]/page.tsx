import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getErrors } from "@/lib/api/errorsList";
import { getBrands } from "@/lib/api/brands";
import { getCategories } from "@/lib/api/categories";
import { getStats } from "@/lib/api/stats";
import type { Category } from "@/lib/api/types";
import Hero from "@/components/home/Hero/Hero";
import BrandsGrid from "@/components/home/BrandsGrid/BrandsGrid";
import CategoriesGrid from "@/components/home/CategoriesGrid/CategoriesGrid";
import PopularGuides from "@/components/home/PopularGuides/PopularGuides";
import TrustStats from "@/components/home/TrustStats/TrustStats";
import FinalCta from "@/components/home/FinalCta/FinalCta";
import { getDictionary } from "@/dictionaries/dictionaries";
import { isValidLocale, type Locale } from "@/lib/i18n";

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://vimazdev.com";
const SITE_URL = (rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
  ? rawSiteUrl
  : `https://${rawSiteUrl}`
).replace(/\/$/, "");

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getDistinctBrandCategories(categories: Category[], max = 50): Category[] {
  const seen = new Set<string | number>();
  const result: Category[] = [];

  for (const cat of shuffle(categories)) {
    const key = cat.brandId ?? cat.slug;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(cat);
      if (result.length >= max) break;
    }
  }

  return result;
}

const HOME_COPY: Record<Locale, { title: string; description: string; ogLocale: string; altLocale: string }> = {
  es: {
    title: "Vimazdev — Soluciona Códigos de Error de Impresoras",
    description:
      "Descubrí qué significa cada código de error de tu impresora, por qué ocurre y cómo solucionarlo paso a paso: HP, Epson, Brother, Canon, Fujitsu y más.",
    ogLocale: "es_ES",
    altLocale: "en_US",
  },
  en: {
    title: "Vimazdev — Fix Printer Error Codes",
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
  const copy = HOME_COPY[locale];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Vimazdev",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Vimazdev",
        alternateName: ["Vimazdev Printer Error Codes", "Vimazdev Errors"],
        url: SITE_URL,
        description: copy.description,
        inLanguage: locale,
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/${locale}/buscar?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  const [dict, brands, categories, popularResult, apiStats] = await Promise.all([
    getDictionary(locale),
    getBrands(),
    getCategories(locale).then(getDistinctBrandCategories),
    getErrors({ sort: 'popular', locale, limit: 100000 }),
    getStats(),
  ]);
  const popularGuides = popularResult.items;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <main>
        <Hero           locale={locale} dict={dict.hero} popularGuides={popularGuides} />
        <TrustStats     dict={dict.trustStats} apiStats={apiStats} />
        <BrandsGrid     locale={locale} dict={dict.brands} brands={brands} />
        <CategoriesGrid locale={locale} dict={dict.categories} categories={categories} />
        <PopularGuides  locale={locale} dict={dict.popularGuides} guides={popularGuides} />
        <FinalCta       locale={locale} dict={dict.finalCta} />
      </main>
    </>
  );
}