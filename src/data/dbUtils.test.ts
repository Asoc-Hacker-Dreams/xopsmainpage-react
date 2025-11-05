import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db, XOpsDatabase } from '../data/db';
import {
  parseScheduleToTalks,
  parseScheduleToSpeakers,
  createTalkSpeakerRelations,
  populateDatabase,
  isDatabaseEmpty,
  getDatabaseStats,
  exportData,
  importData
} from '../data/dbUtils';

describe('Database Utilities', () => {
  let testDb: XOpsDatabase;

  const sampleScheduleData = [
    {
      speaker: 'Juan Vicente Herrera Ruiz de Alejo',
      talk: 'Keynote de Bienvenida - X-Ops Conference Madrid 2025',
      description: 'Bienvenida oficial',
      timeRaw: '2025-11-21 09:30:00',
      timeISO: '2025-11-21T09:30',
      durationMinutes: 30,
      durationHuman: '30m',
      room: 'Aula magna',
      type: 'keynote',
      track: 'main'
    },
    {
      speaker: 'Luis Guirigay',
      talk: 'Keynote del track exclusivo de AWS',
      description: 'Track AWS',
      timeRaw: '2025-11-21 10:30:00',
      timeISO: '2025-11-21T10:30',
      durationMinutes: 30,
      durationHuman: '30m',
      room: 'Hyperscalers',
      type: 'keynote',
      track: 'hyperscalers'
    }
  ];

  beforeEach(async () => {
    testDb = new XOpsDatabase();
    await testDb.open();
  });

  afterEach(async () => {
    await testDb.delete();
    await testDb.close();
  });

  describe('parseScheduleToTalks', () => {
    it('should parse schedule data into Talk objects', () => {
      const talks = parseScheduleToTalks(sampleScheduleData);

      expect(talks).toHaveLength(2);
      expect(talks[0]).toMatchObject({
        day: '2025-11-21',
        track: 'main',
        room: 'Aula magna',
        startTime: '09:30',
        speaker: 'Juan Vicente Herrera Ruiz de Alejo'
      });
    });

    it('should generate slugs from talk titles', () => {
      const talks = parseScheduleToTalks(sampleScheduleData);

      expect(talks[0].slug).toBe('keynote-de-bienvenida-x-ops-conference-madrid-2025');
      expect(talks[1].slug).toBe('keynote-del-track-exclusivo-de-aws');
    });

    it('should calculate end times based on duration', () => {
      const talks = parseScheduleToTalks(sampleScheduleData);

      expect(talks[0].endTime).toBe('10:00');
      expect(talks[1].endTime).toBe('11:00');
    });
  });

  describe('parseScheduleToSpeakers', () => {
    it('should extract unique speakers', () => {
      const speakers = parseScheduleToSpeakers(sampleScheduleData);

      expect(speakers).toHaveLength(2);
      expect(speakers.map(s => s.name)).toContain('Juan Vicente Herrera Ruiz de Alejo');
      expect(speakers.map(s => s.name)).toContain('Luis Guirigay');
    });

    it('should not create duplicate speakers', () => {
      const dataWithDuplicate = [
        ...sampleScheduleData,
        {
          ...sampleScheduleData[0],
          talk: 'Another talk by same speaker'
        }
      ];

      const speakers = parseScheduleToSpeakers(dataWithDuplicate);

      expect(speakers).toHaveLength(2);
    });

    it('should generate speaker IDs from names', () => {
      const speakers = parseScheduleToSpeakers(sampleScheduleData);

      expect(speakers[0].id).toBe('juan-vicente-herrera-ruiz-de-alejo');
      expect(speakers[1].id).toBe('luis-guirigay');
    });

    it('should split multiple speakers separated by commas', () => {
      const dataWithMultipleSpeakers = [
        {
          speaker: 'Antonio Berben, Felipe Vicens',
          talk: 'Multi-speaker talk',
          description: 'Talk with two speakers',
          timeISO: '2025-11-21T10:00',
          durationMinutes: 45,
          room: 'Main Room',
          track: 'main'
        }
      ];

      const speakers = parseScheduleToSpeakers(dataWithMultipleSpeakers);

      expect(speakers).toHaveLength(2);
      expect(speakers.map(s => s.name)).toContain('Antonio Berben');
      expect(speakers.map(s => s.name)).toContain('Felipe Vicens');
      expect(speakers.map(s => s.id)).toContain('antonio-berben');
      expect(speakers.map(s => s.id)).toContain('felipe-vicens');
    });
  });

  describe('createTalkSpeakerRelations', () => {
    it('should create relations between talks and speakers', () => {
      const talks = parseScheduleToTalks(sampleScheduleData);
      const speakers = parseScheduleToSpeakers(sampleScheduleData);
      const relations = createTalkSpeakerRelations(talks, speakers);

      expect(relations).toHaveLength(2);
      expect(relations[0]).toMatchObject({
        talkId: talks[0].id,
        speakerId: 'juan-vicente-herrera-ruiz-de-alejo'
      });
    });

    it('should create multiple relations for talks with multiple speakers', () => {
      const dataWithMultipleSpeakers = [
        {
          speaker: 'Antonio Berben, Felipe Vicens',
          talk: 'Multi-speaker talk',
          description: 'Talk with two speakers',
          timeISO: '2025-11-21T10:00',
          durationMinutes: 45,
          room: 'Main Room',
          track: 'main'
        }
      ];

      const talks = parseScheduleToTalks(dataWithMultipleSpeakers);
      const speakers = parseScheduleToSpeakers(dataWithMultipleSpeakers);
      const relations = createTalkSpeakerRelations(talks, speakers);

      expect(relations).toHaveLength(2);
      expect(relations[0].talkId).toBe(talks[0].id);
      expect(relations[1].talkId).toBe(talks[0].id);
      expect(relations.map(r => r.speakerId)).toContain('antonio-berben');
      expect(relations.map(r => r.speakerId)).toContain('felipe-vicens');
    });
  });

  describe('populateDatabase', () => {
    it('should populate the database with schedule data', async () => {
      await populateDatabase(sampleScheduleData);

      const talks = await testDb.talks.toArray();
      const speakers = await testDb.speakers.toArray();
      const talkSpeakers = await testDb.talkSpeakers.toArray();

      expect(talks).toHaveLength(2);
      expect(speakers).toHaveLength(2);
      expect(talkSpeakers).toHaveLength(2);
    });

    it('should clear existing data before populating', async () => {
      // First population
      await populateDatabase(sampleScheduleData);

      // Second population with different data
      const newData = [sampleScheduleData[0]];
      await populateDatabase(newData);

      const talks = await testDb.talks.toArray();
      expect(talks).toHaveLength(1);
    });
  });

  describe('isDatabaseEmpty', () => {
    it('should return true for empty database', async () => {
      const empty = await isDatabaseEmpty();
      expect(empty).toBe(true);
    });

    it('should return false for populated database', async () => {
      await populateDatabase(sampleScheduleData);

      const empty = await isDatabaseEmpty();
      expect(empty).toBe(false);
    });
  });

  describe('getDatabaseStats', () => {
    it('should return database statistics', async () => {
      await populateDatabase(sampleScheduleData);

      const stats = await getDatabaseStats();

      expect(stats).toMatchObject({
        talks: 2,
        speakers: 2,
        favorites: 0,
        notifications: 0
      });
    });

    it('should include favorites and notifications in stats', async () => {
      await populateDatabase(sampleScheduleData);

      // Add a favorite
      const talks = await testDb.talks.toArray();
      await testDb.addFavorite(talks[0].id);

      // Schedule a notification
      await testDb.scheduleNotification(talks[0].id, new Date());

      const stats = await getDatabaseStats();

      expect(stats.favorites).toBe(1);
      expect(stats.notifications).toBe(1);
    });
  });

  describe('exportData', () => {
    it('should export all data from the database', async () => {
      await populateDatabase(sampleScheduleData);

      const exportedData = await exportData();

      expect(exportedData).toHaveProperty('talks');
      expect(exportedData).toHaveProperty('speakers');
      expect(exportedData).toHaveProperty('talkSpeakers');
      expect(exportedData).toHaveProperty('favorites');
      expect(exportedData).toHaveProperty('notifications');
      expect(exportedData).toHaveProperty('exportedAt');

      expect(exportedData.talks).toHaveLength(2);
      expect(exportedData.speakers).toHaveLength(2);
    });
  });

  describe('importData', () => {
    it('should import data into the database', async () => {
      // Create some data
      const talks = parseScheduleToTalks(sampleScheduleData);
      const speakers = parseScheduleToSpeakers(sampleScheduleData);
      const talkSpeakers = createTalkSpeakerRelations(talks, speakers);

      // Import the data
      await importData({
        talks,
        speakers,
        talkSpeakers
      });

      // Verify the import
      const importedTalks = await testDb.talks.toArray();
      const importedSpeakers = await testDb.speakers.toArray();
      const importedRelations = await testDb.talkSpeakers.toArray();

      expect(importedTalks).toHaveLength(2);
      expect(importedSpeakers).toHaveLength(2);
      expect(importedRelations).toHaveLength(2);
    });

    it('should clear existing data before importing', async () => {
      // Populate with initial data
      await populateDatabase(sampleScheduleData);

      // Import new data with only one item
      const newData = [sampleScheduleData[0]];
      const talks = parseScheduleToTalks(newData);
      const speakers = parseScheduleToSpeakers(newData);
      const talkSpeakers = createTalkSpeakerRelations(talks, speakers);

      await importData({
        talks,
        speakers,
        talkSpeakers
      });

      // Verify only new data exists
      const importedTalks = await testDb.talks.toArray();
      expect(importedTalks).toHaveLength(1);
    });
  });
});
