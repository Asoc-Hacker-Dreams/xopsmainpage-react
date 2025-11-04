import { describe, it, expect, beforeEach, vi } from 'vitest';
import DAL from '../data/dal.js';
import db from '../data/db.js';

// Mock the schedule data
vi.mock('../data/schedule2025.json', () => ({
  default: [
    {
      speaker: "Test Speaker 1",
      talk: "Test Talk 1",
      description: "Test description 1",
      timeRaw: "2025-11-21 09:30:00",
      timeISO: "2025-11-21T09:30",
      durationMinutes: 30,
      durationHuman: "30m",
      room: "Test Room 1",
      type: "keynote",
      track: "main"
    },
    {
      speaker: "Test Speaker 2",
      talk: "Test Talk 2",
      description: "Test description 2",
      timeRaw: "2025-11-21 10:30:00",
      timeISO: "2025-11-21T10:30",
      durationMinutes: 45,
      durationHuman: "45m",
      room: "Test Room 2",
      type: "talk",
      track: "hyperscalers"
    }
  ]
}));

describe('DAL (Data Access Layer)', () => {
  beforeEach(async () => {
    // Clear IndexedDB before each test
    await db.talks.clear();
    await db.speakers.clear();
    await db.metadata.clear();
  });

  describe('getAgenda', () => {
    it('should return all talks without filters', async () => {
      const talks = await DAL.getAgenda();
      
      expect(talks).toHaveLength(2);
      expect(talks[0]).toHaveProperty('id');
      expect(talks[0]).toHaveProperty('slug');
      expect(talks[0]).toHaveProperty('speaker');
      expect(talks[0]).toHaveProperty('talk');
      expect(talks[0].speaker).toBe('Test Speaker 1');
    });

    it('should filter talks by day', async () => {
      const talks = await DAL.getAgenda({ day: '2025-11-21' });
      
      expect(talks).toHaveLength(2);
      talks.forEach(talk => {
        expect(talk.day).toBe('2025-11-21');
      });
    });

    it('should filter talks by track', async () => {
      const talks = await DAL.getAgenda({ track: 'main' });
      
      expect(talks).toHaveLength(1);
      expect(talks[0].track).toBe('main');
    });

    it('should sort talks by time', async () => {
      const talks = await DAL.getAgenda();
      
      for (let i = 1; i < talks.length; i++) {
        expect(talks[i].timeISO >= talks[i - 1].timeISO).toBe(true);
      }
    });
  });

  describe('getTalk', () => {
    it('should return a talk by ID', async () => {
      // First, get all talks to know IDs
      const talks = await DAL.getAgenda();
      const firstTalkId = talks[0].id;
      
      const talk = await DAL.getTalk(firstTalkId);
      
      expect(talk).toBeDefined();
      expect(talk.id).toBe(firstTalkId);
    });

    it('should return a talk by slug', async () => {
      const talks = await DAL.getAgenda();
      const firstTalkSlug = talks[0].slug;
      
      const talk = await DAL.getTalk(firstTalkSlug);
      
      expect(talk).toBeDefined();
      expect(talk.slug).toBe(firstTalkSlug);
    });

    it('should return null for non-existent talk', async () => {
      const talk = await DAL.getTalk('non-existent-id');
      
      expect(talk).toBeNull();
    });
  });

  describe('getSpeakers', () => {
    it('should return all unique speakers', async () => {
      const speakers = await DAL.getSpeakers();
      
      expect(speakers.length).toBeGreaterThanOrEqual(2);
      expect(speakers[0]).toHaveProperty('id');
      expect(speakers[0]).toHaveProperty('slug');
      expect(speakers[0]).toHaveProperty('name');
    });

    it('should filter speakers by name', async () => {
      const speakers = await DAL.getSpeakers({ name: 'Test Speaker 1' });
      
      expect(speakers.length).toBeGreaterThan(0);
      speakers.forEach(speaker => {
        expect(speaker.name.toLowerCase()).toContain('test speaker 1'.toLowerCase());
      });
    });

    it('should sort speakers alphabetically', async () => {
      const speakers = await DAL.getSpeakers();
      
      for (let i = 1; i < speakers.length; i++) {
        expect(speakers[i].name >= speakers[i - 1].name).toBe(true);
      }
    });
  });

  describe('getSpeaker', () => {
    it('should return a speaker by ID', async () => {
      const speakers = await DAL.getSpeakers();
      const firstSpeakerId = speakers[0].id;
      
      const speaker = await DAL.getSpeaker(firstSpeakerId);
      
      expect(speaker).toBeDefined();
      expect(speaker.id).toBe(firstSpeakerId);
    });

    it('should return a speaker by slug', async () => {
      const speakers = await DAL.getSpeakers();
      const firstSpeakerSlug = speakers[0].slug;
      
      const speaker = await DAL.getSpeaker(firstSpeakerSlug);
      
      expect(speaker).toBeDefined();
      expect(speaker.slug).toBe(firstSpeakerSlug);
    });

    it('should return null for non-existent speaker', async () => {
      const speaker = await DAL.getSpeaker('non-existent-id');
      
      expect(speaker).toBeNull();
    });
  });

  describe('IndexedDB caching', () => {
    it('should cache data in IndexedDB', async () => {
      // First call should load from JSON and cache
      await DAL.getAgenda();
      
      // Check that data is in IndexedDB
      const talksCount = await db.talks.count();
      const speakersCount = await db.speakers.count();
      const lastSync = await db.metadata.get('lastSync');
      
      expect(talksCount).toBeGreaterThan(0);
      expect(speakersCount).toBeGreaterThan(0);
      expect(lastSync).toBeDefined();
      expect(lastSync.value).toBeDefined();
    });

    it('should reuse cached data on subsequent calls', async () => {
      // First call
      const talks1 = await DAL.getAgenda();
      
      // Second call (should use cache)
      const talks2 = await DAL.getAgenda();
      
      expect(talks1).toEqual(talks2);
    });
  });
});
