'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionContextValue {
  isNavigating: boolean;
  loadingLabel: string;
}

const PageTransitionContext = createContext<PageTransitionContextValue>({
  isNavigating: false,
  loadingLabel: 'Cargando…',
});

export const usePageTransition = () => useContext(PageTransitionContext);

const MIN_OVERLAY_MS = 800;

export function PageTransitionProvider({
  children,
  loadingLabel,
}: {
  children: React.ReactNode;
  loadingLabel: string;
}) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPathRef = useRef(pathname);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (pathname === lastPathRef.current) return;

    clearTimer();
    setIsNavigating(true);
    lastPathRef.current = pathname;

    timerRef.current = setTimeout(() => {
      setIsNavigating(false);
    }, MIN_OVERLAY_MS);

    return clearTimer;
  }, [pathname, clearTimer]);

  return (
    <PageTransitionContext.Provider value={{ isNavigating, loadingLabel }}>
      {children}
    </PageTransitionContext.Provider>
  );
}
