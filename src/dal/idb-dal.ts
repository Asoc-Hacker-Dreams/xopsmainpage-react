import { db } from '../storage/idb/db';
import type { AgendaDal, SpeakersDal, TicketsDal, SponsorsDal, FavoritesDal } from './interfaces';
import type { Talk, Speaker, Ticket, Sponsor, Favorite } from './types';

export class IdbAgendaDal implements AgendaDal {
  async getAllTalks(): Promise<Talk[]> {
    return db.talks.orderBy('startTime').toArray();
  }
  async getTalkById(id: string): Promise<Talk | undefined> {
    return db.talks.get(id);
  }
  async getTalksByDay(day: string): Promise<Talk[]> {
    return db.talks.where('day').equals(day).sortBy('startTime');
  }
  async getTalksByTrack(track: string): Promise<Talk[]> {
    return db.talks.where('track').equals(track).sortBy('startTime');
  }
  async getTalksByRoom(room: string): Promise<Talk[]> {
    return db.talks.where('room').equals(room).sortBy('startTime');
  }
  async putTalks(talks: Talk[]): Promise<void> {
    await db.talks.bulkPut(talks);
  }
}

export class IdbSpeakersDal implements SpeakersDal {
  async getAllSpeakers(): Promise<Speaker[]> {
    return db.speakers.orderBy('name').toArray();
  }
  async getSpeakerById(id: string): Promise<Speaker | undefined> {
    return db.speakers.get(id);
  }
  async putSpeakers(speakers: Speaker[]): Promise<void> {
    await db.speakers.bulkPut(speakers);
  }
}

export class IdbTicketsDal implements TicketsDal {
  async getAllTickets(): Promise<Ticket[]> {
    return db.tickets.toArray();
  }
  async getTicketById(id: string): Promise<Ticket | undefined> {
    return db.tickets.get(id);
  }
  async getAvailableTickets(): Promise<Ticket[]> {
    return db.tickets.where('available').equals(1).toArray();
  }
  async putTickets(tickets: Ticket[]): Promise<void> {
    await db.tickets.bulkPut(tickets);
  }
}

export class IdbSponsorsDal implements SponsorsDal {
  async getAllSponsors(): Promise<Sponsor[]> {
    return db.sponsors.toArray();
  }
  async getSponsorsByTier(tier: Sponsor['tier']): Promise<Sponsor[]> {
    return db.sponsors.where('tier').equals(tier).toArray();
  }
  async putSponsors(sponsors: Sponsor[]): Promise<void> {
    await db.sponsors.bulkPut(sponsors);
  }
}

export class IdbFavoritesDal implements FavoritesDal {
  async getFavorites(): Promise<Favorite[]> {
    return db.favorites.toArray();
  }
  async addFavorite(talkId: string): Promise<void> {
    const id = `fav-${talkId}`;
    await db.favorites.put({ id, talkId, addedAt: new Date().toISOString() });
  }
  async removeFavorite(talkId: string): Promise<void> {
    const id = `fav-${talkId}`;
    await db.favorites.delete(id);
  }
  async isFavorite(talkId: string): Promise<boolean> {
    const id = `fav-${talkId}`;
    return (await db.favorites.get(id)) !== undefined;
  }
}
