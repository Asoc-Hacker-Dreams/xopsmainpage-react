import type { Talk } from '../dal/types';

function computeEndTime(iso: string, durationMinutes: number): string {
  const [h, m] = iso.split('T')[1].split(':').map(Number);
  const total = h * 60 + m + durationMinutes;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);
}

interface RawTalk {
  speaker: string;
  talk: string;
  description: string;
  timeISO: string;
  durationMinutes: number;
  room: string;
  type?: string;
  track: string;
}

import rawSchedule from './schedule2025.json';

function parseTalks(raw: RawTalk[]): Talk[] {
  return raw.map((r, i) => {
    const day = r.timeISO.split('T')[0];
    const startTime = r.timeISO.split('T')[1];
    const speakerNames = r.speaker.split(',').map(s => s.trim());
    const speakerIds = speakerNames.map(slug);

    return {
      id: `talk-${i + 1}-${slug(r.talk)}`,
      title: r.talk,
      description: r.description,
      day,
      startTime,
      endTime: computeEndTime(r.timeISO, r.durationMinutes),
      track: r.track,
      room: r.room,
      speakerIds,
      tags: r.type ? [r.type] : [],
    } as Talk;
  });
}

export const talks2025: Talk[] = parseTalks(rawSchedule as RawTalk[]);
