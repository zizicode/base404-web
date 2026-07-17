import { NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vimovies.com";

const SITEMAPS = [
  { type: "main",       locale: "es" },
  { type: "main",       locale: "en" },
  { type: "errors",     locale: "es" },
  { type: "errors",     locale: "en" },
  { type: "brands",     locale: "es" },
  { type: "brands",     locale: "en" },
  { type: "categories", locale: "es" },
  { type: "categories", locale: "en" },
];

export async function GET() {
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...SITEMAPS.map(
      ({ type, locale }) =>
        `  <sitemap>\n    <loc>${baseUrl}/sitemap-${type}-${locale}.xml</loc>\n  </sitemap>`
    ),
    "</sitemapindex>",
  ].join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
