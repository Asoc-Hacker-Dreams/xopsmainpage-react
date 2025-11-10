/**
 * Example: Using IndexedDB with Dexie in the X-Ops Conference App
 * 
 * This file demonstrates how to integrate the database with the existing
 * schedule data and use it throughout the application.
 */

import { db } from './db';
import { populateDatabase, isDatabaseEmpty, getDatabaseStats } from './dbUtils';
import scheduleData from './schedule2025.json';

/**
 * Initialize the database on app startup
 * This should be called in the main App component or in a useEffect
 */
export async function initializeDatabase() {
  try {
    // Check if database is empty (first time load or after cache clear)
    const isEmpty = await isDatabaseEmpty();
    
    if (isEmpty) {
      console.log('Initializing database with schedule data...');
      await populateDatabase(scheduleData);
      
      const stats = await getDatabaseStats();
      console.log('Database initialized:', stats);
    } else {
      console.log('Database already populated');
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
    // Fallback to using JSON data directly if database fails
  }
}

/**
 * Example: Get today's schedule
 */
export async function getTodaySchedule() {
  const today = new Date().toISOString().split('T')[0];
  return await db.getTalksByDay(today);
}

/**
 * Example: Get schedule for a specific day
 */
export async function getScheduleForDay(date: string) {
  // date format: '2025-11-21'
  return await db.getTalksByDay(date);
}

/**
 * Example: Get all talks for a specific track
 */
export async function getTrackSchedule(trackName: string) {
  return await db.getTalksByTrack(trackName);
}

/**
 * Example: Get all talks in a specific room
 */
export async function getRoomSchedule(roomName: string) {
  return await db.getTalksByRoom(roomName);
}

/**
 * Example: Search for talks by keyword
 */
export async function searchTalks(keyword: string) {
  const allTalks = await db.talks.toArray();
  const lowerKeyword = keyword.toLowerCase();
  
  return allTalks.filter(talk => 
    talk.talk?.toLowerCase().includes(lowerKeyword) ||
    talk.description?.toLowerCase().includes(lowerKeyword) ||
    talk.speaker?.toLowerCase().includes(lowerKeyword)
  );
}

/**
 * Example: Get user's favorite talks
 */
export async function getUserFavorites() {
  return await db.getFavorites();
}

/**
 * Example: Toggle favorite status for a talk
 */
export async function toggleFavorite(talkId: string) {
  const isFav = await db.isFavorite(talkId);
  
  if (isFav) {
    await db.removeFavorite(talkId);
    return false;
  } else {
    await db.addFavorite(talkId);
    return true;
  }
}

/**
 * Example: Schedule a reminder 15 minutes before a talk
 */
export async function scheduleReminder(talkId: string, talkStartTime: string) {
  // Parse the talk start time (format: "2025-11-21T09:30")
  const startDate = new Date(talkStartTime);
  
  // Schedule notification 15 minutes before
  const notifyDate = new Date(startDate.getTime() - 15 * 60 * 1000);
  
  await db.scheduleNotification(talkId, notifyDate);
}

/**
 * Example: Get all upcoming reminders
 */
export async function getUpcomingReminders() {
  const now = new Date();
  const allNotifications = await db.getScheduledNotifications();
  
  return allNotifications.filter(notif => notif.notifyAt > now);
}

/**
 * Example: Check and process pending notifications
 * This would typically be called by a service worker or background task
 */
export async function processPendingNotifications() {
  const pending = await db.getPendingNotifications();
  
  for (const notification of pending) {
    const talk = await db.getTalkById(notification.talkId);
    
    if (talk) {
      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`Próximamente: ${talk.talk}`, {
          body: `Comienza en 15 minutos - ${talk.room}`,
          icon: '/icon-512x512.png',
          badge: '/icon-512x512.png'
        });
      }
      
      // Remove the processed notification
      await db.removeNotification(notification.talkId);
    }
  }
}

/**
 * Example: Get statistics for the dashboard
 */
export async function getDashboardStats() {
  const stats = await getDatabaseStats();
  const favorites = await db.getFavorites();
  const reminders = await getUpcomingReminders();
  
  return {
    totalTalks: stats.talks,
    totalSpeakers: stats.speakers,
    myFavorites: favorites.length,
    upcomingReminders: reminders.length
  };
}

/**
 * Example: React Hook to use the database
 * 
 * Usage in a component:
 * 
 * import { useTalks } from './examples';
 * 
 * function ScheduleComponent() {
 *   const { talks, loading, error } = useTalks('2025-11-21');
 *   
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   
 *   return (
 *     <div>
 *       {talks.map(talk => (
 *         <div key={talk.id}>
 *           <h3>{talk.talk}</h3>
 *           <p>{talk.speaker}</p>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 */
import { useState, useEffect } from 'react';

export function useTalks(day?: string) {
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTalks() {
      try {
        setLoading(true);
        
        let data;
        if (day) {
          data = await db.getTalksByDay(day);
        } else {
          data = await db.talks.toArray();
        }
        
        setTalks(data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    loadTalks();
  }, [day]);

  return { talks, loading, error };
}

/**
 * Example: React Hook for favorites
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    setLoading(true);
    const favs = await db.getFavorites();
    setFavorites(favs);
    setLoading(false);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const addFavorite = async (talkId: string) => {
    await db.addFavorite(talkId);
    await loadFavorites();
  };

  const removeFavorite = async (talkId: string) => {
    await db.removeFavorite(talkId);
    await loadFavorites();
  };

  const isFavorite = (talkId: string) => {
    return favorites.some(fav => fav.id === talkId);
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite
  };
}

/**
 * Example: Service Worker Integration
 * 
 * Add this to your service worker to sync data in the background:
 * 
 * self.addEventListener('sync', async (event) => {
 *   if (event.tag === 'sync-schedule') {
 *     event.waitUntil(
 *       fetch('/api/schedule')
 *         .then(response => response.json())
 *         .then(data => populateDatabase(data))
 *     );
 *   }
 * });
 */

/**
 * Example: Offline-first strategy
 * 
 * Always try to load from IndexedDB first, then update from network
 */
export async function getScheduleOfflineFirst(day: string) {
  // Try to get from IndexedDB first
  let talks = await db.getTalksByDay(day);
  
  // If found in database, return immediately
  if (talks.length > 0) {
    // Optionally, fetch fresh data in the background to update
    fetch('/api/schedule')
      .then(response => response.json())
      .then(data => populateDatabase(data))
      .catch(err => console.log('Background sync failed:', err));
    
    return talks;
  }
  
  // If not in database, fetch from network
  try {
    const response = await fetch('/api/schedule');
    const data = await response.json();
    await populateDatabase(data);
    talks = await db.getTalksByDay(day);
    return talks;
  } catch (error) {
    console.error('Failed to fetch schedule:', error);
    return [];
  }
}
