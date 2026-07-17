import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vimovies.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/_vercel/", "/private/"],
    },
    sitemap: `${baseUrl}/sitemap-index.xml`,
    host: baseUrl,
  };
}
