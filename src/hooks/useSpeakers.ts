import { useState, useEffect } from 'react';
import type { Speaker } from '../dal/types';
import { IdbSpeakersDal } from '../dal';
import { speakers2025 } from '../data/speakers2025';

const dal = new IdbSpeakersDal();

export function useSpeakers() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const existing = await dal.getAllSpeakers();
      if (existing.length === 0) {
        await dal.putSpeakers(speakers2025);
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
