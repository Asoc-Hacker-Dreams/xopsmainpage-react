import { db, Talk, Speaker, TalkSpeaker } from './db';

/**
 * Utility functions for populating the database with schedule data
 */

/**
 * Parse schedule data and convert to Talk format
 */
export function parseScheduleToTalks(scheduleData: any[]): Talk[] {
  return scheduleData.map((item, index) => {
    // Extract day from timeISO (format: "2025-11-21T09:30")
    const day = item.timeISO ? item.timeISO.split('T')[0] : '';
    
    // Extract time components
    const startTime = item.timeISO ? item.timeISO.split('T')[1] : '';
    const endTimeDate = item.timeISO && item.durationMinutes 
      ? new Date(item.timeISO)
      : null;
    
    if (endTimeDate && item.durationMinutes) {
      endTimeDate.setMinutes(endTimeDate.getMinutes() + item.durationMinutes);
    }
    
    const endTime = endTimeDate 
      ? `${String(endTimeDate.getHours()).padStart(2, '0')}:${String(endTimeDate.getMinutes()).padStart(2, '0')}`
      : '';

    // Generate slug from talk title
    const slug = item.talk 
      ? item.talk
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove accents
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      : `talk-${index}`;

    return {
      id: `talk-${index}`,
      day,
      track: item.track || 'main',
      room: item.room || '',
      startTime,
      endTime,
      slug,
      speaker: item.speaker,
      talk: item.talk,
      description: item.description,
      timeISO: item.timeISO,
      durationMinutes: item.durationMinutes,
      durationHuman: item.durationHuman,
      type: item.type
    };
  });
}

/**
 * Parse schedule data and extract unique speakers
 */
export function parseScheduleToSpeakers(scheduleData: any[]): Speaker[] {
  const speakerMap = new Map<string, Speaker>();

  scheduleData.forEach((item, index) => {
    if (item.speaker) {
      // Generate speaker ID from name
      const speakerId = item.speaker
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Generate slug (same as ID for simplicity)
      const slug = speakerId;

      if (!speakerMap.has(speakerId)) {
        speakerMap.set(speakerId, {
          id: speakerId,
          slug,
          name: item.speaker
        });
      }
    }
  });

  return Array.from(speakerMap.values());
}

/**
 * Create talk-speaker relationships
 */
export function createTalkSpeakerRelations(
  talks: Talk[],
  speakers: Speaker[]
): TalkSpeaker[] {
  const relations: TalkSpeaker[] = [];
  const speakerNameToId = new Map(speakers.map(s => [s.name, s.id]));

  talks.forEach(talk => {
    if (talk.speaker) {
      const speakerId = speakerNameToId.get(talk.speaker);
      if (speakerId) {
        relations.push({
          talkId: talk.id,
          speakerId
        });
      }
    }
  });

  return relations;
}

/**
 * Populate the database with schedule data
 * This function will clear existing data and repopulate
 */
export async function populateDatabase(scheduleData: any[]): Promise<void> {
  try {
    // Parse the data
    const talks = parseScheduleToTalks(scheduleData);
    const speakers = parseScheduleToSpeakers(scheduleData);
    const talkSpeakers = createTalkSpeakerRelations(talks, speakers);

    // Clear existing data
    await db.clearAll();

    // Bulk insert data
    await db.transaction('rw', [db.talks, db.speakers, db.talkSpeakers], async () => {
      await db.talks.bulkAdd(talks);
      await db.speakers.bulkAdd(speakers);
      await db.talkSpeakers.bulkAdd(talkSpeakers);
    });

    console.log(`Database populated with ${talks.length} talks and ${speakers.length} speakers`);
  } catch (error) {
    console.error('Error populating database:', error);
    throw error;
  }
}

/**
 * Check if database is empty
 */
export async function isDatabaseEmpty(): Promise<boolean> {
  const talkCount = await db.talks.count();
  return talkCount === 0;
}

/**
 * Get database statistics
 */
export async function getDatabaseStats() {
  const [talksCount, speakersCount, favoritesCount, notificationsCount] = await Promise.all([
    db.talks.count(),
    db.speakers.count(),
    db.favorites.count(),
    db.notifSchedule.count()
  ]);

  return {
    talks: talksCount,
    speakers: speakersCount,
    favorites: favoritesCount,
    notifications: notificationsCount
  };
}

/**
 * Export all data from the database
 */
export async function exportData() {
  const [talks, speakers, talkSpeakers, favorites, notifications] = await Promise.all([
    db.talks.toArray(),
    db.speakers.toArray(),
    db.talkSpeakers.toArray(),
    db.favorites.toArray(),
    db.notifSchedule.toArray()
  ]);

  return {
    talks,
    speakers,
    talkSpeakers,
    favorites,
    notifications,
    exportedAt: new Date().toISOString()
  };
}

/**
 * Import data into the database
 */
export async function importData(data: {
  talks: Talk[];
  speakers: Speaker[];
  talkSpeakers: TalkSpeaker[];
  favorites?: any[];
  notifications?: any[];
}) {
  await db.transaction('rw', [
    db.talks,
    db.speakers,
    db.talkSpeakers,
    db.favorites,
    db.notifSchedule
  ], async () => {
    // Clear existing data
    await db.clearAll();

    // Import new data
    await db.talks.bulkAdd(data.talks);
    await db.speakers.bulkAdd(data.speakers);
    await db.talkSpeakers.bulkAdd(data.talkSpeakers);

    if (data.favorites && data.favorites.length > 0) {
      await db.favorites.bulkAdd(data.favorites);
    }

    if (data.notifications && data.notifications.length > 0) {
      await db.notifSchedule.bulkAdd(data.notifications);
    }
  });
}
