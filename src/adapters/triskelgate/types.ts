/** TriskelGate API response types */

export interface TGEvent {
  id: string;
  name: string;
  description?: string;
  date?: string;
  location?: string;
  status?: string;
}

export interface TGTicketType {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  available: boolean;
  maxPerOrder?: number;
  features?: string[];
  purchaseUrl?: string;
}

export interface TGValidatePayload {
  ticketCode: string;
  eventId: string;
}

export interface TGValidateResponse {
  valid: boolean;
  ticketId?: string;
  holderName?: string;
  ticketType?: string;
  message?: string;
}

export interface TGCheckoutPayload {
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  email: string;
}

export interface TGCheckoutResponse {
  redirectUrl: string;
  checkoutId: string;
}

export interface TGOrder {
  id: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  tickets: Array<{
    id: string;
    ticketTypeId: string;
    code: string;
  }>;
  total: number;
  currency: string;
  createdAt: string;
}
