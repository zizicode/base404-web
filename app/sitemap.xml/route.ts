import { NextResponse } from "next/server";

export async function GET() {
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <sitemap>',
    `    <loc>${process.env.NEXT_PUBLIC_SITE_URL ?? "https://vimovies.com"}/sitemap-index.xml</loc>`,
    '  </sitemap>',
    '</sitemapindex>',
  ].join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
