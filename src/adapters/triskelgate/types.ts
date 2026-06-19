/** TriskelGate API response types */

export interface TGTicketType {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  available?: boolean;
  isActive?: boolean;
  maxQuantity?: number;
  maxPerOrder?: number;
  minPerOrder?: number;
  saleStartDate?: string;
  saleEndDate?: string;
  displayOrder?: number;
  features?: string[];
  purchaseUrl?: string;
}

export interface TGEvent {
  id: string;
  name: string;
  description?: string;
  slug?: string;
  startDate?: string;
  endDate?: string;
  date?: string;
  location?: string;
  status?: string;
  organizerId?: number;
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
  eventId: number | string;
  ticketTypeId: number | string;
  quantity: number;
  customerEmail: string;
  customerName?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface TGCheckoutResponse {
  success: boolean;
  sessionUrl?: string;
  redirectUrl?: string;
  checkoutId?: string;
  message?: string;
  error?: string;
}

export interface TGCheckoutSessionStatus {
  status: string;
}

/** Standard wrapper the TriskelGate API uses for list endpoints */
export interface TGApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
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
