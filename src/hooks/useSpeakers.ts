import { useState, useEffect } from 'react';
import type { Speaker } from '../dal/types';
import { IdbSpeakersDal } from '../dal';
import { speakers2025 } from '../data/speakers2025';
import { fetchSessionizeSpeakers } from '../services/sessionize';

const dal = new IdbSpeakersDal();
const CACHE_TTL_MS = 3_600_000; // 1 hour

export function useSpeakers() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cached = await dal.getAllSpeakers();
        const lastFetch = localStorage.getItem('sessionize_speakers_fetched');
        const isStale = !lastFetch || Date.now() - Number(lastFetch) > CACHE_TTL_MS;

        if (cached.length === 0 || isStale) {
          const live = await fetchSessionizeSpeakers();
          if (live.length > 0) {
            await dal.putSpeakers(live);
            localStorage.setItem('sessionize_speakers_fetched', String(Date.now()));
          }
        }
      } catch (err) {
        console.warn('Sessionize speakers fetch failed, using cached/static data:', err);
        const existing = await dal.getAllSpeakers();
        if (existing.length === 0) {
          await dal.putSpeakers(speakers2025);
        }
      }

      const all = await dal.getAllSpeakers();
      if (!cancelled) {
        setSpeakers(all);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const getSpeakerById = (id: string) => speakers.find(s => s.id === id);

  return { speakers, loading, getSpeakerById };
}
