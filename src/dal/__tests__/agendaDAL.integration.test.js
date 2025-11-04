/**
 * Integration tests for Agenda DAL with real schedule data
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initializeAgenda, getAgenda, clearAgenda } from '../agendaDAL.js';
import scheduleData from '../../data/schedule2025.json';
import './indexedDBMock.js';

describe('Agenda DAL Integration Tests', () => {
  beforeEach(async () => {
    global.mockIndexedDBData = { _initialized: false };
    await clearAgenda();
  });

  afterEach(async () => {
    await clearAgenda();
  });

  it('should load and query real schedule data', async () => {
    await initializeAgenda(scheduleData);
    
    const results = await getAgenda();
    
    expect(results.length).toBe(scheduleData.length);
  });

  it('should filter by day 2025-11-21', async () => {
    await initializeAgenda(scheduleData);
    
    const results = await getAgenda({ day: '2025-11-21' });
    
    expect(results.length).toBeGreaterThan(0);
    results.forEach(item => {
      expect(item.day).toBe('2025-11-21');
    });
    
    // Verify sorting
    for (let i = 0; i < results.length - 1; i++) {
      // eslint-disable-next-line security/detect-object-injection
      expect(results[i].startTime <= results[i + 1].startTime).toBe(true);
    }
  });

  it('should filter by day 2025-11-22', async () => {
    await initializeAgenda(scheduleData);
    
    const results = await getAgenda({ day: '2025-11-22' });
    
    expect(results.length).toBeGreaterThan(0);
    results.forEach(item => {
      expect(item.day).toBe('2025-11-22');
    });
  });

  it('should filter by track "main"', async () => {
    await initializeAgenda(scheduleData);
    
    const results = await getAgenda({ track: 'main' });
    
    expect(results.length).toBeGreaterThan(0);
    results.forEach(item => {
      expect(item.track).toBe('main');
    });
  });

  it('should filter by track "hyperscalers"', async () => {
    await initializeAgenda(scheduleData);
    
    const results = await getAgenda({ track: 'hyperscalers' });
    
    expect(results.length).toBeGreaterThan(0);
    results.forEach(item => {
      expect(item.track).toBe('hyperscalers');
    });
  });

  it('should filter by track "bsides"', async () => {
    await initializeAgenda(scheduleData);
    
    const results = await getAgenda({ track: 'bsides' });
    
    expect(results.length).toBeGreaterThan(0);
    results.forEach(item => {
      expect(item.track).toBe('bsides');
    });
  });

  it('should filter by room "Aula magna"', async () => {
    await initializeAgenda(scheduleData);
    
    const results = await getAgenda({ room: 'Aula magna' });
    
    expect(results.length).toBeGreaterThan(0);
    results.forEach(item => {
      expect(item.room).toBe('Aula magna');
    });
  });

  it('should filter by room "Hyperscalers"', async () => {
    await initializeAgenda(scheduleData);
    
    const results = await getAgenda({ room: 'Hyperscalers' });
    
    expect(results.length).toBeGreaterThan(0);
    results.forEach(item => {
      expect(item.room).toBe('Hyperscalers');
    });
  });

  it('should filter by day and track combination', async () => {
    await initializeAgenda(scheduleData);
    
    const results = await getAgenda({ day: '2025-11-21', track: 'main' });
    
    expect(results.length).toBeGreaterThan(0);
    results.forEach(item => {
      expect(item.day).toBe('2025-11-21');
      expect(item.track).toBe('main');
    });
  });

  it('should filter by day and room combination', async () => {
    await initializeAgenda(scheduleData);
    
    const results = await getAgenda({ day: '2025-11-21', room: 'Aula magna' });
    
    expect(results.length).toBeGreaterThan(0);
    results.forEach(item => {
      expect(item.day).toBe('2025-11-21');
      expect(item.room).toBe('Aula magna');
    });
  });

  it('should return all results sorted chronologically', async () => {
    await initializeAgenda(scheduleData);
    
    const results = await getAgenda();
    
    // Verify all results are sorted by startTime
    for (let i = 0; i < results.length - 1; i++) {
      // eslint-disable-next-line security/detect-object-injection
      const current = results[i].startTime;
      const next = results[i + 1].startTime;
      expect(current <= next).toBe(true);
    }
  });

  it('should ensure first event is on day 1 at earliest time', async () => {
    await initializeAgenda(scheduleData);
    
    const results = await getAgenda();
    
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].day).toBe('2025-11-21');
    expect(results[0].startTime).toBe('2025-11-21T09:30');
  });

  it('should handle empty filter results gracefully', async () => {
    await initializeAgenda(scheduleData);
    
    const results = await getAgenda({ day: '2025-11-23' });
    
    expect(results).toEqual([]);
  });
});
