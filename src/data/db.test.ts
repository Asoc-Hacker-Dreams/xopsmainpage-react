import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { db, XOpsDatabase, Talk, Speaker, TalkSpeaker } from '../data/db';
import Dexie from 'dexie';

describe('XOpsDatabase', () => {
  let testDb: XOpsDatabase;

  beforeEach(async () => {
    // Create a fresh database instance for each test
    testDb = new XOpsDatabase();
    await testDb.open();
  });

  afterEach(async () => {
    // Clean up after each test
    await testDb.delete();
    await testDb.close();
  });

  describe('Database Schema', () => {
    it('should create database with correct schema', async () => {
      expect(testDb.tables).toHaveLength(5);
      expect(testDb.tables.map(t => t.name)).toContain('talks');
      expect(testDb.tables.map(t => t.name)).toContain('speakers');
      expect(testDb.tables.map(t => t.name)).toContain('talkSpeakers');
      expect(testDb.tables.map(t => t.name)).toContain('favorites');
      expect(testDb.tables.map(t => t.name)).toContain('notifSchedule');
    });

    it('should have correct indices on talks table', () => {
      const talksTable = testDb.table('talks');
      const schema = talksTable.schema;
      
      expect(schema.primKey.keyPath).toBe('id');
      expect(schema.indexes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'day' }),
          expect.objectContaining({ name: 'track' }),
          expect.objectContaining({ name: 'room' }),
          expect.objectContaining({ name: 'startTime' }),
          expect.objectContaining({ name: 'endTime' }),
          expect.objectContaining({ name: 'slug' })
        ])
      );
    });

    it('should have correct indices on speakers table', () => {
      const speakersTable = testDb.table('speakers');
      const schema = speakersTable.schema;
      
      expect(schema.primKey.keyPath).toBe('id');
      expect(schema.indexes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'slug' }),
          expect.objectContaining({ name: 'name' })
        ])
      );
    });

    it('should have compound key on talkSpeakers table', () => {
      const talkSpeakersTable = testDb.table('talkSpeakers');
      const schema = talkSpeakersTable.schema;
      
      expect(schema.primKey.keyPath).toEqual(['talkId', 'speakerId']);
    });

    it('should have auto-increment on favorites table', () => {
      const favoritesTable = testDb.table('favorites');
      const schema = favoritesTable.schema;
      
      expect(schema.primKey.auto).toBe(true);
    });
  });

  describe('Talks Operations', () => {
    const sampleTalks: Talk[] = [
      {
        id: 'talk-1',
        day: '2025-11-21',
        track: 'main',
        room: 'Aula magna',
        startTime: '09:30',
        endTime: '10:00',
        slug: 'keynote-bienvenida',
        speaker: 'Juan Vicente Herrera',
        talk: 'Keynote de Bienvenida',
        description: 'Bienvenida oficial',
        timeISO: '2025-11-21T09:30',
        durationMinutes: 30
      },
      {
        id: 'talk-2',
        day: '2025-11-21',
        track: 'hyperscalers',
        room: 'Hyperscalers',
        startTime: '10:30',
        endTime: '11:00',
        slug: 'aws-keynote',
        speaker: 'Luis Guirigay',
        talk: 'AWS Keynote',
        description: 'Track AWS',
        timeISO: '2025-11-21T10:30',
        durationMinutes: 30
      },
      {
        id: 'talk-3',
        day: '2025-11-22',
        track: 'main',
        room: 'Aula magna',
        startTime: '09:30',
        endTime: '10:00',
        slug: 'day-2-welcome',
        speaker: 'Speaker 3',
        talk: 'Day 2 Welcome',
        description: 'Second day',
        timeISO: '2025-11-22T09:30',
        durationMinutes: 30
      }
    ];

    beforeEach(async () => {
      await testDb.talks.bulkAdd(sampleTalks);
    });

    it('should add and retrieve talks', async () => {
      const allTalks = await testDb.talks.toArray();
      expect(allTalks).toHaveLength(3);
    });

    it('should get talks by day', async () => {
      const day1Talks = await testDb.getTalksByDay('2025-11-21');
      expect(day1Talks).toHaveLength(2);
      expect(day1Talks.every(t => t.day === '2025-11-21')).toBe(true);
    });

    it('should get talks by track', async () => {
      const mainTalks = await testDb.getTalksByTrack('main');
      expect(mainTalks).toHaveLength(2);
      expect(mainTalks.every(t => t.track === 'main')).toBe(true);
    });

    it('should get talks by room', async () => {
      const aulaMagnaTalks = await testDb.getTalksByRoom('Aula magna');
      expect(aulaMagnaTalks).toHaveLength(2);
      expect(aulaMagnaTalks.every(t => t.room === 'Aula magna')).toBe(true);
    });

    it('should get talk by ID', async () => {
      const talk = await testDb.getTalkById('talk-1');
      expect(talk).toBeDefined();
      expect(talk?.id).toBe('talk-1');
    });

    it('should get talk by slug', async () => {
      const talk = await testDb.getTalkBySlug('keynote-bienvenida');
      expect(talk).toBeDefined();
      expect(talk?.slug).toBe('keynote-bienvenida');
    });
  });

  describe('Performance Tests', () => {
    it('should filter 1000 talks by day in less than 50ms (p50)', async () => {
      // Generate 1000 talks
      const talks: Talk[] = [];
      const days = ['2025-11-21', '2025-11-22', '2025-11-23'];
      const tracks = ['main', 'hyperscalers', 'security', 'platform'];
      const rooms = ['Aula magna', 'Hyperscalers', 'Security', 'Platform'];

      for (let i = 0; i < 1000; i++) {
        talks.push({
          id: `talk-${i}`,
          day: days[i % days.length],
          track: tracks[i % tracks.length],
          room: rooms[i % rooms.length],
          startTime: `${9 + (i % 8)}:${(i % 4) * 15}`,
          endTime: `${10 + (i % 8)}:${(i % 4) * 15}`,
          slug: `talk-slug-${i}`,
          speaker: `Speaker ${i}`,
          talk: `Talk ${i}`,
          description: `Description ${i}`,
          timeISO: `${days[i % days.length]}T${9 + (i % 8)}:${(i % 4) * 15}`,
          durationMinutes: 45
        });
      }

      await testDb.talks.bulkAdd(talks);

      // Run multiple queries and measure time
      const iterations = 50;
      const times: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        await testDb.getTalksByDay('2025-11-21');
        const end = performance.now();
        times.push(end - start);
      }

      // Calculate p50 (median)
      times.sort((a, b) => a - b);
      const p50 = times[Math.floor(times.length / 2)];

      console.log(`Query performance p50: ${p50.toFixed(2)}ms`);
      console.log(`Query performance avg: ${(times.reduce((a, b) => a + b, 0) / times.length).toFixed(2)}ms`);
      console.log(`Query performance max: ${Math.max(...times).toFixed(2)}ms`);

      // p50 should be less than 50ms
      expect(p50).toBeLessThan(50);
    });
  });

  describe('Speakers Operations', () => {
    const sampleSpeakers: Speaker[] = [
      {
        id: 'speaker-1',
        slug: 'juan-vicente-herrera',
        name: 'Juan Vicente Herrera'
      },
      {
        id: 'speaker-2',
        slug: 'luis-guirigay',
        name: 'Luis Guirigay'
      }
    ];

    beforeEach(async () => {
      await testDb.speakers.bulkAdd(sampleSpeakers);
    });

    it('should add and retrieve speakers', async () => {
      const allSpeakers = await testDb.speakers.toArray();
      expect(allSpeakers).toHaveLength(2);
    });

    it('should get speaker by slug', async () => {
      const speaker = await testDb.speakers.where('slug').equals('juan-vicente-herrera').first();
      expect(speaker).toBeDefined();
      expect(speaker?.name).toBe('Juan Vicente Herrera');
    });
  });

  describe('Talk-Speaker Relationships', () => {
    beforeEach(async () => {
      await testDb.talks.bulkAdd([
        {
          id: 'talk-1',
          day: '2025-11-21',
          track: 'main',
          room: 'Aula magna',
          startTime: '09:30',
          endTime: '10:00',
          slug: 'talk-1'
        }
      ]);

      await testDb.speakers.bulkAdd([
        { id: 'speaker-1', slug: 'speaker-1', name: 'Speaker 1' },
        { id: 'speaker-2', slug: 'speaker-2', name: 'Speaker 2' }
      ]);

      await testDb.talkSpeakers.bulkAdd([
        { talkId: 'talk-1', speakerId: 'speaker-1' },
        { talkId: 'talk-1', speakerId: 'speaker-2' }
      ]);
    });

    it('should get speakers for a talk', async () => {
      const speakers = await testDb.getSpeakersForTalk('talk-1');
      expect(speakers).toHaveLength(2);
      expect(speakers.map(s => s.id)).toContain('speaker-1');
      expect(speakers.map(s => s.id)).toContain('speaker-2');
    });

    it('should get talks for a speaker', async () => {
      const talks = await testDb.getTalksForSpeaker('speaker-1');
      expect(talks).toHaveLength(1);
      expect(talks[0].id).toBe('talk-1');
    });
  });

  describe('Favorites Operations', () => {
    beforeEach(async () => {
      await testDb.talks.bulkAdd([
        {
          id: 'talk-1',
          day: '2025-11-21',
          track: 'main',
          room: 'Aula magna',
          startTime: '09:30',
          endTime: '10:00',
          slug: 'talk-1'
        },
        {
          id: 'talk-2',
          day: '2025-11-21',
          track: 'main',
          room: 'Aula magna',
          startTime: '10:30',
          endTime: '11:00',
          slug: 'talk-2'
        }
      ]);
    });

    it('should add a favorite', async () => {
      const id = await testDb.addFavorite('talk-1');
      expect(id).toBeGreaterThan(0);

      const isFav = await testDb.isFavorite('talk-1');
      expect(isFav).toBe(true);
    });

    it('should not duplicate favorites', async () => {
      await testDb.addFavorite('talk-1');
      await testDb.addFavorite('talk-1');

      const favorites = await testDb.favorites.toArray();
      expect(favorites).toHaveLength(1);
    });

    it('should remove a favorite', async () => {
      await testDb.addFavorite('talk-1');
      await testDb.removeFavorite('talk-1');

      const isFav = await testDb.isFavorite('talk-1');
      expect(isFav).toBe(false);
    });

    it('should get all favorite talks', async () => {
      await testDb.addFavorite('talk-1');
      await testDb.addFavorite('talk-2');

      const favorites = await testDb.getFavorites();
      expect(favorites).toHaveLength(2);
    });
  });

  describe('Notification Scheduling', () => {
    beforeEach(async () => {
      await testDb.talks.bulkAdd([
        {
          id: 'talk-1',
          day: '2025-11-21',
          track: 'main',
          room: 'Aula magna',
          startTime: '09:30',
          endTime: '10:00',
          slug: 'talk-1'
        }
      ]);
    });

    it('should schedule a notification', async () => {
      const notifyAt = new Date('2025-11-21T09:00:00');
      await testDb.scheduleNotification('talk-1', notifyAt);

      const scheduled = await testDb.getScheduledNotifications();
      expect(scheduled).toHaveLength(1);
      expect(scheduled[0].talkId).toBe('talk-1');
    });

    it('should get pending notifications', async () => {
      const pastDate = new Date(Date.now() - 1000 * 60 * 60); // 1 hour ago
      const futureDate = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now

      await testDb.scheduleNotification('talk-1', pastDate);

      const pending = await testDb.getPendingNotifications();
      expect(pending).toHaveLength(1);
    });

    it('should remove a notification', async () => {
      const notifyAt = new Date('2025-11-21T09:00:00');
      await testDb.scheduleNotification('talk-1', notifyAt);
      await testDb.removeNotification('talk-1');

      const scheduled = await testDb.getScheduledNotifications();
      expect(scheduled).toHaveLength(0);
    });
  });

  describe('Cache Clearing and Re-hydration', () => {
    it('should clear all data from the database', async () => {
      // Add sample data
      await testDb.talks.bulkAdd([
        {
          id: 'talk-1',
          day: '2025-11-21',
          track: 'main',
          room: 'Aula magna',
          startTime: '09:30',
          endTime: '10:00',
          slug: 'talk-1'
        }
      ]);

      await testDb.speakers.bulkAdd([
        { id: 'speaker-1', slug: 'speaker-1', name: 'Speaker 1' }
      ]);

      await testDb.addFavorite('talk-1');

      // Clear all
      await testDb.clearAll();

      // Verify everything is cleared
      const talks = await testDb.talks.toArray();
      const speakers = await testDb.speakers.toArray();
      const favorites = await testDb.favorites.toArray();

      expect(talks).toHaveLength(0);
      expect(speakers).toHaveLength(0);
      expect(favorites).toHaveLength(0);
    });

    it('should re-hydrate database after clearing without errors', async () => {
      // Clear the database
      await testDb.clearAll();

      // Re-hydrate with new data
      const newTalks: Talk[] = [
        {
          id: 'talk-1',
          day: '2025-11-21',
          track: 'main',
          room: 'Aula magna',
          startTime: '09:30',
          endTime: '10:00',
          slug: 'talk-1'
        }
      ];

      await testDb.talks.bulkAdd(newTalks);

      const talks = await testDb.talks.toArray();
      expect(talks).toHaveLength(1);
      expect(talks[0].id).toBe('talk-1');
    });
  });

  describe('Database Singleton Instance', () => {
    it('should export a singleton db instance', () => {
      expect(db).toBeDefined();
      expect(db).toBeInstanceOf(XOpsDatabase);
      expect(db).toBeInstanceOf(Dexie);
    });
  });
});
