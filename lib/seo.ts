import type { Locale } from "./i18n";

const DEFAULT_LOCALE: Locale = "es";

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
