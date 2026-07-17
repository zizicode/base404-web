'use client';

import { useMemo, useState } from 'react';
import type { VideoEmbed } from '@/lib/api/types';
import styles from './ErrorVideoSelector.module.scss';

interface ErrorVideoSelectorProps {
  videos: VideoEmbed[];
  initialVideoId?: string;
}

export default function ErrorVideoSelector({ videos, initialVideoId }: ErrorVideoSelectorProps) {
  const [selectedVideoId, setSelectedVideoId] = useState<string | undefined>(initialVideoId ?? videos[0]?.youtubeId ?? '');

  const activeVideo = useMemo(() => {
    if (videos.length === 0) return null;

    return videos.find((video) => video.youtubeId === selectedVideoId) ?? videos[0] ?? null;
  }, [selectedVideoId, videos]);

  if (!activeVideo) return null;

  return (
    <div className={styles.wrapper}>
      {videos.length > 1 && (
        <div className={styles.videoSelector} role="tablist" aria-label="Seleccionar video">
          {videos.map((video) => {
            const isActive = activeVideo.youtubeId === video.youtubeId;
            const buttonKey = video.youtubeId || `${video.title}-${video.language}`;

            return (
              <button
                key={buttonKey}
                type="button"
                className={`${styles.videoOption} ${isActive ? styles.videoOptionActive : ''}`.trim()}
                onClick={() => setSelectedVideoId(video.youtubeId || buttonKey)}
                aria-pressed={isActive}
              >
                {video.title}
                {video.language ? ` · ${video.language.toUpperCase()}` : ''}
              </button>
            );
          })}
        </div>
      )}

      <div className={styles.videoGrid}>
        <div className={styles.videoWrap}>
          <iframe
            src={activeVideo.embedUrl}
            title={activeVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={styles.videoFrame}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
