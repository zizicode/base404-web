import { apiClient } from "./client";
import type { ApiEnvelope, ErrorsListItem, ErrorsListResult } from "./types";

export type ErrorsSort = "recent" | "popular";

export interface GetErrorsParams {
  sort?: ErrorsSort;
  locale?: string;
  limit?: number;
  cursor?: string;
}

interface RawMeta {
  hasMore?: boolean;
  nextCursor?: string | null;
}

export async function getErrors(
  params: GetErrorsParams = {}
): Promise<ErrorsListResult> {
  try {
    const apiParams: Record<string, string | number> = {
      locale: params.locale ?? "es",
      limit:  params.limit  ?? 20,
      sort:   params.sort   ?? "recent",
    };
    if (params.cursor) apiParams.cursor = params.cursor;

    const { data } = await apiClient.get<ApiEnvelope<{ items: ErrorsListItem[] }>>(
      "/errors",
      { params: apiParams }
    );

    const meta = data.meta as RawMeta | undefined;
    return {
      items:      data.success ? data.data.items : [],
      hasMore:    meta?.hasMore    ?? false,
      nextCursor: meta?.nextCursor ?? null,
    };
  } catch {
    return { items: [], hasMore: false, nextCursor: null };
  }
}
