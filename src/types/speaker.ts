/**
 * TypeScript types for Speaker and Talk data models
 */

export interface Talk {
  id: string;
  title: string;
  description: string;
  speaker: string; // Can be comma-separated for multiple speakers
  speakers: string[]; // Array of individual speaker names
  timeRaw: string;
  timeISO: string;
  startTime: Date;
  durationMinutes: number;
  durationHuman: string;
  room: string;
  type: string;
  track: 'main' | 'hyperscalers' | 'bsides';
}

export interface Speaker {
  id: string;
  slug: string;
  name: string;
  title?: string;
  company?: string;
  bio?: string;
  image?: string;
  talks: Talk[];
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

export interface SpeakerMetadata {
  name: string;
  title?: string;
  company?: string;
  bio?: string;
  image?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}
