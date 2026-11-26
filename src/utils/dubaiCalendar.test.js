import { describe, expect, test } from 'vitest';
import { buildDubaiIcs } from './dubaiCalendar';
import { dubaiProgramme2026 } from '../data/dubaiProgramme2026';

describe('Dubai calendar exports', () => {
  test('exports the single 30 Nov day in GST/UTC with one VEVENT per slot', () => {
    const slots = dubaiProgramme2026.items;
    const calendar = buildDubaiIcs({ date: '2026-11-30', slots, label: 'X-Ops Dubai 2026', language: 'en' });
    expect(calendar.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(calendar.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(calendar).toContain('DTSTART:20261130T050000Z');
    expect(calendar.match(/BEGIN:VEVENT/g)).toHaveLength(slots.length);
    // La sede está por confirmar: el .ics no anuncia DKP.
    expect(calendar).not.toMatch(/DKP|Dubai Knowledge Park/i);
    // escapeIcs escapa la coma pero no los parentesis: el LOCATION real es
    // "Dubai\, UAE (venue to be confirmed)".
    expect(calendar).toContain('LOCATION:Dubai\\, UAE (venue to be confirmed)');
    expect(calendar).not.toContain('venue to be announced');
    expect(calendar).not.toContain('Executive Networking Dinner');
    for (const line of calendar.split('\r\n')) {
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    }
  });

  test('escapes commas, semicolons and newlines in accepted talk descriptions', () => {
    const calendar = buildDubaiIcs({
      date: '2026-11-30',
      slots: dubaiProgramme2026.items,
      label: 'Summit, Dubai; 2026',
    });
    expect(calendar).toContain('X-WR-CALNAME:Summit\\, Dubai\\; 2026');
    expect(calendar).toContain('UID:xops-dubai-2026-2026-11-30-1341342@xopsconference.com');
  });

  test('every calendar event has start/end timestamps and no duplicate UID', () => {
    const slots = dubaiProgramme2026.items;
    const calendar = buildDubaiIcs({ date: '2026-11-30', slots, label: 'X-Ops Dubai 2026' });
    const uids = calendar.match(/UID:[^\r\n]+/g) || [];
    expect(uids).toHaveLength(slots.length);
    expect(new Set(uids).size).toBe(uids.length);
    expect((calendar.match(/DTSTART:/g) || []).length).toBe(slots.length);
    expect((calendar.match(/DTEND:/g) || []).length).toBe(slots.length);
  });
});
