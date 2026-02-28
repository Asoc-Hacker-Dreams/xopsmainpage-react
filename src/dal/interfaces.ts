import type { Talk, Speaker, Ticket, Sponsor, Favorite } from './types';

export interface AgendaDal {
  getAllTalks(): Promise<Talk[]>;
  getTalkById(id: string): Promise<Talk | undefined>;
  getTalksByDay(day: string): Promise<Talk[]>;
  getTalksByTrack(track: string): Promise<Talk[]>;
  getTalksByRoom(room: string): Promise<Talk[]>;
  putTalks(talks: Talk[]): Promise<void>;
}

export interface SpeakersDal {
  getAllSpeakers(): Promise<Speaker[]>;
  getSpeakerById(id: string): Promise<Speaker | undefined>;
  putSpeakers(speakers: Speaker[]): Promise<void>;
}

export interface TicketsDal {
  getAllTickets(): Promise<Ticket[]>;
  getTicketById(id: string): Promise<Ticket | undefined>;
  getAvailableTickets(): Promise<Ticket[]>;
  putTickets(tickets: Ticket[]): Promise<void>;
}

export interface SponsorsDal {
  getAllSponsors(): Promise<Sponsor[]>;
  getSponsorsByTier(tier: Sponsor['tier']): Promise<Sponsor[]>;
  putSponsors(sponsors: Sponsor[]): Promise<void>;
}

export interface FavoritesDal {
  getFavorites(): Promise<Favorite[]>;
  addFavorite(talkId: string): Promise<void>;
  removeFavorite(talkId: string): Promise<void>;
  isFavorite(talkId: string): Promise<boolean>;
}
