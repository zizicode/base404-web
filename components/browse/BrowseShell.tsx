'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import type { AnyErrorItem } from '@/lib/api/types';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/dictionaries/dictionaries';
import ErrorCard from './ErrorCard';
import styles from './BrowseShell.module.scss';

const PAGE_SIZE = 12;

interface Props {
  locale: Locale;
  dict: Dictionary['browse'];
  categoryNames: Record<string, string>;
  initialResults: AnyErrorItem[];
  lockedBrand?: string;
  lockedCategory?: string;
}

export default function BrowseShell({
  locale, dict, initialResults, lockedBrand, lockedCategory,
}: Props) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();

  const [query,    setQuery]    = useState(searchParams.get('q') ?? '');
  const [brand,    setBrand]    = useState(lockedBrand    ?? searchParams.get('brand')    ?? '');
  const [category, setCategory] = useState(lockedCategory ?? searchParams.get('category') ?? '');
  const [page,     setPage]     = useState(1);

  // ── Derived option lists from real data ─────────────────────────────────────
  const brandOptions = useMemo(() => {
    const names = [...new Set(
      initialResults.flatMap((r) => 'brandName' in r ? [r.brandName] : [])
    )].sort();
    return names;
  }, [initialResults]);

  const categoryOptions = useMemo(() => {
    const names = [...new Set(
      initialResults.flatMap((r) => 'categoryName' in r ? [r.categoryName] : [])
    )].sort();
    return names;
  }, [initialResults]);

  // ── Local filtering (instant, no re-fetch) ───────────────────────────────────
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialResults.filter((r) => {
      const bn = 'brandName'    in r ? r.brandName    : '';
      const cn = 'categoryName' in r ? r.categoryName : '';
      // On locked pages items are already pre-filtered by the API —
      // only apply brand/category filter when NOT locked AND user chose one.
      if (!lockedBrand    && brand    && bn.toLowerCase() !== brand.toLowerCase())    return false;
      if (!lockedCategory && category && cn.toLowerCase() !== category.toLowerCase()) return false;
      if (q && !(
        r.errorCode.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q)      ||
        bn.toLowerCase().includes(q)           ||
        cn.toLowerCase().includes(q)           ||
        (r.model ?? '').toLowerCase().includes(q)
      )) return false;
      return true;
    });
  }, [initialResults, query, brand, category, lockedBrand, lockedCategory]);

  // ── Client-side pagination ───────────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible    = filtered.slice(0, page * PAGE_SIZE);
  const hasMore    = page < totalPages;

  // ── URL sync (only on /buscar, not on locked pages) ──────────────────────────
  const syncUrl = (q: string, b: string, c: string) => {
    if (lockedBrand || lockedCategory) return;
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (b) params.set('brand', b);
    if (c) params.set('category', c);
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
  };

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setPage(1);
    syncUrl(val, brand, category);
  };

  const handleBrand = (val: string) => {
    setBrand(val);
    setPage(1);
    syncUrl(query, val, category);
  };

  const handleCategory = (val: string) => {
    setCategory(val);
    setPage(1);
    syncUrl(query, brand, val);
  };

  const clearAll = () => {
    setQuery('');
    setBrand(lockedBrand ?? '');
    setCategory(lockedCategory ?? '');
    setPage(1);
    syncUrl('', lockedBrand ?? '', lockedCategory ?? '');
  };

  const hasActiveFilters = query || (!lockedBrand && brand) || (!lockedCategory && category);

  return (
    <div className={styles.shell}>

      {/* ── Filter bar ──────────────────────────────────────────────────────── */}
      <div className={styles.filterBar}>

        {/* Text search */}
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} aria-hidden="true" />
          <input
            type="search"
            className={styles.searchInput}
            placeholder={dict.filterPlaceholder}
            value={query}
            onChange={handleQuery}
            autoComplete="off"
          />
          {query && (
            <button type="button" className={styles.clearBtn} onClick={() => { setQuery(''); setPage(1); syncUrl('', brand, category); }} aria-label="Limpiar búsqueda">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Brand select — hidden when locked */}
        {!lockedBrand && brandOptions.length > 1 && (
          <div className={styles.selectWrap}>
            <select
              className={styles.select}
              value={brand}
              onChange={(e) => handleBrand(e.target.value)}
              aria-label={dict.filterBrand}
            >
              <option value="">{dict.filterBrand}: {dict.filterAll}</option>
              {brandOptions.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <ChevronDown size={14} className={styles.selectIcon} aria-hidden="true" />
          </div>
        )}

        {/* Category select — hidden when locked */}
        {!lockedCategory && categoryOptions.length > 1 && (
          <div className={styles.selectWrap}>
            <select
              className={styles.select}
              value={category}
              onChange={(e) => handleCategory(e.target.value)}
              aria-label={dict.filterCategory}
            >
              <option value="">{dict.filterCategory}: {dict.filterAll}</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown size={14} className={styles.selectIcon} aria-hidden="true" />
          </div>
        )}

        {/* Count + clear all */}
        <div className={styles.countRow}>
          <span className={styles.count}>
            {dict.resultsCount.replace('{{count}}', String(filtered.length))}
          </span>
          {hasActiveFilters && (
            <button type="button" className={styles.clearAllBtn} onClick={clearAll}>
              <X size={12} aria-hidden="true" />
              {dict.filterClear}
            </button>
          )}
        </div>
      </div>

      {/* ── Results ─────────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <SlidersHorizontal size={32} className={styles.emptyIcon} aria-hidden="true" />
          <p className={styles.emptyTitle}>{dict.noResults}</p>
          <p className={styles.emptyHint}>{dict.noResultsHint}</p>
        </div>
      ) : (
        <>
          <ul className={styles.grid} role="list">
            {visible.map((item) => (
              <li key={item.slug}>
                <ErrorCard item={item} locale={locale} dict={dict} />
              </li>
            ))}
          </ul>

          {/* Pagination info */}
          <p className={styles.pageInfo}>
            {dict.showingOf
              .replace('{{shown}}', String(visible.length))
              .replace('{{total}}', String(filtered.length))}
          </p>

          {hasMore && (
            <div className={styles.loadMoreWrap}>
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => setPage((p) => p + 1)}
              >
                {dict.loadMore}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
