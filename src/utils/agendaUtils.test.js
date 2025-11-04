import { describe, it, expect } from 'vitest';
import {
  generateTalkId,
  groupTalksByDayAndRoom,
  groupTalksByDay,
  talksOverlap,
  detectConflicts,
  formatDate,
  formatTime,
} from './agendaUtils';

describe('agendaUtils', () => {
  describe('generateTalkId', () => {
    it('generates a unique ID from talk properties', () => {
      const talk = {
        speaker: 'John Doe',
        timeISO: '2025-11-21T10:00',
        room: 'Aula magna',
      };
      const id = generateTalkId(talk);
      expect(id).toBe('john-doe-2025-11-21t10:00-aula-magna');
    });

    it('handles special characters and spaces', () => {
      const talk = {
        speaker: 'María José García',
        timeISO: '2025-11-21T14:30',
        room: 'Sala B',
      };
      const id = generateTalkId(talk);
      expect(id).toContain('maría-josé-garcía');
    });
  });

  describe('groupTalksByDayAndRoom', () => {
    it('groups talks by day and room', () => {
      const talks = [
        {
          speaker: 'Speaker 1',
          talk: 'Talk 1',
          timeISO: '2025-11-21T10:00',
          room: 'Room A',
          durationMinutes: 30,
        },
        {
          speaker: 'Speaker 2',
          talk: 'Talk 2',
          timeISO: '2025-11-21T11:00',
          room: 'Room A',
          durationMinutes: 30,
        },
        {
          speaker: 'Speaker 3',
          talk: 'Talk 3',
          timeISO: '2025-11-22T10:00',
          room: 'Room B',
          durationMinutes: 30,
        },
      ];

      const grouped = groupTalksByDayAndRoom(talks);

      expect(grouped['2025-11-21']).toBeDefined();
      expect(grouped['2025-11-21']['Room A']).toHaveLength(2);
      expect(grouped['2025-11-22']).toBeDefined();
      expect(grouped['2025-11-22']['Room B']).toHaveLength(1);
    });

    it('sorts talks by time within each room', () => {
      const talks = [
        {
          speaker: 'Speaker 2',
          talk: 'Talk 2',
          timeISO: '2025-11-21T11:00',
          room: 'Room A',
          durationMinutes: 30,
        },
        {
          speaker: 'Speaker 1',
          talk: 'Talk 1',
          timeISO: '2025-11-21T10:00',
          room: 'Room A',
          durationMinutes: 30,
        },
      ];

      const grouped = groupTalksByDayAndRoom(talks);
      const roomTalks = grouped['2025-11-21']['Room A'];

      expect(roomTalks[0].timeISO).toBe('2025-11-21T10:00');
      expect(roomTalks[1].timeISO).toBe('2025-11-21T11:00');
    });

    it('adds unique ID to each talk', () => {
      const talks = [
        {
          speaker: 'Speaker 1',
          talk: 'Talk 1',
          timeISO: '2025-11-21T10:00',
          room: 'Room A',
          durationMinutes: 30,
        },
      ];

      const grouped = groupTalksByDayAndRoom(talks);
      const talk = grouped['2025-11-21']['Room A'][0];

      expect(talk.id).toBeDefined();
      expect(typeof talk.id).toBe('string');
    });
  });

  describe('groupTalksByDay', () => {
    it('groups talks by day only', () => {
      const talks = [
        {
          speaker: 'Speaker 1',
          talk: 'Talk 1',
          timeISO: '2025-11-21T10:00',
          room: 'Room A',
          durationMinutes: 30,
        },
        {
          speaker: 'Speaker 2',
          talk: 'Talk 2',
          timeISO: '2025-11-21T11:00',
          room: 'Room B',
          durationMinutes: 30,
        },
      ];

      const grouped = groupTalksByDay(talks);

      expect(grouped['2025-11-21']).toBeDefined();
      expect(grouped['2025-11-21']).toHaveLength(2);
    });
  });

  describe('talksOverlap', () => {
    it('detects overlapping talks in different rooms', () => {
      const talk1 = {
        timeISO: '2025-11-21T10:00',
        durationMinutes: 60,
        room: 'Room A',
      };
      const talk2 = {
        timeISO: '2025-11-21T10:30',
        durationMinutes: 60,
        room: 'Room B',
      };

      expect(talksOverlap(talk1, talk2)).toBe(true);
    });

    it('does not detect overlap for talks in same room', () => {
      const talk1 = {
        timeISO: '2025-11-21T10:00',
        durationMinutes: 60,
        room: 'Room A',
      };
      const talk2 = {
        timeISO: '2025-11-21T10:30',
        durationMinutes: 60,
        room: 'Room A',
      };

      expect(talksOverlap(talk1, talk2)).toBe(false);
    });

    it('does not detect overlap for sequential talks', () => {
      const talk1 = {
        timeISO: '2025-11-21T10:00',
        durationMinutes: 60,
        room: 'Room A',
      };
      const talk2 = {
        timeISO: '2025-11-21T11:00',
        durationMinutes: 60,
        room: 'Room B',
      };

      expect(talksOverlap(talk1, talk2)).toBe(false);
    });
  });

  describe('detectConflicts', () => {
    it('detects conflicts in overlapping talks', () => {
      const talks = [
        {
          speaker: 'Speaker 1',
          talk: 'Talk 1',
          timeISO: '2025-11-21T10:00',
          durationMinutes: 60,
          room: 'Room A',
        },
        {
          speaker: 'Speaker 2',
          talk: 'Talk 2',
          timeISO: '2025-11-21T10:30',
          durationMinutes: 60,
          room: 'Room B',
        },
      ];

      const conflicts = detectConflicts(talks);

      expect(conflicts.size).toBe(2);
    });

    it('returns empty set for non-overlapping talks', () => {
      const talks = [
        {
          speaker: 'Speaker 1',
          talk: 'Talk 1',
          timeISO: '2025-11-21T10:00',
          durationMinutes: 60,
          room: 'Room A',
        },
        {
          speaker: 'Speaker 2',
          talk: 'Talk 2',
          timeISO: '2025-11-21T11:00',
          durationMinutes: 60,
          room: 'Room B',
        },
      ];

      const conflicts = detectConflicts(talks);

      expect(conflicts.size).toBe(0);
    });
  });

  describe('formatDate', () => {
    it('formats date in Spanish locale', () => {
      const formatted = formatDate('2025-11-21');
      expect(formatted).toMatch(/viernes/i);
      expect(formatted).toContain('21');
      expect(formatted).toMatch(/noviembre/i);
    });
  });

  describe('formatTime', () => {
    it('extracts time from ISO string', () => {
      const time = formatTime('2025-11-21T10:30');
      expect(time).toBe('10:30');
    });

    it('returns original string if no T separator', () => {
      const time = formatTime('10:30');
      expect(time).toBe('10:30');
    });
  });
});
