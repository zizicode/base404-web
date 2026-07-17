import { NextResponse } from "next/server";
import { apiClient } from "./client";
import { getBrands } from "./brands";
import { getCategories } from "./categories";
import { getErrors } from "./errorsList";
import type { ApiEnvelope } from "./types";

async function fetchApiXml(path: string, params: Record<string, string | number | undefined> = {}) {
  const { data, headers } = await apiClient.get(path, {
    params,
    responseType: "text",
  });

  const contentType = headers["content-type"] ?? headers["Content-Type"];
  return {
    body: typeof data === "string" ? data : String(data ?? ""),
    contentType: typeof contentType === "string" ? contentType : "application/xml",
  };
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vimovies.com";

export interface SitemapUrl {
  loc: string;
  lastModified?: string;
  priority?: number;
  changeFrequency?: string;
}

export interface SitemapUrlInput {
  slug: string;
  lastModified?: string;
  priority?: number;
  changeFrequency?: string;
  isReady?: boolean;
}

const DEFAULTS = {
  main:       { priority: 1.0, changeFrequency: "daily" },
  buscar:     { priority: 0.5, changeFrequency: "weekly" },
  marcas:     { priority: 0.8, changeFrequency: "weekly" },
  categorias: { priority: 0.8, changeFrequency: "weekly" },
  error:      { priority: 0.9, changeFrequency: "weekly" },
  brand:      { priority: 0.7, changeFrequency: "weekly" },
  category:   { priority: 0.7, changeFrequency: "weekly" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Main routes (home + top-level indexes)
// ─────────────────────────────────────────────────────────────────────────────
export async function getSitemapMainUrls(locale: string): Promise<SitemapUrl[]> {
  try {
    const { data } = await apiClient.get<ApiEnvelope<{ items: SitemapUrlInput[] }>>(
      `/sitemap/main`,
      { params: { locale } }
    );
    if (data.success && data.data?.items) {
      return data.data.items.map((item) => ({
        loc: `${baseUrl}/${locale}${item.slug ? `/${item.slug}` : ""}`,
        lastModified: item.lastModified,
        priority: item.priority,
        changeFrequency: item.changeFrequency,
      }));
    }
  } catch {
    // fall back to static list until the endpoint exists
  }
  return staticMainUrls(locale);
}

function staticMainUrls(locale: string): SitemapUrl[] {
  return [
    { loc: `${baseUrl}/${locale}`,                         ...DEFAULTS.main },
    { loc: `${baseUrl}/${locale}/buscar`,                   ...DEFAULTS.buscar },
    { loc: `${baseUrl}/${locale}/marcas`,                   ...DEFAULTS.marcas },
    { loc: `${baseUrl}/${locale}/categorias`,               ...DEFAULTS.categorias },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// Errors (paginated, skip non-ready guides)
// ─────────────────────────────────────────────────────────────────────────────
export async function getSitemapErrorUrls(locale: string): Promise<SitemapUrl[]> {
  try {
    const items: SitemapUrlInput[] = [];
    let cursor: string | undefined;
    while (true) {
      const { data } = await apiClient.get<
        ApiEnvelope<{ items: SitemapUrlInput[]; hasMore?: boolean; nextCursor?: string | null }>
      >(`/sitemap/errors`, { params: { locale, limit: 100, cursor } });

      if (!data.success || !data.data) break;
      const page = data.data;
      items.push(...page.items.filter((i) => i.isReady !== false));
      if (!page.hasMore || !page.nextCursor) break;
      cursor = page.nextCursor;
    }
    return items.map(toSitemapUrl(locale, "/error"));
  } catch {
    // Fallback: best-effort first 100 from the public errors list
    return fallbackErrorUrls(locale);
  }
}

async function fallbackErrorUrls(locale: string): Promise<SitemapUrl[]> {
  const result = await getErrors({ locale, limit: 100, sort: "recent" });
  return result.items.map((item) => ({
    loc: `${baseUrl}/${locale}/error/${item.slug}`,
    lastModified: item.updatedAt,
    ...DEFAULTS.error,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Brands
// ─────────────────────────────────────────────────────────────────────────────
export async function getSitemapBrandUrls(locale: string): Promise<SitemapUrl[]> {
  try {
    const { data } = await apiClient.get<ApiEnvelope<{ items: SitemapUrlInput[] }>>(
      `/sitemap/brands`,
      { params: { locale } }
    );
    if (data.success && data.data?.items) {
      return data.data.items.map(toSitemapUrl(locale, "/marcas"));
    }
  } catch {
    // fall back to existing brand list
  }
  return fallbackBrandUrls(locale);
}

async function fallbackBrandUrls(locale: string): Promise<SitemapUrl[]> {
  const brands = await getBrands();
  return brands.map((b) => ({
    loc: `${baseUrl}/${locale}/marcas/${b.slug}`,
    ...DEFAULTS.brand,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────────────────────────────────────
export async function getSitemapCategoryUrls(locale: string): Promise<SitemapUrl[]> {
  try {
    const { data } = await apiClient.get<ApiEnvelope<{ items: SitemapUrlInput[] }>>(
      `/sitemap/categories`,
      { params: { locale } }
    );
    if (data.success && data.data?.items) {
      return data.data.items.map(toSitemapUrl(locale, "/categorias"));
    }
  } catch {
    // fall back to existing category list
  }
  return fallbackCategoryUrls(locale);
}

async function fallbackCategoryUrls(locale: string): Promise<SitemapUrl[]> {
  const categories = await getCategories(locale);
  return categories.map((c) => ({
    loc: `${baseUrl}/${locale}/categorias/${c.slug}`,
    ...DEFAULTS.category,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function toSitemapUrl(locale: string, prefix: string) {
  return (item: SitemapUrlInput): SitemapUrl => ({
    loc: `${baseUrl}/${locale}${prefix}/${item.slug}`.replace(/\/$/, ""),
    lastModified: item.lastModified,
    priority: item.priority,
    changeFrequency: item.changeFrequency,
  });
}

export type SitemapType = "main" | "errors" | "brands" | "categories";
export type SitemapLocale = "es" | "en";

export async function fetchSitemapUrls(
  type: SitemapType,
  locale: SitemapLocale
): Promise<SitemapUrl[]> {
  switch (type) {
    case "main":       return getSitemapMainUrls(locale);
    case "errors":     return getSitemapErrorUrls(locale);
    case "brands":     return getSitemapBrandUrls(locale);
    case "categories": return getSitemapCategoryUrls(locale);
  }
}

export function renderUrlset(urls: SitemapUrl[]): string {
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

export function createSitemapHandler(type: SitemapType, locale: SitemapLocale) {
  return async function GET(): Promise<NextResponse> {
    try {
      const { body, contentType } = await fetchApiXml(`/sitemap/${type}`, { locale });
      return new NextResponse(body, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      });
    } catch {
      const urls = await fetchSitemapUrls(type, locale);
      return new NextResponse(renderUrlset(urls), {
        headers: {
          "Content-Type": "application/xml",
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      });
    }
  };
}
