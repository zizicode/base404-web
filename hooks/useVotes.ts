import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'vimazdev:voted-errors';

export function useVotes() {
  const [votedIds, setVotedIds] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
      const parsed = raw ? (JSON.parse(raw) as number[]) : [];
      setVotedIds(Array.isArray(parsed) ? parsed.filter((id): id is number => typeof id === 'number') : []);
    } catch {
      setVotedIds([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(votedIds));
    } catch {
      // ignore storage errors
    }
  }, [votedIds, hydrated]);

  const hasVoted = useCallback((id: number) => votedIds.includes(id), [votedIds]);

  const addVote = useCallback((id: number) => {
    setVotedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  return { votedIds, hasVoted, addVote, hydrated };
}
