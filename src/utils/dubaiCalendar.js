import { dubaiAcceptedSessions2026, dubaiSpeakers2026 } from '../data/dubaiAcceptedSessions2026';

// GST is UTC+4 throughout the year. Use UTC dates to avoid device timezone drift.
const escapeIcs = (value) => String(value ?? '')
  .replace(/\\/g, '\\\\')
  .replace(/\r?\n/g, '\\n')
  .replace(/,/g, '\\,')
  .replace(/;/g, '\\;');

const toUtcStamp = (day, time) => {
  const [year, month, date] = day.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  return new Date(Date.UTC(year, month - 1, date, hour - 4, minute))
    .toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
};

const foldLine = (line) => {
  const rows = [];
  let part = '', count = 0;
  for (const c of String(line)) {
    const size = new TextEncoder().encode(c).length;
    if (count + size > 75) {
      rows.push(part);
      part = ' ' + c;
      count = 1 + size;
    } else {
      part += c;
      count += size;
    }
  }
  if (part) rows.push(part);
  return rows.join('\r\n');
};

export const buildDubaiIcs = ({ date, slots, label, language = 'en' }) => {
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0',
    'PRODID:-//X-Ops Conference//Dubai 2026//EN',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'X-WR-CALNAME:' + escapeIcs(label),
  ];
  for (const slot of slots) {
    // Do not put the unconfirmed evening dinner on attendees' calendars.
    if (slot.start >= '19:00') continue;
    const talk = slot.sessionId ? dubaiAcceptedSessions2026[slot.sessionId] : null;
    const title = talk?.title || slot.topic?.[language] || slot.topic?.en || 'X-Ops Dubai';
    const speakers = talk?.speakers.map((id) => dubaiSpeakers2026[id]?.name).filter(Boolean) || [];
    const description = [
      label, speakers.length ? 'Speakers: ' + speakers.join(', ') : '',
      'Schedule is subject to change. Official information: https://dubai.xopsconference.com/',
    ].filter(Boolean).join('\n');
    lines.push(
      'BEGIN:VEVENT',
      'UID:xops-dubai-2026-' + date + '-' + (slot.sessionId || slot.type + '-' + slot.start.replace(':', '')) + '@xopsconference.com',
      'DTSTAMP:' + timestamp,
      'DTSTART:' + toUtcStamp(date, slot.start),
      'DTEND:' + toUtcStamp(date, slot.end),
      'STATUS:TENTATIVE',
      'SUMMARY:' + escapeIcs(title),
      'DESCRIPTION:' + escapeIcs(description),
      'LOCATION:' + escapeIcs('Dubai, United Arab Emirates (venue to be announced)'),
      'URL:' + (slot.sessionId ? 'https://dubai.xopsconference.com/#talk-' + slot.sessionId : 'https://dubai.xopsconference.com/'),
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return lines.map(foldLine).join('\r\n') + '\r\n';
};

export const downloadDubaiIcs = ({ date, slots, label, language, filename }) => {
  const content = buildDubaiIcs({ date, slots, label, language });
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename || 'xops-dubai-2026.ics';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
};