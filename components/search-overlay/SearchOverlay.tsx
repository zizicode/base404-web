'use client';

import { useState, useEffect, useRef, useCallback, useTransition } from 'react';
import Link from 'next/link';
import { Search, X, Tag, Layers, Printer, ArrowRight, Loader2 } from 'lucide-react';
import type { ApiEnvelope, SearchData } from '@/lib/api/types';
import type { Locale } from '@/lib/i18n';
import styles from './SearchOverlay.module.scss';

interface Props {
  locale: Locale;
  placeholder: string;
  searchLabel: string;
}

interface GroupedResults {
  brands:     SearchData['brands'];
  categories: SearchData['categories'];
  errors:     SearchData['errors'];
}

export default function SearchOverlay({ locale, placeholder, searchLabel }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GroupedResults | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openOverlay = () => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const closeOverlay = useCallback(() => {
    setOpen(false);
    setQuery('');
    setResults(null);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeOverlay();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [closeOverlay]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const runSearch = useCallback((q: string) => {
    if (!q.trim() || q.trim().length < 2) {
      setResults(null);
      return;
    }
    startTransition(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}&locale=${locale}&limit=8`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Search request failed: ${response.status}`);
        }

        const data = (await response.json()) as ApiEnvelope<SearchData>;
        if (data.success) {
          setResults({
            brands:     data.data.brands,
            categories: data.data.categories,
            errors:     data.data.errors,
          });
        } else {
          setResults({ brands: [], categories: [], errors: [] });
        }
      } catch {
        setResults({ brands: [], categories: [], errors: [] });
      }
    });
  }, [locale]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(val), 280);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      closeOverlay();
      window.location.href = `/${locale}/buscar?q=${encodeURIComponent(query.trim())}`;
    }
  };

  const hasResults = results && (
    results.brands.length > 0 || results.categories.length > 0 || results.errors.length > 0
  );

  return (
    <>
      {/* Trigger — replaces the old inline Hero input */}
      <button
        type="button"
        className={styles.trigger}
        onClick={openOverlay}
        aria-label={searchLabel}
      >
        <Search className={styles.triggerIcon} size={20} aria-hidden="true" />
        <span className={styles.triggerPlaceholder}>{placeholder}</span>
        <span className={styles.triggerKbd} aria-hidden="true">
          <kbd>/</kbd>
        </span>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className={styles.backdrop}
          onClick={(e) => { if (e.target === overlayRef.current) closeOverlay(); }}
          aria-modal="true"
          role="dialog"
          aria-label={searchLabel}
        >
          <div className={styles.panel} ref={overlayRef} onClick={(e) => e.stopPropagation()}>
            {/* Search input row */}
            <form role="search" className={styles.inputRow} onSubmit={handleSubmit}>
              <Search className={styles.inputIcon} size={20} aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                className={styles.input}
                placeholder={placeholder}
                value={query}
                onChange={handleChange}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              {isPending && (
                <Loader2 size={18} className={styles.spinner} aria-hidden="true" />
              )}
              <button
                type="button"
                className={styles.closeBtn}
                onClick={closeOverlay}
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </form>

            <div className={styles.body}>
              {/* Empty state */}
              {!query && (
                <div className={styles.emptyState}>
                  <Search size={32} className={styles.emptyIcon} aria-hidden="true" />
                  <p className={styles.emptyTitle}>
                    {locale === 'es' ? 'Busca por código, marca o categoría' : 'Search by code, brand or category'}
                  </p>
                  <ul className={styles.emptyHints}>
                    <li><kbd>E0</kbd> — {locale === 'es' ? 'código de error exacto' : 'exact error code'}</li>
                    <li><kbd>HP</kbd> — {locale === 'es' ? 'todos los errores de una marca' : 'all errors for a brand'}</li>
                    <li><kbd>Impresora</kbd> — {locale === 'es' ? 'errores por categoría' : 'errors by category'}</li>
                  </ul>
                </div>
              )}

              {/* Loading — query entered but no results yet */}
              {query && isPending && !results && (
                <div className={styles.loadingState}>
                  <Loader2 size={20} className={styles.spinner} aria-hidden="true" />
                  <span>{locale === 'es' ? 'Buscando…' : 'Searching…'}</span>
                </div>
              )}

              {/* No results */}
              {query && !isPending && results && !hasResults && (
                <div className={styles.emptyState}>
                  <p className={styles.emptyTitle}>
                    {locale === 'es'
                      ? `Sin resultados para "${query}"`
                      : `No results for "${query}"`}
                  </p>
                  <p className={styles.emptySubtitle}>
                    {locale === 'es'
                      ? 'Prueba con el código de error exacto (ej. E0, 0x97, B204)'
                      : 'Try the exact error code (e.g. E0, 0x97, B204)'}
                  </p>
                </div>
              )}

              {/* Results */}
              {results && hasResults && (
                <div className={styles.results}>
                  {/* Brands */}
                  {results.brands.length > 0 && (
                    <section className={styles.group}>
                      <h3 className={styles.groupTitle}>
                        <Printer size={13} aria-hidden="true" />
                        {locale === 'es' ? 'Marcas' : 'Brands'}
                      </h3>
                      <ul className={styles.pills}>
                        {results.brands.map((brand) => (
                          <li key={brand.slug}>
                            <Link
                              href={`/${locale}/marcas/${brand.slug}`}
                              className={styles.pill}
                              onClick={closeOverlay}
                            >
                              {brand.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {/* Categories */}
                  {results.categories.length > 0 && (
                    <section className={styles.group}>
                      <h3 className={styles.groupTitle}>
                        <Layers size={13} aria-hidden="true" />
                        {locale === 'es' ? 'Categorías' : 'Categories'}
                      </h3>
                      <ul className={styles.pills}>
                        {results.categories.map((cat) => (
                          <li key={cat.slug}>
                            <Link
                              href={`/${locale}/categorias/${cat.slug}`}
                              className={styles.pill}
                              onClick={closeOverlay}
                            >
                              {cat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {/* Error guides */}
                  {results.errors.length > 0 && (
                    <section className={styles.group}>
                      <h3 className={styles.groupTitle}>
                        <Tag size={13} aria-hidden="true" />
                        {locale === 'es' ? 'Guías de error' : 'Error guides'}
                      </h3>
                      <ul className={styles.errorList}>
                        {results.errors.map((item) => (
                          <li key={item.slug}>
                            <Link
                              href={`/${locale}/error/${item.slug}`}
                              className={styles.errorItem}
                              onClick={closeOverlay}
                            >
                              <span className={styles.errorCode}>{item.errorCode}</span>
                              <span className={styles.errorMeta}>
                                <span className={styles.errorTitle}>{item.title}</span>
                                <span className={styles.errorSub}>
                                  {item.brandName} · {item.categoryName}
                                </span>
                              </span>
                              <ArrowRight size={14} className={styles.errorArrow} aria-hidden="true" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {/* Full-search CTA */}
                  <div className={styles.fullSearch}>
                    <Link
                      href={`/${locale}/buscar?q=${encodeURIComponent(query)}`}
                      className={styles.fullSearchLink}
                      onClick={closeOverlay}
                    >
                      <Search size={14} aria-hidden="true" />
                      {locale === 'es'
                        ? `Ver todos los resultados para "${query}"`
                        : `View all results for "${query}"`}
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
