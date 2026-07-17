import { apiClient } from "./client";
import type { ApiEnvelope, Category, ErrorsListItem } from "./types";

export async function getCategories(locale = "es"): Promise<Category[]> {
  try {
    const { data } = await apiClient.get<ApiEnvelope<{ categories: Category[] }>>("/categories", {
      params: { locale },
    });
    return data.success ? data.data.categories : [];
  } catch {
    return [];
  }
}

export async function getCategoryBySlug(slug: string, locale = "es"): Promise<Category | null> {
  try {
    const { data } = await apiClient.get<ApiEnvelope<{ category: Category }>>(`/categories/${slug}`, {
      params: { locale },
    });
    return data.success ? data.data.category : null;
  } catch {
    return null;
  }
}

export async function getCategoryErrors(
  slug: string,
  locale = "es",
  limit = 50
): Promise<ErrorsListItem[]> {
  try {
    const { data } = await apiClient.get<ApiEnvelope<{ items: ErrorsListItem[] }>>(
      `/categories/${slug}/errors`,
      { params: { locale, limit } }
    );
    return data.success ? (data.data.items ?? []) : [];
  } catch {
    return [];
  }
}

interface CategoryBrandErrorsParams {
  categorySlug: string;
  brandSlug: string;
  locale?: string;
  limit?: number;
  cursor?: string;
}

interface CategoryBrandErrorsResult {
  items: ErrorListItem[];
  hasMore: boolean;
  nextCursor: string | null;
}

export async function getCategoryBrandErrors({
  categorySlug,
  brandSlug,
  locale = "es",
  limit = 20,
  cursor,
}: CategoryBrandErrorsParams): Promise<CategoryBrandErrorsResult> {
  try {
    const { data } = await apiClient.get<
      ApiEnvelope<{ items: ErrorListItem[] }>
    >(`/categories/${categorySlug}/brands/${brandSlug}/errors`, {
      params: { locale, limit, ...(cursor && { cursor }) },
    });
    const meta = data.meta as { hasMore?: boolean; nextCursor?: string } | undefined;
    return {
      items: data.success ? data.data.items : [],
      hasMore: meta?.hasMore ?? false,
      nextCursor: meta?.nextCursor ?? null,
    };
  } catch {
    return { items: [], hasMore: false, nextCursor: null };
  }
}
