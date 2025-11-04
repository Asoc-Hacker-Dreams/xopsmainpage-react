import Dexie, { Table } from 'dexie';

// Type definitions for database tables
export interface Talk {
  id: string;
  day: string; // e.g., '2025-11-21'
  track: string;
  room: string;
  startTime: string;
  endTime: string;
  slug: string;
  // Additional fields from schedule data
  speaker?: string;
  talk?: string;
  description?: string;
  timeISO?: string;
  durationMinutes?: number;
  durationHuman?: string;
  type?: string;
}

export interface Speaker {
  id: string;
  slug: string;
  name: string;
  // Additional fields
  bio?: string;
  image?: string;
  company?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface TalkSpeaker {
  talkId: string;
  speakerId: string;
}

export interface Favorite {
  id?: number; // Auto-incremented
  talkId: string;
  addedAt: Date;
}

export interface NotifSchedule {
  talkId: string;
  notifyAt: Date;
}

// Database class extending Dexie
export class XOpsDatabase extends Dexie {
  // Declare table types
  talks!: Table<Talk, string>;
  speakers!: Table<Speaker, string>;
  talkSpeakers!: Table<TalkSpeaker, [string, string]>;
  favorites!: Table<Favorite, number>;
  notifSchedule!: Table<NotifSchedule, string>;

  constructor() {
    super('XOpsDatabase');
    
    // Define schema with versioned migrations
    this.version(1).stores({
      talks: 'id, day, track, room, startTime, endTime, slug',
      speakers: 'id, slug, name',
      talkSpeakers: '[talkId+speakerId], talkId, speakerId',
      favorites: '++id, talkId, addedAt',
      notifSchedule: 'talkId, notifyAt'
    });
  }

  /**
   * Clear all data from the database
   */
  async clearAll(): Promise<void> {
    await this.transaction('rw', [
      this.talks,
      this.speakers,
      this.talkSpeakers,
      this.favorites,
      this.notifSchedule
    ], async () => {
      await this.talks.clear();
      await this.speakers.clear();
      await this.talkSpeakers.clear();
      await this.favorites.clear();
      await this.notifSchedule.clear();
    });
  }

  /**
   * Get talks filtered by day with optimized query
   */
  async getTalksByDay(day: string): Promise<Talk[]> {
    return await this.talks.where('day').equals(day).toArray();
  }

  /**
   * Get talks filtered by track
   */
  async getTalksByTrack(track: string): Promise<Talk[]> {
    return await this.talks.where('track').equals(track).toArray();
  }

  /**
   * Get talks filtered by room
   */
  async getTalksByRoom(room: string): Promise<Talk[]> {
    return await this.talks.where('room').equals(room).toArray();
  }

  /**
   * Get a single talk by ID
   */
  async getTalkById(id: string): Promise<Talk | undefined> {
    return await this.talks.get(id);
  }

  /**
   * Get a single talk by slug
   */
  async getTalkBySlug(slug: string): Promise<Talk | undefined> {
    return await this.talks.where('slug').equals(slug).first();
  }

  /**
   * Get speakers for a specific talk
   */
  async getSpeakersForTalk(talkId: string): Promise<Speaker[]> {
    const talkSpeakers = await this.talkSpeakers
      .where('talkId')
      .equals(talkId)
      .toArray();
    
    const speakerIds = talkSpeakers.map(ts => ts.speakerId);
    return await this.speakers.bulkGet(speakerIds).then(speakers => 
      speakers.filter((s): s is Speaker => s !== undefined)
    );
  }

  /**
   * Get talks for a specific speaker
   */
  async getTalksForSpeaker(speakerId: string): Promise<Talk[]> {
    const talkSpeakers = await this.talkSpeakers
      .where('speakerId')
      .equals(speakerId)
      .toArray();
    
    const talkIds = talkSpeakers.map(ts => ts.talkId);
    return await this.talks.bulkGet(talkIds).then(talks => 
      talks.filter((t): t is Talk => t !== undefined)
    );
  }

  /**
   * Add a talk to favorites
   */
  async addFavorite(talkId: string): Promise<number> {
    // Check if already favorited
    const existing = await this.favorites.where('talkId').equals(talkId).first();
    if (existing) {
      return existing.id!;
    }
    return await this.favorites.add({
      talkId,
      addedAt: new Date()
    });
  }

  /**
   * Remove a talk from favorites
   */
  async removeFavorite(talkId: string): Promise<void> {
    await this.favorites.where('talkId').equals(talkId).delete();
  }

  /**
   * Get all favorite talks
   */
  async getFavorites(): Promise<Talk[]> {
    const favorites = await this.favorites.orderBy('addedAt').reverse().toArray();
    const talkIds = favorites.map(f => f.talkId);
    return await this.talks.bulkGet(talkIds).then(talks => 
      talks.filter((t): t is Talk => t !== undefined)
    );
  }

  /**
   * Check if a talk is favorited
   */
  async isFavorite(talkId: string): Promise<boolean> {
    const count = await this.favorites.where('talkId').equals(talkId).count();
    return count > 0;
  }

  /**
   * Schedule a notification for a talk
   */
  async scheduleNotification(talkId: string, notifyAt: Date): Promise<void> {
    await this.notifSchedule.put({
      talkId,
      notifyAt
    });
  }

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications(): Promise<NotifSchedule[]> {
    return await this.notifSchedule.orderBy('notifyAt').toArray();
  }

  /**
   * Get pending notifications (notifications that should have already triggered)
   */
  async getPendingNotifications(): Promise<NotifSchedule[]> {
    const now = new Date();
    return await this.notifSchedule
      .where('notifyAt')
      .below(now)
      .toArray();
  }

  /**
   * Remove a scheduled notification
   */
  async removeNotification(talkId: string): Promise<void> {
    await this.notifSchedule.delete(talkId);
  }
}

// Create and export a singleton instance
export const db = new XOpsDatabase();

// Export default for convenience
export default db;
