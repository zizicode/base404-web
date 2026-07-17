import { apiClient } from "./client";
import type { ApiEnvelope } from "./types";

export interface SiteStats {
  errors: number;
  brands: number;
  categories: number;
  votes?: number;
}

export async function getStats(): Promise<SiteStats | null> {
  try {
    const { data } = await apiClient.get<ApiEnvelope<SiteStats>>("/stats");
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}
