import type { MetadataRoute } from "next";

function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return "https://vimazdev.com";
  return raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`;
}

const baseUrl = getSiteUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/v1/admin/",
          "/api/",
          "/admin/",
          "/dashboard/",
          "/private/",
          "/*?*search=*",
          "/*?*preview=*",
        ],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-es.xml`,
      `${baseUrl}/sitemap-en.xml`,
    ],
    host: baseUrl,
  };
}