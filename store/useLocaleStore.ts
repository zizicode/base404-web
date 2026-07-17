import { create } from 'zustand';
import { type Locale, DEFAULT_LOCALE, isValidLocale } from '@/lib/i18n';

interface LocaleState {
  locale: Locale;
  setLocale: (newLocale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: DEFAULT_LOCALE,
  setLocale: (newLocale: Locale) => {
    set({ locale: newLocale });

    if (typeof window !== 'undefined') {
      localStorage.setItem('user-locale', newLocale);

      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }
  },
}));

/**
 * Reads the persisted locale from localStorage on the client.
 * Returns the stored value if valid, otherwise undefined.
 */
export function getStoredLocale(): Locale | undefined {
  if (typeof window === 'undefined') return undefined;
  const stored = localStorage.getItem('user-locale');
  return isValidLocale(stored) ? stored : undefined;
}
