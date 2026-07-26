import { AxiosError } from "axios";
import { apiClient } from "./client";
import { normalizeVideos } from "./videos";
import type {
  ApiEnvelope,
  SearchData,
  ErrorListItem,
  ErrorPageResponse,
} from "./types";

function normalizeErrorPayload(payload: ErrorPageResponse): ErrorPageResponse {
  const candidateSources = [
    payload.content,
    (payload as ErrorPageResponse & { content_ia?: Record<string, unknown> }).content_ia,
    (payload as ErrorPageResponse & { contentIa?: Record<string, unknown> }).contentIa,
    (payload as ErrorPageResponse & { contentia?: Record<string, unknown> }).contentia,
  ].filter((value): value is Record<string, unknown> => Boolean(value && typeof value === "object"));

  const primaryContent = candidateSources[0] ?? {};
  const secondaryContent = candidateSources[1] ?? {};

  const mergedContent = {
    ...primaryContent,
    ...secondaryContent,
    summary: (primaryContent.summary as string | undefined) ?? (secondaryContent.summary as string | undefined) ?? payload.content.summary,
    markdownSolutions: (primaryContent.markdownSolutions as string | undefined) ?? (secondaryContent.markdownSolutions as string | undefined) ?? payload.content.markdownSolutions,
    causes: Array.isArray(primaryContent.causes)
      ? (primaryContent.causes as string[])
      : Array.isArray(secondaryContent.causes)
        ? (secondaryContent.causes as string[])
        : payload.content.causes,
    stepsHowTo: Array.isArray(primaryContent.stepsHowTo)
      ? (primaryContent.stepsHowTo as ErrorPageResponse["content"]["stepsHowTo"])
      : Array.isArray(secondaryContent.stepsHowTo)
        ? (secondaryContent.stepsHowTo as ErrorPageResponse["content"]["stepsHowTo"])
        : payload.content.stepsHowTo,
    faqs: Array.isArray(primaryContent.faqs)
      ? (primaryContent.faqs as ErrorPageResponse["content"]["faqs"])
      : Array.isArray(secondaryContent.faqs)
        ? (secondaryContent.faqs as ErrorPageResponse["content"]["faqs"])
        : payload.content.faqs,
    videos: normalizeVideos(
      Array.isArray(primaryContent.videos)
        ? primaryContent.videos
        : Array.isArray(secondaryContent.videos)
          ? secondaryContent.videos
          : payload.content.videos
    ),
  };

  payload.content = mergedContent as ErrorPageResponse["content"];
  payload.hasVideo = payload.hasVideo || mergedContent.videos.length > 0;

  return payload;
}

export interface SearchErrorsParams {
  q?: string;
  locale?: string;
  limit?: number;
  brand?: string;
  category?: string;
  page?: number;
}

export async function searchErrors(
  params: SearchErrorsParams = {}
): Promise<ErrorListItem[]> {
  try {
    const q = params.q?.trim() ?? "";
    const apiParams: Record<string, string | number> = {
      locale: params.locale ?? "es",
      limit:  params.limit  ?? 200,
    };
    if (q.length >= 2)   apiParams.q        = q;
    if (params.brand)    apiParams.brand     = params.brand;
    if (params.category) apiParams.category  = params.category;
    if (params.page)     apiParams.page      = params.page;

    const { data } = await apiClient.get<ApiEnvelope<SearchData>>("/search", {
      params: apiParams,
    });
    return data.success ? data.data.errors : [];
  } catch {
    return [];
  }
}

export async function getErrorBySlug(
  slug: string,
  locale: string
): Promise<ErrorPageResponse | null> {
  try {
    const { data } = await apiClient.get<ApiEnvelope<ErrorPageResponse>>(
      `/errors/${slug}`,
      { params: { locale } }
    );

    if (!data.success) return null;

    const normalizedData = normalizeErrorPayload(data.data);
    return normalizedData;
  } catch (err) {
    if (err instanceof AxiosError) {
      console.error(
        `[getErrorBySlug] ${err.response?.status ?? 'NO_RESPONSE'} — slug: "${slug}" locale: "${locale}"`,
        err.response?.data ?? err.message
      );
      return null;
    }
    console.error('[getErrorBySlug] unexpected error:', err);
    return null;
  }
}
