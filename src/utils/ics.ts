import type { Talk } from '../dal/types';

function toICSDate(day: string, time: string): string {
  const [y, m, d] = day.split('-');
  const [h, min] = time.split(':');
  return `${y}${m}${d}T${h}${min}00`;
}

function escapeICS(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export function generateICS(talks: Talk[]): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//X-Ops Conference//Agenda//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  for (const talk of talks) {
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${talk.id}@xopsconference.com`);
    lines.push(`DTSTART;TZID=Europe/Madrid:${toICSDate(talk.day, talk.startTime)}`);
    lines.push(`DTEND;TZID=Europe/Madrid:${toICSDate(talk.day, talk.endTime)}`);
    lines.push(`SUMMARY:${escapeICS(talk.title)}`);
    if (talk.description) {
      lines.push(`DESCRIPTION:${escapeICS(talk.description.slice(0, 500))}`);
    }
    lines.push(`LOCATION:${escapeICS(talk.room)}`);
    lines.push(`CATEGORIES:${escapeICS(talk.track)}`);
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadICS(talks: Talk[], filename = 'xops-agenda.ics') {
  const content = generateICS(talks);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
