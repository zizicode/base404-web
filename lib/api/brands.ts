import { apiClient } from "./client";
import type { ApiEnvelope, Brand, ErrorsListItem } from "./types";

export async function getBrands(): Promise<Brand[]> {
  try {
    const { data } = await apiClient.get<ApiEnvelope<{ brands: Brand[] }>>("/brands");
    return data.success ? data.data.brands : [];
  } catch {
    return [];
  }
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  try {
    const { data } = await apiClient.get<ApiEnvelope<{ brand: Brand }>>(`/brands/${slug}`);
    return data.success ? data.data.brand : null;
  } catch {
    return null;
  }
}

export async function getBrandErrors(
  slug: string,
  locale = "es",
  limit = 200
): Promise<ErrorsListItem[]> {
  try {
    const { data } = await apiClient.get<ApiEnvelope<{ items: ErrorsListItem[] }>>(
      `/brands/${slug}/errors`,
      { params: { locale, limit } }
    );
    return data.success ? (data.data.items ?? []) : [];
  } catch {
    return [];
  }
}
