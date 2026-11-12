import { describe, expect, test } from 'vitest';
import { buildDubaiIcs } from './dubaiCalendar';
import { dubaiProgramme2026 } from '../data/dubaiProgramme2026';

describe('Dubai calendar exports', () => {
  test.each([
    ['2026-11-30', 'summit', 19, 9, '20261130T050000Z'],
    ['2026-12-01', 'conference', 16, 10, '20261201T050000Z'],
  ])('exports %s %s in true GST/UTC and skips provisional evening dinner', (date, track, totalSlots, talks, firstUtc) => {
    const slots = dubaiProgramme2026[track].items;
    expect(slots).toHaveLength(totalSlots);
    expect(slots.filter((slot) => slot.sessionId)).toHaveLength(talks);
    const calendar = buildDubaiIcs({ date, slots, label: 'X-Ops Dubai 2026', language: 'en' });
    expect(calendar.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(calendar.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(calendar).toContain('DTSTART:' + firstUtc);
    expect(calendar.match(/BEGIN:VEVENT/g)).toHaveLength(track === 'summit' ? totalSlots - 1 : totalSlots);
    expect(calendar).not.toContain('Executive Networking Dinner');
    expect(calendar).toContain('STATUS:TENTATIVE');
    for (const line of calendar.split('\r\n')) {
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    }
  });

  test('escapes commas, semicolons and newlines in accepted talk descriptions', () => {
    const calendar = buildDubaiIcs({
      date: '2026-11-30',
      slots: dubaiProgramme2026.summit.items,
      label: 'Summit, Dubai; 2026',
    });
    expect(calendar).toContain('X-WR-CALNAME:Summit\\, Dubai\\; 2026');
    expect(calendar).toContain('UID:xops-dubai-2026-2026-11-30-1341342@xopsconference.com');
  });

  test('every calendar event has start/end timestamps and no duplicate UID', () => {
    const slots = dubaiProgramme2026.conference.items;
    const calendar = buildDubaiIcs({ date: '2026-12-01', slots, label: 'Conference' });
    const uids = calendar.match(/UID:[^\r\n]+/g) || [];
    expect(uids).toHaveLength(slots.length);
    expect(new Set(uids).size).toBe(uids.length);
    expect((calendar.match(/DTSTART:/g) || []).length).toBe(slots.length);
    expect((calendar.match(/DTEND:/g) || []).length).toBe(slots.length);
  });
});
