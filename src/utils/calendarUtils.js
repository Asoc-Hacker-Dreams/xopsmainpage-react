/**
 * Calendar utility functions for generating ICS files and calendar links
 * Compliant with RFC5545 (iCalendar specification)
 */

/**
 * Formats a date to ICS format (YYYYMMDDTHHMMSSZ)
 * @param {string} isoDateTime - ISO 8601 datetime string (e.g., "2025-11-21T09:30")
 * @returns {string} ICS formatted datetime
 */
const formatDateToICS = (isoDateTime) => {
  // Parse the ISO datetime - assume it's in local timezone (Europe/Madrid)
  // The schedule data uses local time without timezone indicator
  const date = new Date(isoDateTime);
  
  // Format as YYYYMMDDTHHMMSSZ (UTC format)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
};

/**
 * Calculates end time based on start time and duration
 * @param {string} startTimeISO - ISO 8601 datetime string
 * @param {number} durationMinutes - Duration in minutes
 * @returns {string} ICS formatted end datetime
 */
const calculateEndTime = (startTimeISO, durationMinutes) => {
  const startDate = new Date(startTimeISO);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
  return formatDateToICS(endDate.toISOString());
};

/**
 * Escapes special characters in ICS text fields
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
const escapeICSText = (text) => {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
};

/**
 * Generates VTIMEZONE component for Europe/Madrid timezone
 * @returns {string} VTIMEZONE component
 */
const generateVTIMEZONE = () => {
  return `BEGIN:VTIMEZONE
TZID:Europe/Madrid
BEGIN:DAYLIGHT
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
TZNAME:CEST
DTSTART:19700329T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
TZNAME:CET
DTSTART:19701025T030000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
END:STANDARD
END:VTIMEZONE`;
};

/**
 * Generates a unique identifier for an event
 * @param {Object} event - Event object
 * @returns {string} Unique identifier
 */
const generateUID = (event) => {
  const timestamp = new Date(event.timeISO).getTime();
  const sanitizedTitle = event.talk.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  return `${timestamp}-${sanitizedTitle}@xopsconference.com`;
};

/**
 * Generates a VEVENT component for a single event
 * @param {Object} event - Event object with properties: talk, speaker, description, timeISO, durationMinutes, room, track
 * @returns {string} VEVENT component
 */
const generateVEVENT = (event) => {
  const dtStart = formatDateToICS(event.timeISO);
  const dtEnd = calculateEndTime(event.timeISO, event.durationMinutes);
  const uid = generateUID(event);
  const dtstamp = formatDateToICS(new Date().toISOString());
  
  const summary = escapeICSText(event.talk);
  const description = escapeICSText(event.description || '');
  const location = escapeICSText(`${event.room}${event.track ? ` (${event.track})` : ''}`);
  const organizer = escapeICSText(event.speaker);
  
  return `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART;TZID=Europe/Madrid:${dtStart}
DTEND;TZID=Europe/Madrid:${dtEnd}
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${location}
ORGANIZER:${organizer}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT`;
};

/**
 * Generates a complete ICS file content for one or multiple events
 * @param {Object|Array} eventOrEvents - Single event object or array of events
 * @returns {string} Complete ICS file content
 */
export const generateICS = (eventOrEvents) => {
  const events = Array.isArray(eventOrEvents) ? eventOrEvents : [eventOrEvents];
  
  // Remove duplicates based on UID
  const uniqueEvents = events.filter((event, index, self) =>
    index === self.findIndex((e) => generateUID(e) === generateUID(event))
  );
  
  const vevents = uniqueEvents.map(event => generateVEVENT(event)).join('\n');
  
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//X-Ops Conference//Calendar Export//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:X-Ops Conference Madrid 2025
X-WR-TIMEZONE:Europe/Madrid
X-WR-CALDESC:X-Ops Conference Madrid 2025 Events
${generateVTIMEZONE()}
${vevents}
END:VCALENDAR`;

  return icsContent;
};

/**
 * Downloads an ICS file
 * @param {string} icsContent - ICS file content
 * @param {string} filename - Filename for the download
 */
export const downloadICS = (icsContent, filename = 'event.ics') => {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

/**
 * Generates a Google Calendar deep link
 * @param {Object} event - Event object
 * @returns {string} Google Calendar URL
 */
export const generateGoogleCalendarLink = (event) => {
  const startDate = new Date(event.timeISO);
  const endDate = new Date(startDate.getTime() + event.durationMinutes * 60000);
  
  // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
  const formatForGoogle = (date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };
  
  const dates = `${formatForGoogle(startDate)}/${formatForGoogle(endDate)}`;
  const text = encodeURIComponent(event.talk);
  const details = encodeURIComponent(event.description || '');
  const location = encodeURIComponent(`${event.room}${event.track ? ` (${event.track})` : ''}`);
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
};

/**
 * Exports an event to calendar with Google Calendar deep link fallback to ICS
 * @param {Object} event - Event object
 * @param {string} filename - Optional filename for ICS fallback
 */
export const exportToCalendar = (event, filename = 'xops-event.ics') => {
  // Try to open Google Calendar link
  const googleLink = generateGoogleCalendarLink(event);
  const newWindow = window.open(googleLink, '_blank');
  
  // Fallback to ICS download if popup is blocked or user prefers
  setTimeout(() => {
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      const icsContent = generateICS(event);
      downloadICS(icsContent, filename);
    }
  }, 500);
};

/**
 * Exports multiple events (agenda) to ICS file
 * @param {Array} events - Array of event objects
 * @param {string} filename - Filename for the download
 */
export const exportAgenda = (events, filename = 'xops-mi-agenda.ics') => {
  const icsContent = generateICS(events);
  downloadICS(icsContent, filename);
};
