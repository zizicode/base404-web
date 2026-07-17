import { NextResponse } from "next/server";
import {
  getSitemapMainUrls,
  getSitemapErrorUrls,
  getSitemapBrandUrls,
  getSitemapCategoryUrls,
  type SitemapUrl,
} from "@/lib/api/sitemap";

const VALID_TYPES = ["main", "errors", "brands", "categories"] as const;
const VALID_LOCALES = ["es", "en"] as const;

type SitemapType = (typeof VALID_TYPES)[number];
type Locale = (typeof VALID_LOCALES)[number];

interface RouteParams {
  type: string;
  locale: string;
}

async function fetchUrls(type: SitemapType, locale: Locale): Promise<SitemapUrl[]> {
  switch (type) {
    case "main":       return getSitemapMainUrls(locale);
    case "errors":     return getSitemapErrorUrls(locale);
    case "brands":     return getSitemapBrandUrls(locale);
    case "categories": return getSitemapCategoryUrls(locale);
  }
}

function renderUrlset(urls: SitemapUrl[]): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((u) => {
      const lastmod = u.lastModified ? `\n    <lastmod>${escapeXml(u.lastModified)}</lastmod>` : "";
      const priority = u.priority != null ? `\n    <priority>${u.priority.toFixed(1)}</priority>` : "";
      const changefreq = u.changeFrequency ? `\n    <changefreq>${escapeXml(u.changeFrequency)}</changefreq>` : "";
      return `  <url>\n    <loc>${escapeXml(u.loc)}</loc>${lastmod}${priority}${changefreq}\n  </url>`;
    }),
    "</urlset>",
  ].join("\n");
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<RouteParams> }
) {
  const { type, locale } = await params;

  if (!VALID_TYPES.includes(type as SitemapType) || !VALID_LOCALES.includes(locale as Locale)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const urls = await fetchUrls(type as SitemapType, locale as Locale);

  return new NextResponse(renderUrlset(urls), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
