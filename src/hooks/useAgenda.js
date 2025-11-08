import { useState, useEffect, useCallback } from 'react';
import { 
  getAgendaFromDB, 
  saveAgendaToDB, 
  getMetadata, 
  saveMetadata 
} from '../services/agendaDB';

/**
 * Custom hook implementing stale-while-revalidate pattern for agenda data
 * Reads from IndexedDB instantly, then revalidates in the background
 * 
 * @param {string} scheduleUrl - URL to fetch the schedule data
 * @returns {object} - { agenda, loading, error, isStale, lastSync }
 */
export const useAgenda = (scheduleUrl = '/data/schedule.json') => {
  const [agenda, setAgenda] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStale, setIsStale] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  /**
   * Load agenda from IndexedDB immediately
   */
  const loadFromCache = useCallback(async () => {
    try {
      const cachedAgenda = await getAgendaFromDB();
      const cachedLastSync = await getMetadata('lastSyncAt');
      
      if (cachedAgenda && cachedAgenda.length > 0) {
        setAgenda(cachedAgenda);
        setLastSync(cachedLastSync);
        setIsStale(true); // Mark as stale until revalidation
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading from cache:', err);
      setLoading(false);
    }
  }, []);

  /**
   * Fetch fresh data and compare with cached version
   */
  const revalidate = useCallback(async () => {
    try {
      // Try to get ETag or updatedAt from metadata
      const cachedETag = await getMetadata('etag');
      const cachedVersion = await getMetadata('sourceVersion');
      
      // Fetch fresh data
      const response = await fetch(scheduleUrl, {
        headers: cachedETag ? { 'If-None-Match': cachedETag } : {}
      });

      // If 304 Not Modified, data hasn't changed
      if (response.status === 304) {
        setIsStale(false);
        await saveMetadata('lastSyncAt', new Date().toISOString());
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch schedule: ${response.status}`);
      }

      const freshData = await response.json();
      const newETag = response.headers.get('etag');
      
      // Compare data - simple deep comparison
      const hasChanged = await checkIfDataChanged(freshData, cachedVersion);
      
      if (hasChanged) {
        // Update agenda without changing existing ids/slugs
        await saveAgendaToDB(freshData);
        
        // Update metadata
        const now = new Date().toISOString();
        await saveMetadata('lastSyncAt', now);
        await saveMetadata('sourceVersion', JSON.stringify(freshData));
        if (newETag) {
          await saveMetadata('etag', newETag);
        }
        
        // Update state
        setAgenda(freshData);
        setLastSync(now);
      }
      
      setIsStale(false);
    } catch (err) {
      console.error('Error during revalidation:', err);
      setError(err.message);
      setIsStale(false);
    }
  }, [scheduleUrl]);

  /**
   * Check if data has changed by comparing versions
   */
  const checkIfDataChanged = async (freshData, cachedVersion) => {
    if (!cachedVersion) {
      return true; // No cached version, consider as changed
    }
    
    try {
      const cached = JSON.parse(cachedVersion);
      return JSON.stringify(cached) !== JSON.stringify(freshData);
    } catch {
      return true;
    }
  };

  /**
   * Main effect: Load from cache immediately, then revalidate
   */
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      // Step 1: Load from IndexedDB immediately (paint fast)
      await loadFromCache();
      
      // Step 2: Revalidate in parallel (background sync)
      if (mounted) {
        revalidate();
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [loadFromCache, revalidate]);

  return {
    agenda,
    loading,
    error,
    isStale,
    lastSync
  };
};
