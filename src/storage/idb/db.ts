import Dexie, { type Table } from 'dexie';
import type { Talk, Speaker, Ticket, Sponsor, Favorite, CFPSubmission } from '../../dal/types';

export class XopsDatabase extends Dexie {
  talks!: Table<Talk, string>;
  speakers!: Table<Speaker, string>;
  tickets!: Table<Ticket, string>;
  sponsors!: Table<Sponsor, string>;
  favorites!: Table<Favorite, string>;
  cfpSubmissions!: Table<CFPSubmission, string>;

  constructor() {
    super('xops-e14');

    this.version(2).stores({
      talks: 'id, day, track, room, startTime',
      speakers: 'id, name',
      tickets: 'id, available',
      sponsors: 'id, tier',
      favorites: 'id, talkId',
      cfpSubmissions: 'id, submittedAt, status, track',
    });
  }
}

export const db = new XopsDatabase();
