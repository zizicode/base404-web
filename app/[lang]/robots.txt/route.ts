import { NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vimovies.com";

export async function GET(): Promise<NextResponse> {
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /_next/",
    "Disallow: /_vercel/",
    "Disallow: /private/",
    `Sitemap: ${baseUrl}/sitemap-index.xml`,
    "",
  ].join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
