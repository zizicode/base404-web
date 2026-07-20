'use client';

import { useEffect, useState, useCallback } from 'react';
import { Eye, ThumbsUp } from 'lucide-react';
import { useVotes } from '@/hooks/useVotes';
import styles from './ErrorEngagement.module.scss';

interface ErrorEngagementProps {
  errorId: number;
  slug: string;
  locale: string;
  initialViews: number;
  initialVotes: number;
  viewLabel: string;
  helpfulLabel: string;
  voteLabel: string;
  votedLabel: string;
}

export default function ErrorEngagement({
  errorId,
  slug,
  locale,
  initialViews,
  initialVotes,
  viewLabel,
  helpfulLabel,
  voteLabel,
  votedLabel,
}: ErrorEngagementProps) {
  const { hasVoted, addVote, hydrated } = useVotes();
  const [views, setViews] = useState(initialViews);
  const [votes, setVotes] = useState(initialVotes);
  const [isVoting, setIsVoting] = useState(false);
  const [viewTracked, setViewTracked] = useState(false);
  const alreadyVoted = hydrated ? hasVoted(errorId) : false;

  useEffect(() => {
    if (viewTracked) return;

    fetch(`/api/errors/${encodeURIComponent(slug)}/view?locale=${locale}`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.views === 'number') {
          setViews(data.views);
        }
      })
      .catch(() => null)
      .finally(() => setViewTracked(true));
  }, [slug, locale, viewTracked]);

  const handleVote = useCallback(async () => {
    if (alreadyVoted || isVoting) return;

    setIsVoting(true);
    try {
      const res = await fetch(`/api/errors/${encodeURIComponent(slug)}/vote?locale=${locale}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setVotes((prev) => prev + 1);
        addVote(errorId);
      }
    } finally {
      setIsVoting(false);
    }
  }, [alreadyVoted, isVoting, slug, locale, errorId, addVote]);

  return (
    <div className={styles.engagement}>
      <span className={styles.engageStat}>
        <Eye size={14} aria-hidden="true" />
        {views.toLocaleString()} {viewLabel}
      </span>

      <button
        type="button"
        className={`${styles.voteBtn} ${alreadyVoted ? styles.voteBtnActive : ''}`}
        onClick={handleVote}
        disabled={alreadyVoted || isVoting || !hydrated}
        aria-pressed={alreadyVoted}
        aria-label={alreadyVoted ? votedLabel : voteLabel}
      >
        <ThumbsUp size={14} aria-hidden="true" />
        <span>{votes.toLocaleString()} {helpfulLabel}</span>
        {alreadyVoted && <span className={styles.votedTag}>{votedLabel}</span>}
      </button>
    </div>
  );
}
