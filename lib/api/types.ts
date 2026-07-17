/** Envelope genérico que usa la API */
export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  deviceType: string;
  icon: string;
}

export interface SuggestItem {
  slug: string;
  errorCode: string;
  title: string;
  brandName: string;
}

export interface ErrorListItem {
  id: number;
  slug: string;
  title: string;
  errorCode: string;
  model: string | null;
  brandName: string;
  categoryName: string;
  similarity?: number;
}

export interface ErrorsListItem {
  id: number;
  slug: string;
  title: string;
  errorCode: string;
  model: string | null;
  views: number;
  updatedAt: string;
}

export interface ErrorsListResult {
  items: ErrorsListItem[];
  hasMore: boolean;
  nextCursor: string | null;
}

export type AnyErrorItem = ErrorListItem | ErrorsListItem;

export interface SearchBrandItem {
  id: number;
  name: string;
  slug: string;
  logoUrl: string | null;
}

export interface SearchCategoryItem {
  id: number;
  name: string;
  slug: string;
}

export interface SearchData {
  query: string;
  locale: string;
  errors: ErrorListItem[];
  brands: SearchBrandItem[];
  categories: SearchCategoryItem[];
  tookMs: number;
}

export interface HowToStep {
  step: number;
  title: string;
  description: string;
  imageUrl: string | null;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface VideoEmbed {
  title: string;
  youtubeId: string;
  language: string;
  embedUrl: string;
  thumbnailUrl: string;
}

export interface ErrorPageResponse {
  id: number;
  slug: string;
  locale: "es" | "en";
  errorCode: string;
  model: string | null;
  brand: { name: string; slug: string; logoUrl: string | null };
  category: { name: string; slug: string };
  seo: {
    title: string;
    metaDescription: string;
    canonicalUrl: string;
    og: { title: string; description: string; image: string };
    schemaJsonLd: Record<string, unknown>;
    robots: string;
  };
  hreflangAlternates: { locale: "es" | "en"; url: string }[];
  content: {
    summary: string;
    markdownSolutions: string;
    causes: string[];
    stepsHowTo: HowToStep[];
    faqs: Faq[];
    videos: VideoEmbed[];
  };
  hasVideo: boolean;
  engagement: { views: number; helpfulVotes: number; unhelpfulVotes: number };
  relatedErrors: {
    slug: string;
    errorCode: string;
    title: string;
    brandName: string;
    categoryName: string;
  }[];
  isIndexable: boolean;
  status: "draft" | "published" | "archived" | "flagged";
  updatedAt: string;
}
