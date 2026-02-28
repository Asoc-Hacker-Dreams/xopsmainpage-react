import Dexie, { type Table } from 'dexie';
import type { Talk, Speaker, Ticket, Sponsor, Favorite, CFPSubmission, Meeting } from '../../dal/types';

export class XopsDatabase extends Dexie {
  talks!: Table<Talk, string>;
  speakers!: Table<Speaker, string>;
  tickets!: Table<Ticket, string>;
  sponsors!: Table<Sponsor, string>;
  favorites!: Table<Favorite, string>;
  cfpSubmissions!: Table<CFPSubmission, string>;
  meetings!: Table<Meeting, string>;

  constructor() {
    super('xops-e14');

    this.version(3).stores({
      talks: 'id, day, track, room, startTime',
      speakers: 'id, name',
      tickets: 'id, available',
      sponsors: 'id, tier',
      favorites: 'id, talkId',
      cfpSubmissions: 'id, submittedAt, status, track',
      meetings: 'id, attendeeId, date, time, status, createdAt',
    });
  }
}

export const db = new XopsDatabase();
