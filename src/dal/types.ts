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
