'use client';

import { useEffect } from 'react';
import { useLocaleStore, getStoredLocale } from '@/store/useLocaleStore';
import { getAppLocale, type Locale } from '@/lib/i18n';

interface Props {
  urlLocale: Locale;
}

/**
 * Client component that runs the full cascade on mount and syncs Zustand.
 * URL param (server-resolved) always wins; client-side tiers are checked
 * only if needed (should not normally differ after first load).
 */
export default function LocaleInitializer({ urlLocale }: Props) {
  const setLocale = useLocaleStore((s) => s.setLocale);

  useEffect(() => {
    const resolved = getAppLocale({
      urlParam: urlLocale,
      zustandLocale: getStoredLocale(),
    });
    setLocale(resolved);
  }, [urlLocale, setLocale]);

  return null;
}
