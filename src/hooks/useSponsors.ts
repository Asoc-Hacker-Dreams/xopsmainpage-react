import { useState, useEffect, useMemo } from 'react';
import type { Sponsor } from '../dal/types';
import { IdbSponsorsDal } from '../dal/idb-dal';
import { sponsors as seedSponsors } from '../dal/sponsors';

const dal = new IdbSponsorsDal();

export interface SponsorFilters {
  tier?: Sponsor['tier'] | 'all';
  search?: string;
}

export function useSponsors(filters: SponsorFilters = {}) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const existing = await dal.getAllSponsors();
      if (existing.length === 0) {
        await dal.putSponsors(seedSponsors);
      }
      const all = await dal.getAllSponsors();
      if (!cancelled) {
        setSponsors(all);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    let result = sponsors;
    if (filters.tier && filters.tier !== 'all') {
      result = result.filter(s => s.tier === filters.tier);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        (s.description?.toLowerCase().includes(q))
      );
    }
    return result;
  }, [sponsors, filters.tier, filters.search]);

  const byTier = useMemo(() => {
    return sponsors.reduce((acc, sponsor) => {
      if (!acc[sponsor.tier]) acc[sponsor.tier] = [];
      acc[sponsor.tier].push(sponsor);
      return acc;
    }, {} as Record<Sponsor['tier'], Sponsor[]>);
  }, [sponsors]);

  const tiers = useMemo(() => {
    const order = { platinum: 1, gold: 2, silver: 3, bronze: 4, community: 5 } as const;
    return [...new Set(sponsors.map(s => s.tier))].sort(
      (a, b) => order[a] - order[b]
    );
  }, [sponsors]);

  const getSponsorById = (id: string) => sponsors.find(s => s.id === id);

  return { sponsors: filtered, loading, byTier, tiers, getSponsorById };
}
