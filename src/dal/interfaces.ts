import type { Talk, Speaker, Ticket, Sponsor, Favorite, CFPSubmission } from './types';

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

export interface CFPDal {
  getAllSubmissions(): Promise<CFPSubmission[]>;
  getSubmissionById(id: string): Promise<CFPSubmission | undefined>;
  submitCFP(submission: Omit<CFPSubmission, 'id' | 'submittedAt' | 'status'>): Promise<string>;
  updateStatus(id: string, status: CFPSubmission['status']): Promise<void>;
}

// E5 Networking interfaces
export interface AttendeesDal {
  getAllAttendees(): Promise<import('./types').Attendee[]>;
  getAttendeeById(id: string): Promise<import('./types').Attendee | undefined>;
  getAttendeesByRole(role: string): Promise<import('./types').Attendee[]>;
  getAttendeesByCompany(company: string): Promise<import('./types').Attendee[]>;
  putAttendees(attendees: import('./types').Attendee[]): Promise<void>;
}

export interface MeetingsDal {
  getAllMeetings(): Promise<import('./types').Meeting[]>;
  getMeetingById(id: string): Promise<import('./types').Meeting | undefined>;
  getMeetingsByAttendee(attendeeId: string): Promise<import('./types').Meeting[]>;
  getMeetingsByDate(date: string): Promise<import('./types').Meeting[]>;
  scheduleMeeting(meeting: Omit<import('./types').Meeting, 'id'>): Promise<string>;
  cancelMeeting(id: string): Promise<void>;
  updateMeetingStatus(id: string, status: import('./types').Meeting['status']): Promise<void>;
}
