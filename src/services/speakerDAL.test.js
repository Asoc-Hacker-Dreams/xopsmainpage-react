/**
 * Tests for Speaker Data Access Layer
 */

import { describe, it, expect } from 'vitest';
import {
  getAllTalks,
  getAllSpeakers,
  getSpeaker,
  getSpeakersByTrack,
  getTalksByTrack,
  getAllTracks,
  searchSpeakers
} from '../services/speakerDAL';

describe('Speaker DAL', () => {
  describe('getAllTalks', () => {
    it('returns all talks from the schedule', () => {
      const talks = getAllTalks();
      expect(talks).toBeDefined();
      expect(Array.isArray(talks)).toBe(true);
      expect(talks.length).toBeGreaterThan(0);
    });

    it('normalizes talk data with required fields', () => {
      const talks = getAllTalks();
      const talk = talks[0];
      
      expect(talk).toHaveProperty('id');
      expect(talk).toHaveProperty('title');
      expect(talk).toHaveProperty('description');
      expect(talk).toHaveProperty('speakers');
      expect(talk).toHaveProperty('startTime');
      expect(talk).toHaveProperty('track');
      expect(talk.startTime).toBeInstanceOf(Date);
    });
  });

  describe('getTalksByTrack', () => {
    it('filters talks by track', () => {
      const mainTalks = getTalksByTrack('main');
      expect(mainTalks.every(talk => talk.track === 'main')).toBe(true);
    });

    it('returns empty array for non-existent track', () => {
      const talks = getTalksByTrack('nonexistent');
      expect(talks).toEqual([]);
    });
  });

  describe('getAllSpeakers', () => {
    it('returns all unique speakers', () => {
      const speakers = getAllSpeakers();
      expect(speakers).toBeDefined();
      expect(Array.isArray(speakers)).toBe(true);
      expect(speakers.length).toBeGreaterThan(0);
    });

    it('aggregates talks for each speaker', () => {
      const speakers = getAllSpeakers();
      const speaker = speakers[0];
      
      expect(speaker).toHaveProperty('id');
      expect(speaker).toHaveProperty('slug');
      expect(speaker).toHaveProperty('name');
      expect(speaker).toHaveProperty('talks');
      expect(Array.isArray(speaker.talks)).toBe(true);
    });

    it('sorts talks by start time for each speaker', () => {
      const speakers = getAllSpeakers();
      const speakerWithMultipleTalks = speakers.find(s => s.talks.length > 1);
      
      if (speakerWithMultipleTalks) {
        const talks = speakerWithMultipleTalks.talks;
        for (let i = 1; i < talks.length; i++) {
          expect(talks[i].startTime >= talks[i - 1].startTime).toBe(true);
        }
      }
    });
  });

  describe('getSpeaker', () => {
    it('returns speaker by ID', () => {
      const speakers = getAllSpeakers();
      const firstSpeaker = speakers[0];
      const found = getSpeaker(firstSpeaker.id);
      
      expect(found).toBeDefined();
      expect(found.id).toBe(firstSpeaker.id);
    });

    it('returns speaker by slug', () => {
      const speakers = getAllSpeakers();
      const firstSpeaker = speakers[0];
      const found = getSpeaker(firstSpeaker.slug);
      
      expect(found).toBeDefined();
      expect(found.slug).toBe(firstSpeaker.slug);
    });

    it('returns undefined for non-existent speaker', () => {
      const found = getSpeaker('non-existent-speaker');
      expect(found).toBeUndefined();
    });

    it('returns speaker with their talks', () => {
      const speakers = getAllSpeakers();
      const speakerId = speakers[0].id;
      const speaker = getSpeaker(speakerId);
      
      expect(speaker.talks).toBeDefined();
      expect(Array.isArray(speaker.talks)).toBe(true);
    });
  });

  describe('getSpeakersByTrack', () => {
    it('returns speakers who have talks in the specified track', () => {
      const mainSpeakers = getSpeakersByTrack('main');
      expect(mainSpeakers).toBeDefined();
      expect(Array.isArray(mainSpeakers)).toBe(true);
      
      mainSpeakers.forEach(speaker => {
        const hasMainTalk = speaker.talks.some(talk => talk.track === 'main');
        expect(hasMainTalk).toBe(true);
      });
    });

    it('returns empty array for non-existent track', () => {
      const speakers = getSpeakersByTrack('nonexistent');
      expect(speakers).toEqual([]);
    });
  });

  describe('getAllTracks', () => {
    it('returns all unique tracks', () => {
      const tracks = getAllTracks();
      expect(tracks).toBeDefined();
      expect(Array.isArray(tracks)).toBe(true);
      expect(tracks.length).toBeGreaterThan(0);
      
      // Check that tracks are unique
      const uniqueTracks = new Set(tracks);
      expect(uniqueTracks.size).toBe(tracks.length);
    });
  });

  describe('searchSpeakers', () => {
    it('returns all speakers when query is empty', () => {
      const allSpeakers = getAllSpeakers();
      const searchResults = searchSpeakers('');
      expect(searchResults.length).toBe(allSpeakers.length);
    });

    it('searches speakers by name', () => {
      const speakers = getAllSpeakers();
      if (speakers.length > 0) {
        const firstSpeaker = speakers[0];
        const searchTerm = firstSpeaker.name.split(' ')[0];
        const results = searchSpeakers(searchTerm);
        
        expect(results.length).toBeGreaterThan(0);
        expect(results.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))).toBe(true);
      }
    });

    it('is case insensitive', () => {
      const speakers = getAllSpeakers();
      if (speakers.length > 0) {
        const firstSpeaker = speakers[0];
        const searchTermLower = firstSpeaker.name.split(' ')[0].toLowerCase();
        const searchTermUpper = searchTermLower.toUpperCase();
        
        const resultsLower = searchSpeakers(searchTermLower);
        const resultsUpper = searchSpeakers(searchTermUpper);
        
        expect(resultsLower.length).toBe(resultsUpper.length);
      }
    });
  });
});
