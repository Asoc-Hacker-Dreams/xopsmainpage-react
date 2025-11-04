import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateICS, downloadICS, generateGoogleCalendarLink, exportToCalendar, exportAgenda } from './calendarUtils';

describe('calendarUtils', () => {
  const mockEvent = {
    speaker: 'Juan Vicente Herrera',
    talk: 'Keynote de Bienvenida',
    description: 'Bienvenida oficial a X-Ops Conference Madrid 2025',
    timeISO: '2025-11-21T09:30',
    durationMinutes: 30,
    room: 'Aula magna',
    type: 'keynote',
    track: 'main'
  };

  const mockEvent2 = {
    speaker: 'Luis Guirigay',
    talk: 'Keynote del track exclusivo de AWS',
    description: 'Presentación del track AWS',
    timeISO: '2025-11-21T10:30',
    durationMinutes: 30,
    room: 'Hyperscalers',
    type: 'keynote',
    track: 'hyperscalers'
  };

  describe('generateICS', () => {
    it('generates valid ICS content for a single event', () => {
      const icsContent = generateICS(mockEvent);
      
      expect(icsContent).toContain('BEGIN:VCALENDAR');
      expect(icsContent).toContain('VERSION:2.0');
      expect(icsContent).toContain('END:VCALENDAR');
      expect(icsContent).toContain('BEGIN:VEVENT');
      expect(icsContent).toContain('END:VEVENT');
      expect(icsContent).toContain('SUMMARY:Keynote de Bienvenida');
      expect(icsContent).toContain('LOCATION:Aula magna (main)');
      expect(icsContent).toContain('ORGANIZER:Juan Vicente Herrera');
    });

    it('generates valid ICS content for multiple events', () => {
      const icsContent = generateICS([mockEvent, mockEvent2]);
      
      expect(icsContent).toContain('BEGIN:VCALENDAR');
      expect(icsContent).toContain('END:VCALENDAR');
      
      // Count VEVENT occurrences
      const veventCount = (icsContent.match(/BEGIN:VEVENT/g) || []).length;
      expect(veventCount).toBe(2);
      
      expect(icsContent).toContain('SUMMARY:Keynote de Bienvenida');
      expect(icsContent).toContain('SUMMARY:Keynote del track exclusivo de AWS');
    });

    it('removes duplicate events based on same time and title', () => {
      const duplicateEvent = { ...mockEvent };
      const icsContent = generateICS([mockEvent, duplicateEvent]);
      
      // Should only have one VEVENT
      const veventCount = (icsContent.match(/BEGIN:VEVENT/g) || []).length;
      expect(veventCount).toBe(1);
    });

    it('includes VTIMEZONE component', () => {
      const icsContent = generateICS(mockEvent);
      
      expect(icsContent).toContain('BEGIN:VTIMEZONE');
      expect(icsContent).toContain('TZID:Europe/Madrid');
      expect(icsContent).toContain('END:VTIMEZONE');
    });

    it('generates proper datetime format in UTC', () => {
      const icsContent = generateICS(mockEvent);
      
      // Check that datetime includes TZID=Europe/Madrid
      expect(icsContent).toMatch(/DTSTART;TZID=Europe\/Madrid:\d{8}T\d{6}/);
      expect(icsContent).toMatch(/DTEND;TZID=Europe\/Madrid:\d{8}T\d{6}/);
    });

    it('calculates correct end time based on duration', () => {
      const icsContent = generateICS(mockEvent);
      
      // Event starts at 09:30 and lasts 30 minutes, so should end at 10:00 in local time (Madrid)
      expect(icsContent).toContain('DTSTART;TZID=Europe/Madrid:20251121T093000');
      expect(icsContent).toContain('DTEND;TZID=Europe/Madrid:20251121T100000');
    });

    it('escapes special characters in text fields', () => {
      const eventWithSpecialChars = {
        ...mockEvent,
        talk: 'Test; with, special\\characters\nand newlines',
        description: 'Description; with, special\\chars'
      };
      
      const icsContent = generateICS(eventWithSpecialChars);
      
      expect(icsContent).toContain('\\;');
      expect(icsContent).toContain('\\,');
      expect(icsContent).toContain('\\\\');
      expect(icsContent).toContain('\\n');
    });

    it('generates unique UID for each event', () => {
      const icsContent = generateICS([mockEvent, mockEvent2]);
      
      const uidMatches = icsContent.match(/UID:[^\n]+/g);
      expect(uidMatches).toHaveLength(2);
      expect(uidMatches[0]).not.toBe(uidMatches[1]);
      expect(uidMatches[0]).toContain('@xopsconference.com');
    });

    it('includes required ICS properties', () => {
      const icsContent = generateICS(mockEvent);
      
      expect(icsContent).toContain('PRODID:');
      expect(icsContent).toContain('CALSCALE:GREGORIAN');
      expect(icsContent).toContain('METHOD:PUBLISH');
      expect(icsContent).toContain('DTSTAMP:');
      expect(icsContent).toContain('STATUS:CONFIRMED');
      expect(icsContent).toContain('SEQUENCE:0');
    });
  });

  describe('downloadICS', () => {
    let createElementSpy;
    let appendChildSpy;
    let removeChildSpy;
    let clickSpy;
    let createObjectURLSpy;
    let revokeObjectURLSpy;

    beforeEach(() => {
      // Mock URL methods if they don't exist in test environment
      if (!global.URL.createObjectURL) {
        global.URL.createObjectURL = vi.fn();
      }
      if (!global.URL.revokeObjectURL) {
        global.URL.revokeObjectURL = vi.fn();
      }

      // Mock DOM elements
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn()
      };
      clickSpy = mockLink.click;

      createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
      appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
      removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});
      createObjectURLSpy = vi.spyOn(global.URL, 'createObjectURL').mockReturnValue('blob:mock-url');
      revokeObjectURLSpy = vi.spyOn(global.URL, 'revokeObjectURL').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('creates a download link with correct properties', () => {
      const icsContent = 'BEGIN:VCALENDAR\nEND:VCALENDAR';
      downloadICS(icsContent, 'test.ics');

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(appendChildSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
    });

    it('creates a blob with correct MIME type', () => {
      const icsContent = 'BEGIN:VCALENDAR\nEND:VCALENDAR';
      downloadICS(icsContent, 'test.ics');

      expect(createObjectURLSpy).toHaveBeenCalled();
      // Blob constructor is called with correct arguments
      const blobCall = createObjectURLSpy.mock.calls[0][0];
      expect(blobCall.type).toBe('text/calendar;charset=utf-8');
    });

    it('uses default filename when not provided', () => {
      const icsContent = 'BEGIN:VCALENDAR\nEND:VCALENDAR';
      
      downloadICS(icsContent);

      const mockLink = createElementSpy.mock.results[0].value;
      expect(mockLink.download).toBe('event.ics');
    });

    it('revokes object URL after download', () => {
      const icsContent = 'BEGIN:VCALENDAR\nEND:VCALENDAR';
      downloadICS(icsContent);

      expect(revokeObjectURLSpy).toHaveBeenCalled();
    });
  });

  describe('generateGoogleCalendarLink', () => {
    it('generates a valid Google Calendar URL', () => {
      const link = generateGoogleCalendarLink(mockEvent);

      expect(link).toContain('https://calendar.google.com/calendar/render');
      expect(link).toContain('action=TEMPLATE');
      expect(link).toContain('text=');
      expect(link).toContain('dates=');
      expect(link).toContain('details=');
      expect(link).toContain('location=');
    });

    it('properly encodes event title', () => {
      const link = generateGoogleCalendarLink(mockEvent);

      expect(link).toContain('text=Keynote%20de%20Bienvenida');
    });

    it('includes location with track', () => {
      const link = generateGoogleCalendarLink(mockEvent);

      expect(link).toContain('location=Aula%20magna%20(main)');
    });

    it('formats dates correctly for Google Calendar', () => {
      const link = generateGoogleCalendarLink(mockEvent);

      // Should include dates in format YYYYMMDDTHHMMSSZ/YYYYMMDDTHHMMSSZ
      expect(link).toMatch(/dates=\d{8}T\d{6}Z\/\d{8}T\d{6}Z/);
    });

    it('handles events without track', () => {
      const eventWithoutTrack = { ...mockEvent, track: undefined };
      const link = generateGoogleCalendarLink(eventWithoutTrack);

      expect(link).toContain('location=Aula%20magna');
      expect(link).not.toContain('(undefined)');
    });
  });

  describe('exportToCalendar', () => {
    let windowOpenSpy;

    beforeEach(() => {
      windowOpenSpy = vi.spyOn(window, 'open').mockReturnValue({
        closed: false,
        close: vi.fn()
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('attempts to open Google Calendar link', () => {
      exportToCalendar(mockEvent);

      expect(windowOpenSpy).toHaveBeenCalled();
      const calledUrl = windowOpenSpy.mock.calls[0][0];
      expect(calledUrl).toContain('https://calendar.google.com/calendar/render');
    });

    it('opens link in new tab', () => {
      exportToCalendar(mockEvent);

      expect(windowOpenSpy).toHaveBeenCalledWith(
        expect.any(String),
        '_blank'
      );
    });
  });

  describe('exportAgenda', () => {
    let createElementSpy;
    let appendChildSpy;
    let removeChildSpy;

    beforeEach(() => {
      // Mock URL methods if they don't exist in test environment
      if (!global.URL.createObjectURL) {
        global.URL.createObjectURL = vi.fn();
      }
      if (!global.URL.revokeObjectURL) {
        global.URL.revokeObjectURL = vi.fn();
      }

      const mockLink = {
        href: '',
        download: '',
        click: vi.fn()
      };

      createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
      appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
      removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});
      vi.spyOn(global.URL, 'createObjectURL').mockReturnValue('blob:mock-url');
      vi.spyOn(global.URL, 'revokeObjectURL').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('exports multiple events to ICS file', () => {
      exportAgenda([mockEvent, mockEvent2], 'mi-agenda.ics');

      expect(createElementSpy).toHaveBeenCalledWith('a');
      const mockLink = createElementSpy.mock.results[0].value;
      expect(mockLink.download).toBe('mi-agenda.ics');
    });

    it('uses default filename when not provided', () => {
      exportAgenda([mockEvent, mockEvent2]);

      const mockLink = createElementSpy.mock.results[0].value;
      expect(mockLink.download).toBe('xops-mi-agenda.ics');
    });

    it('handles empty agenda array', () => {
      exportAgenda([]);

      expect(createElementSpy).toHaveBeenCalled();
      // Should still create a valid ICS file, just with no events
    });
  });
});
