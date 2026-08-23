import type { Locale } from "./i18n";

const DEFAULT_LOCALE: Locale = "es";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return "https://vimazdev.com";
  return raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`;
}

export function buildCanonicalUrl(locale: Locale, path: string): string {
  const siteUrl = getSiteUrl().replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}/${locale}${normalizedPath}`.replace(/\/$/, "");
}

function getPathSuffix(canonical: string, locale: Locale): string {
  // Remove optional origin and optional locale prefix.
  let path = canonical;
  try {
    const url = new URL(path);
    path = url.pathname;
  } catch {
    // canonical is already a relative path
  }

  const prefix = `/${locale}`;
  return path.startsWith(prefix) ? path.slice(prefix.length) : path;
}

export function getAlternates(canonical: string, locale: Locale = DEFAULT_LOCALE) {
  const suffix = getPathSuffix(canonical, locale);

  return {
    canonical,
    languages: {
      es: `/es${suffix}`,
      en: `/en${suffix}`,
      "x-default": `/es${suffix}`,
    },
  };
}
