/**
 * Tests for Agenda Data Access Layer
 * Tests filtering, sorting, and IndexedDB operations
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initializeAgenda, getAgenda, clearAgenda } from '../agendaDAL.js';
import './indexedDBMock.js';

describe('Agenda DAL', () => {
  // Sample test data
  const sampleAgenda = [
    {
      speaker: 'Speaker 1',
      talk: 'Talk 1',
      timeISO: '2025-11-21T09:30',
      room: 'Aula magna',
      track: 'main'
    },
    {
      speaker: 'Speaker 2',
      talk: 'Talk 2',
      timeISO: '2025-11-21T11:00',
      room: 'Hyperscalers',
      track: 'hyperscalers'
    },
    {
      speaker: 'Speaker 3',
      talk: 'Talk 3',
      timeISO: '2025-11-22T10:30',
      room: 'Aula magna',
      track: 'main'
    },
    {
      speaker: 'Speaker 4',
      talk: 'Talk 4',
      timeISO: '2025-11-21T14:30',
      room: 'Bsides Madrid',
      track: 'bsides'
    }
  ];

  beforeEach(async () => {
    global.mockIndexedDBData = { _initialized: false };
    await clearAgenda();
  });

  afterEach(async () => {
    await clearAgenda();
  });

  describe('initializeAgenda', () => {
    it('should initialize agenda with data', async () => {
      await initializeAgenda(sampleAgenda);
      
      const results = await getAgenda();
      expect(results).toHaveLength(sampleAgenda.length);
    });

    it('should normalize agenda items with day field', async () => {
      await initializeAgenda(sampleAgenda);
      
      const results = await getAgenda();
      results.forEach(item => {
        expect(item).toHaveProperty('day');
        expect(item.day).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });
  });

  describe('getAgenda - No Filters', () => {
    it('should return all items sorted by startTime when no filters provided', async () => {
      await initializeAgenda(sampleAgenda);
      
      const results = await getAgenda();
      
      expect(results).toHaveLength(4);
      
      // Verify sorting by startTime
      for (let i = 0; i < results.length - 1; i++) {
        // eslint-disable-next-line security/detect-object-injection
        expect(results[i].startTime <= results[i + 1].startTime).toBe(true);
      }
    });

    it('should return empty array when database is empty', async () => {
      const results = await getAgenda();
      expect(results).toEqual([]);
    });
  });

  describe('getAgenda - Filter by Day', () => {
    it('should filter items by specific day', async () => {
      await initializeAgenda(sampleAgenda);
      
      const results = await getAgenda({ day: '2025-11-21' });
      
      expect(results).toHaveLength(3);
      results.forEach(item => {
        expect(item.day).toBe('2025-11-21');
      });
    });

    it('should return items sorted by startTime for specific day', async () => {
      await initializeAgenda(sampleAgenda);
      
      const results = await getAgenda({ day: '2025-11-21' });
      
      for (let i = 0; i < results.length - 1; i++) {
        // eslint-disable-next-line security/detect-object-injection
        expect(results[i].startTime <= results[i + 1].startTime).toBe(true);
      }
    });

    it('should return empty array for day with no events', async () => {
      await initializeAgenda(sampleAgenda);
      
      const results = await getAgenda({ day: '2025-11-23' });
      expect(results).toEqual([]);
    });
  });

  describe('getAgenda - Filter by Track', () => {
    it('should filter items by track', async () => {
      await initializeAgenda(sampleAgenda);
      
      const results = await getAgenda({ track: 'main' });
      
      expect(results).toHaveLength(2);
      results.forEach(item => {
        expect(item.track).toBe('main');
      });
    });

    it('should return items sorted by startTime for specific track', async () => {
      await initializeAgenda(sampleAgenda);
      
      const results = await getAgenda({ track: 'main' });
      
      for (let i = 0; i < results.length - 1; i++) {
        // eslint-disable-next-line security/detect-object-injection
        expect(results[i].startTime <= results[i + 1].startTime).toBe(true);
      }
    });
  });

  describe('getAgenda - Filter by Room', () => {
    it('should filter items by room', async () => {
      await initializeAgenda(sampleAgenda);
      
      const results = await getAgenda({ room: 'Aula magna' });
      
      expect(results).toHaveLength(2);
      results.forEach(item => {
        expect(item.room).toBe('Aula magna');
      });
    });
  });

  describe('getAgenda - Combined Filters', () => {
    it('should filter by day and track', async () => {
      await initializeAgenda(sampleAgenda);
      
      const results = await getAgenda({ day: '2025-11-21', track: 'main' });
      
      expect(results).toHaveLength(1);
      expect(results[0].day).toBe('2025-11-21');
      expect(results[0].track).toBe('main');
    });

    it('should filter by day and room', async () => {
      await initializeAgenda(sampleAgenda);
      
      const results = await getAgenda({ day: '2025-11-21', room: 'Aula magna' });
      
      expect(results).toHaveLength(1);
      expect(results[0].day).toBe('2025-11-21');
      expect(results[0].room).toBe('Aula magna');
    });

    it('should filter by track and room', async () => {
      await initializeAgenda(sampleAgenda);
      
      const results = await getAgenda({ track: 'main', room: 'Aula magna' });
      
      expect(results).toHaveLength(2);
      results.forEach(item => {
        expect(item.track).toBe('main');
        expect(item.room).toBe('Aula magna');
      });
    });

    it('should filter by day, track, and room', async () => {
      await initializeAgenda(sampleAgenda);
      
      const results = await getAgenda({ 
        day: '2025-11-21', 
        track: 'main', 
        room: 'Aula magna' 
      });
      
      expect(results).toHaveLength(1);
      expect(results[0].day).toBe('2025-11-21');
      expect(results[0].track).toBe('main');
      expect(results[0].room).toBe('Aula magna');
    });
  });

  describe('getAgenda - Large Dataset', () => {
    it('should handle dataset with 100+ items efficiently', async () => {
      // Generate 150 items
      const largeDataset = Array.from({ length: 150 }, (_, i) => ({
        speaker: `Speaker ${i}`,
        talk: `Talk ${i}`,
        timeISO: `2025-11-${21 + Math.floor(i / 75)}T${String(9 + (i % 12)).padStart(2, '0')}:${String((i * 15) % 60).padStart(2, '0')}`,
        room: ['Aula magna', 'Hyperscalers', 'Bsides Madrid'][i % 3],
        track: ['main', 'hyperscalers', 'bsides'][i % 3]
      }));

      await initializeAgenda(largeDataset);
      
      const results = await getAgenda();
      
      expect(results).toHaveLength(150);
      
      // Verify all items are sorted
      for (let i = 0; i < results.length - 1; i++) {
        // eslint-disable-next-line security/detect-object-injection
        expect(results[i].startTime <= results[i + 1].startTime).toBe(true);
      }
    });

    it('should filter large dataset by day efficiently', async () => {
      const largeDataset = Array.from({ length: 150 }, (_, i) => ({
        speaker: `Speaker ${i}`,
        talk: `Talk ${i}`,
        timeISO: `2025-11-${21 + Math.floor(i / 75)}T${String(9 + (i % 12)).padStart(2, '0')}:${String((i * 15) % 60).padStart(2, '0')}`,
        room: ['Aula magna', 'Hyperscalers', 'Bsides Madrid'][i % 3],
        track: ['main', 'hyperscalers', 'bsides'][i % 3]
      }));

      await initializeAgenda(largeDataset);
      
      const results = await getAgenda({ day: '2025-11-21' });
      
      expect(results.length).toBeGreaterThan(0);
      results.forEach(item => {
        expect(item.day).toBe('2025-11-21');
      });
    });
  });

  describe('clearAgenda', () => {
    it('should clear all agenda data', async () => {
      await initializeAgenda(sampleAgenda);
      
      let results = await getAgenda();
      expect(results).toHaveLength(4);
      
      await clearAgenda();
      
      results = await getAgenda();
      expect(results).toEqual([]);
    });
  });

  describe('Sorting Behavior', () => {
    it('should maintain correct chronological order across multiple days', async () => {
      const multiDayData = [
        { timeISO: '2025-11-22T09:30', room: 'A', track: 'main', speaker: 'S1', talk: 'T1' },
        { timeISO: '2025-11-21T14:30', room: 'A', track: 'main', speaker: 'S2', talk: 'T2' },
        { timeISO: '2025-11-21T09:30', room: 'A', track: 'main', speaker: 'S3', talk: 'T3' },
        { timeISO: '2025-11-22T14:30', room: 'A', track: 'main', speaker: 'S4', talk: 'T4' }
      ];

      await initializeAgenda(multiDayData);
      
      const results = await getAgenda();
      
      expect(results[0].timeISO).toBe('2025-11-21T09:30');
      expect(results[1].timeISO).toBe('2025-11-21T14:30');
      expect(results[2].timeISO).toBe('2025-11-22T09:30');
      expect(results[3].timeISO).toBe('2025-11-22T14:30');
    });
  });
});
