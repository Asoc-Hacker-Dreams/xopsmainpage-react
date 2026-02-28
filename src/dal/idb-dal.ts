import { db } from '../storage/idb/db';
import type { AgendaDal, SpeakersDal, TicketsDal, SponsorsDal, FavoritesDal, CFPDal } from './interfaces';
import type { Talk, Speaker, Ticket, Sponsor, Favorite, CFPSubmission } from './types';

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

export class IdbCFPDal implements CFPDal {
  async getAllSubmissions(): Promise<CFPSubmission[]> {
    return db.cfpSubmissions.orderBy('submittedAt').reverse().toArray();
  }
  async getSubmissionById(id: string): Promise<CFPSubmission | undefined> {
    return db.cfpSubmissions.get(id);
  }
  async submitCFP(submission: Omit<CFPSubmission, 'id' | 'submittedAt' | 'status'>): Promise<string> {
    const id = `cfp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullSubmission: CFPSubmission = {
      ...submission,
      id,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };
    await db.cfpSubmissions.add(fullSubmission);
    return id;
  }
  async updateStatus(id: string, status: CFPSubmission['status']): Promise<void> {
    await db.cfpSubmissions.update(id, { status });
  }
}

// E5 Networking DAL implementations
import type { AttendeesDal, MeetingsDal } from './interfaces';
import type { Attendee, Meeting } from './types';

export class IdbAttendeesDal implements AttendeesDal {
  async getAllAttendees(): Promise<Attendee[]> {
    return db.table<Attendee>('attendees').orderBy('name').toArray();
  }
  async getAttendeeById(id: string): Promise<Attendee | undefined> {
    return db.table<Attendee>('attendees').get(id);
  }
  async getAttendeesByRole(role: string): Promise<Attendee[]> {
    return db.table<Attendee>('attendees').where('role').equals(role).toArray();
  }
  async getAttendeesByCompany(company: string): Promise<Attendee[]> {
    return db.table<Attendee>('attendees').where('company').equals(company).toArray();
  }
  async putAttendees(attendees: Attendee[]): Promise<void> {
    await db.table<Attendee>('attendees').bulkPut(attendees);
  }
}

export class IdbMeetingsDal implements MeetingsDal {
  async getAllMeetings(): Promise<Meeting[]> {
    return db.meetings.orderBy('createdAt').reverse().toArray();
  }
  async getMeetingById(id: string): Promise<Meeting | undefined> {
    return db.meetings.get(id);
  }
  async getMeetingsByAttendee(attendeeId: string): Promise<Meeting[]> {
    return db.meetings.where('attendeeId').equals(attendeeId).toArray();
  }
  async getMeetingsByDate(date: string): Promise<Meeting[]> {
    return db.meetings.where('date').equals(date).sortBy('time');
  }
  async scheduleMeeting(meeting: Omit<Meeting, 'id'>): Promise<string> {
    const id = `mtg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullMeeting: Meeting = {
      ...meeting,
      id,
      status: 'scheduled',
    };
    await db.meetings.add(fullMeeting);
    return id;
  }
  async cancelMeeting(id: string): Promise<void> {
    await db.meetings.delete(id);
  }
  async updateMeetingStatus(id: string, status: Meeting['status']): Promise<void> {
    await db.meetings.update(id, { status });
  }
}
