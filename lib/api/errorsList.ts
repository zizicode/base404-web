import { apiClient } from "./client";
import type { ApiEnvelope, ErrorsListItem, ErrorsListResult } from "./types";

export type ErrorsSort = "recent" | "popular";

function toNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const clean = value.replace(/[^\d.-]/g, "");
    const parsed = Number(clean);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function normalizeItem(item: unknown): ErrorsListItem {
  const raw = (item ?? {}) as Partial<ErrorsListItem>;
  return {
    id:              typeof raw.id === "number" ? raw.id : 0,
    slug:            String(raw.slug ?? ""),
    title:           String(raw.title ?? ""),
    errorCode:       String(raw.errorCode ?? ""),
    model:           raw.model === null ? null : String(raw.model ?? ""),
    views:           toNumber(raw.views),
    votes:           raw.votes === undefined ? undefined : toNumber(raw.votes),
    helpfulVotes:    raw.helpfulVotes === undefined ? undefined : toNumber(raw.helpfulVotes),
    unhelpfulVotes:  raw.unhelpfulVotes === undefined ? undefined : toNumber(raw.unhelpfulVotes),
    updatedAt:       String(raw.updatedAt ?? ""),
  } as ErrorsListItem;
}

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
      items:      data.success ? data.data.items.map(normalizeItem) : [],
      hasMore:    meta?.hasMore    ?? false,
      nextCursor: meta?.nextCursor ?? null,
    };
  } catch {
    return { items: [], hasMore: false, nextCursor: null };
  }
}
