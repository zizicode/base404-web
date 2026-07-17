export const LOCALES = ['es', 'en'] as const;
export const DEFAULT_LOCALE = 'es' as const;

export type Locale = (typeof LOCALES)[number];

export function isValidLocale(value: unknown): value is Locale {
  return LOCALES.includes(value as Locale);
}

/**
 * Multi-level cascade to resolve the active locale.
 * Priority: URL param → Zustand state → localStorage → navigator.language → default 'es'
 *
 * Only the first two levels are available server-side; localStorage and
 * navigator are client-only and are handled by LocaleInitializer on mount.
 */
export function getAppLocale({
  urlParam,
  zustandLocale,
}: {
  urlParam?: string | null;
  zustandLocale?: string | null;
}): Locale {
  if (isValidLocale(urlParam)) return urlParam;
  if (isValidLocale(zustandLocale)) return zustandLocale;

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('user-locale');
    if (isValidLocale(stored)) return stored;

    const browser = navigator.language?.slice(0, 2);
    if (isValidLocale(browser)) return browser;
  }

  return DEFAULT_LOCALE;
}
