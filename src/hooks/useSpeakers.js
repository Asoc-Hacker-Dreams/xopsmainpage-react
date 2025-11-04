import { useState, useEffect } from 'react';
import DAL from '../data/dal.js';

/**
 * Hook to access speakers data through the DAL
 * @param {Object} filters - Optional filters: { name }
 * @returns {Object} { speakers, loading, error, refetch }
 */
export function useSpeakers(filters = {}) {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSpeakers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DAL.getSpeakers(filters);
      setSpeakers(data);
    } catch (err) {
      console.error('Error fetching speakers:', err);
      setError(err.message || 'Failed to load speakers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakers();
  }, [JSON.stringify(filters)]); // Re-fetch when filters change

  return {
    speakers,
    loading,
    error,
    refetch: fetchSpeakers
  };
}

/**
 * Hook to access a specific speaker by ID or slug
 * @param {string} idOrSlug - Speaker ID or slug
 * @returns {Object} { speaker, loading, error, refetch }
 */
export function useSpeaker(idOrSlug) {
  const [speaker, setSpeaker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSpeaker = async () => {
    if (!idOrSlug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await DAL.getSpeaker(idOrSlug);
      setSpeaker(data);
    } catch (err) {
      console.error('Error fetching speaker:', err);
      setError(err.message || 'Failed to load speaker');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeaker();
  }, [idOrSlug]);

  return {
    speaker,
    loading,
    error,
    refetch: fetchSpeaker
  };
}

export default useSpeakers;
