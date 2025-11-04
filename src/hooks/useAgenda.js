import { useState, useEffect, useMemo } from 'react';
import DAL from '../data/dal.js';

/**
 * Hook to access agenda/schedule data through the DAL
 * @param {Object} filters - Optional filters: { day, track, type, room }
 * @returns {Object} { talks, loading, error, refetch }
 */
export function useAgenda(filters = {}) {
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => filters, [
    filters.day,
    filters.track,
    filters.type,
    filters.room
  ]);

  const fetchAgenda = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DAL.getAgenda(memoizedFilters);
      setTalks(data);
    } catch (err) {
      console.error('Error fetching agenda:', err);
      setError(err.message || 'Failed to load agenda');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgenda();
  }, [memoizedFilters]); // Use memoized filters

  return {
    talks,
    loading,
    error,
    refetch: fetchAgenda
  };
}

/**
 * Hook to access a specific talk by ID or slug
 * @param {string} idOrSlug - Talk ID or slug
 * @returns {Object} { talk, loading, error, refetch }
 */
export function useTalk(idOrSlug) {
  const [talk, setTalk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTalk = async () => {
    if (!idOrSlug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await DAL.getTalk(idOrSlug);
      setTalk(data);
    } catch (err) {
      console.error('Error fetching talk:', err);
      setError(err.message || 'Failed to load talk');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTalk();
  }, [idOrSlug]);

  return {
    talk,
    loading,
    error,
    refetch: fetchTalk
  };
}

export default useAgenda;
