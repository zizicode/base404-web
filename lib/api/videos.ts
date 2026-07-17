import type { VideoEmbed } from './types';

function normalizeLanguage(value: unknown): string {
  if (typeof value !== 'string') return 'es';

  const normalized = value.trim().toLowerCase();
  if (normalized === 'en' || normalized === 'english' || normalized === 'ingles' || normalized === 'inglés') {
    return 'en';
  }

  if (normalized === 'es' || normalized === 'spanish' || normalized === 'español') {
    return 'es';
  }

  return normalized || 'es';
}

export function normalizeVideo(video: Record<string, unknown>): VideoEmbed | null {
  const title = typeof video.title === 'string' && video.title.trim() ? video.title.trim() : 'Video explicativo';

  const youtubeId = typeof video.youtubeId === 'string' && video.youtubeId.trim()
    ? video.youtubeId.trim()
    : typeof video.youtube_id === 'string' && video.youtube_id.trim()
      ? video.youtube_id.trim()
      : null;

  const embedUrl = typeof video.embedUrl === 'string' && video.embedUrl.trim()
    ? video.embedUrl.trim()
    : typeof video.embed_url === 'string' && video.embed_url.trim()
      ? video.embed_url.trim()
      : youtubeId
        ? `https://www.youtube.com/embed/${youtubeId}`
        : null;

  const thumbnailUrl = typeof video.thumbnailUrl === 'string' && video.thumbnailUrl.trim()
    ? video.thumbnailUrl.trim()
    : typeof video.thumbnail_url === 'string' && video.thumbnail_url.trim()
      ? video.thumbnail_url.trim()
      : youtubeId
        ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
        : '';

  if (!youtubeId && !embedUrl) {
    return null;
  }

  return {
    title,
    youtubeId: youtubeId ?? '',
    language: normalizeLanguage(video.language),
    embedUrl: embedUrl ?? '',
    thumbnailUrl,
  };
}

export function normalizeVideos(videos: unknown): VideoEmbed[] {
  if (!Array.isArray(videos)) return [];

  return videos
    .map((video) => (video && typeof video === 'object' ? normalizeVideo(video as Record<string, unknown>) : null))
    .filter((video): video is VideoEmbed => Boolean(video));
}

export function getPreferredVideos(videos: VideoEmbed[], locale: string): VideoEmbed[] {
  const preferredLanguage = locale === 'en' ? 'en' : 'es';
  const localizedVideos = videos.filter((video) => normalizeLanguage(video.language) === preferredLanguage);

  return localizedVideos.length > 0 ? localizedVideos : videos;
}

export function selectVideo(videos: VideoEmbed[], selectedVideoId?: string | string[]): VideoEmbed | null {
  if (videos.length === 0) return null;

  const requestedVideoId = Array.isArray(selectedVideoId) ? selectedVideoId[0] : selectedVideoId;

  if (requestedVideoId) {
    const match = videos.find((video) => video.youtubeId === requestedVideoId);
    if (match) return match;
  }

  return videos[0];
}
