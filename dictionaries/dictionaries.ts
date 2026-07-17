import type { Locale } from '@/lib/i18n';
import type esDict from './es.json';

export type Dictionary = typeof esDict;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  es: () => import('./es.json').then((m) => m.default as Dictionary),
  en: () => import('./en.json').then((m) => m.default as Dictionary),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
