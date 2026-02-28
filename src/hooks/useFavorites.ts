import { useState, useEffect, useCallback } from 'react';
import { IdbFavoritesDal } from '../dal';
import type { Favorite } from '../dal/types';

const dal = new IdbFavoritesDal();
const LS_KEY = 'xops-favorites';

function syncToLocalStorage(favs: Favorite[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(favs.map(f => f.talkId)));
  } catch { /* quota */ }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const favs = await dal.getFavorites();
    setFavorites(favs);
    syncToLocalStorage(favs);
    setLoading(false);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const toggleFavorite = useCallback(async (talkId: string) => {
    const isFav = await dal.isFavorite(talkId);
    if (isFav) {
      await dal.removeFavorite(talkId);
    } else {
      await dal.addFavorite(talkId);
    }
    await reload();
  }, [reload]);

  const isFavorite = useCallback((talkId: string) => {
    return favorites.some(f => f.talkId === talkId);
  }, [favorites]);

  return { favorites, loading, toggleFavorite, isFavorite };
}
