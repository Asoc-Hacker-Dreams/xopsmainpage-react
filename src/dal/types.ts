// Domain types derived from JSON Schemas v1.0

export interface Talk {
  id: string;
  title: string;
  description?: string;
  day: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;
  track: string;
  room: string;
  speakerIds?: string[];
  tags?: string[];
  language?: 'es' | 'en';
  level?: 'beginner' | 'intermediate' | 'advanced';
}

export interface Speaker {
  id: string;
  name: string;
  bio?: string;
  company?: string;
  role?: string;
  photoUrl?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    web?: string;
  };
  talkIds?: string[];
}

export interface Ticket {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: 'EUR' | 'USD';
  available?: boolean;
  maxQuantity?: number;
  features?: string[];
  purchaseUrl?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze' | 'community';
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
}

export interface Favorite {
  id: string;
  talkId: string;
  addedAt: string; // ISO timestamp
}

export interface CFPSubmission {
  id: string;
  name: string;
  email: string;
  bio: string;
  talkTitle: string;
  abstract: string;
  track: string;
  submittedAt: string; // ISO timestamp
  status?: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

// Networking types for E5
export interface Attendee {
  id: string;
  name: string;
  email?: string;
  company: string;
  role: string;
  bio?: string;
  photoUrl?: string;
  interests?: string[];
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  createdAt?: string;
}

export interface Meeting {
  id: string;
  attendeeId: string;
  attendeeName: string;
  date: string;
  time: string;
  duration: string;
  topic: string;
  notes?: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
}
