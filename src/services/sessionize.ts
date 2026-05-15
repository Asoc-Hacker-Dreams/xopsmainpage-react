import type { Speaker, Talk } from '../dal/types';

// Sessionize API response types
interface SessionizeSpeaker {
  id: string;
  fullName: string;
  bio: string | null;
  tagLine: string | null;
  profilePicture: string | null;
  isTopSpeaker: boolean;
  links: Array<{ title: string; url: string; linkType: string }>;
  sessions: Array<{ id: number; name: string }>;
  categoryItems: number[];
  questionAnswers: Array<{ id: number; question: string; answer: string }>;
}

interface SessionizeSession {
  id: string;
  title: string;
  description: string | null;
  startsAt: string | null;   // ISO datetime
  endsAt: string | null;     // ISO datetime
  isServiceSession: boolean;
  isPlenumSession: boolean;
  speakers: Array<{ id: string; name: string }>;
  categories: Array<{ id: number; name: string; categoryItems: Array<{ id: number; name: string }> }>;
  roomId: number;
  room: string;
  status: string;
  liveUrl: string | null;
  recordingUrl: string | null;
  tags: string[];
}

interface SessionizeRoom {
  id: number;
  name: string;
  sessions: SessionizeSession[];
  hasOnlyPlenumSessions: boolean;
}

const SESSIONIZE_EVENT_ID = import.meta.env.VITE_SESSIONIZE_EVENT_ID || 'xops-conference-2025';
const BASE_URL = `https://sessionize.com/api/v2/${SESSIONIZE_EVENT_ID}/view`;

export const SESSIONIZE_EVENT_ID_VALUE = SESSIONIZE_EVENT_ID;

function mapSpeaker(s: SessionizeSpeaker): Speaker {
  const social: Speaker['social'] = {};
  for (const link of s.links) {
    const lt = link.linkType?.toLowerCase();
    if (lt === 'twitter' || lt === 'x') {
      social.twitter = link.url
        .replace('https://twitter.com/', '')
        .replace('https://x.com/', '');
    } else if (lt === 'linkedin') {
      social.linkedin = link.url;
    } else if (lt === 'github') {
      social.github = link.url.replace('https://github.com/', '');
    } else if (lt === 'blog' || lt === 'website' || lt === 'other') {
      social.web = link.url;
    }
  }

  return {
    id: s.id,
    name: s.fullName,
    bio: s.bio || undefined,
    role: s.tagLine || undefined,
    photoUrl: s.profilePicture || undefined,
    social: Object.keys(social).length > 0 ? social : undefined,
    talkIds: s.sessions.map(sess => String(sess.id)),
  };
}

function mapSession(session: SessionizeSession): Talk | null {
  if (!session.startsAt || session.isServiceSession) return null;

  // Parse date/time directly from ISO string to avoid timezone conversion issues
  const day = session.startsAt.split('T')[0];
  const startTime = session.startsAt.substring(11, 16);
  const endTime = session.endsAt ? session.endsAt.substring(11, 16) : startTime;

  const allCategoryItems = session.categories.flatMap(c => c.categoryItems);

  const levelItem = allCategoryItems.find(item =>
    ['beginner', 'intermediate', 'advanced'].includes(item.name.toLowerCase())
  );
  const level = levelItem?.name.toLowerCase() as Talk['level'] | undefined;

  // Use first non-level category item as track, fall back to room name
  const trackItem = allCategoryItems.find(
    item => !['beginner', 'intermediate', 'advanced'].includes(item.name.toLowerCase())
  );
  const track = trackItem?.name || session.room || 'General';

  return {
    id: String(session.id),
    title: session.title,
    description: session.description || undefined,
    day,
    startTime,
    endTime,
    track,
    room: session.room,
    speakerIds: session.speakers.map(sp => sp.id),
    tags: session.tags,
    level,
  };
}

export async function fetchSessionizeSpeakers(): Promise<Speaker[]> {
  const res = await fetch(`${BASE_URL}/Speakers`);
  if (!res.ok) throw new Error(`Sessionize speakers fetch failed: ${res.status}`);
  const data: SessionizeSpeaker[] = await res.json();
  return data.map(mapSpeaker);
}

export async function fetchSessionizeTalks(): Promise<Talk[]> {
  const res = await fetch(`${BASE_URL}/Sessions`);
  if (!res.ok) throw new Error(`Sessionize sessions fetch failed: ${res.status}`);
  const rooms: SessionizeRoom[] = await res.json();
  return rooms
    .flatMap(room => room.sessions)
    .map(mapSession)
    .filter((t): t is Talk => t !== null);
}
