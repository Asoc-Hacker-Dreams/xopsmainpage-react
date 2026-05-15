import { useState, useEffect, useMemo } from 'react';
import type { Talk } from '../dal/types';
import { IdbAgendaDal } from '../dal';
import { talks2025 } from '../data/talks2025';
import { fetchSessionizeTalks } from '../services/sessionize';

export interface AgendaFilters {
  day?: string;
  track?: string;
  room?: string;
  search?: string;
}

const dal = new IdbAgendaDal();
const CACHE_TTL_MS = 3_600_000; // 1 hour

export function useAgenda(filters: AgendaFilters = {}) {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cached = await dal.getAllTalks();
        const lastFetch = localStorage.getItem('sessionize_talks_fetched');
        const isStale = !lastFetch || Date.now() - Number(lastFetch) > CACHE_TTL_MS;

        if (cached.length === 0 || isStale) {
          const live = await fetchSessionizeTalks();
          if (live.length > 0) {
            await dal.putTalks(live);
            localStorage.setItem('sessionize_talks_fetched', String(Date.now()));
          }
        }
      } catch (err) {
        console.warn('Sessionize talks fetch failed, using cached/static data:', err);
        const existing = await dal.getAllTalks();
        if (existing.length === 0) {
          await dal.putTalks(talks2025);
        }
      }

      const all = await dal.getAllTalks();
      if (!cancelled) {
        setTalks(all);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    let result = talks;
    if (filters.day) result = result.filter(t => t.day === filters.day);
    if (filters.track) result = result.filter(t => t.track === filters.track);
    if (filters.room) result = result.filter(t => t.room === filters.room);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description?.toLowerCase().includes(q))
      );
    }
    return result.sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [talks, filters.day, filters.track, filters.room, filters.search]);

  const days = useMemo(() => [...new Set(talks.map(t => t.day))].sort(), [talks]);
  const tracks = useMemo(() => [...new Set(talks.map(t => t.track))].sort(), [talks]);
  const rooms = useMemo(() => [...new Set(talks.map(t => t.room))].sort(), [talks]);

  return { talks: filtered, loading, days, tracks, rooms };
}
