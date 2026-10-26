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
  /** Filled by the API — number of sold (completed) tickets for this type */
  soldCount?: number;
  /** Filled by the API — remaining capacity (maxQuantity - soldCount), null if unlimited */
  availableCount?: number | null;
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
  /**
   * Optional, consented, first/last-touch campaign attribution.
   * Disabled unless VITE_TRISKELL_ATTRIBUTION_ENABLED=true and API supports it.
   * Never include emails, names, raw page URLs, Stripe IDs or click-ID PII.
   */
  attribution?: {
    version: 1;
    firstTouch: Partial<Record<'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_id' | 'utm_content' | 'utm_term', string>>;
    lastTouch: Partial<Record<'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_id' | 'utm_content' | 'utm_term', string>>;
    firstCapturedAt: string;
    lastCapturedAt: string;
    analyticsConsentVersion: string;
    gaClientId?: string;
    gaSessionId?: string;
  };
  /** Enabled only after backend support; server must verify and audit this evidence. */
  legalAcceptance?: {
    accepted: true;
    edition: 'madrid' | 'dubai';
    legalVersion: string;
    acceptedAtClient: string;
    locale: string;
  };
}

export interface TGCheckoutResponse {
  success: boolean;
  sessionUrl?: string;
  redirectUrl?: string;
  checkoutId?: string;
  message?: string;
  error?: string;
}

export interface TGVerifiedEcommerce {
  /** Canonical, server-created order number, identical to orderNumber. */
  transaction_id: string;
  /** Net item revenue, EXCLUDING shipping and taxes, from settled order. */
  value: number;
  /** ISO-4217 currency; EUR for Madrid, AED for Dubai when applicable. */
  currency: string;
  tax?: number;
  shipping?: number;
  coupon?: string;
  edition?: 'madrid' | 'dubai';
  items: Array<{
    item_id: string;
    item_name: string;
    /** Net unit price after discounts, excluding taxes. */
    price: number;
    quantity: number;
    item_category?: string;
    item_variant?: string;
    affiliation?: string;
  }>;
}

export interface TGCheckoutSessionStatus {
  success?: boolean;
  /** Must be server-verified paid/completed, not client-provided. */
  status: string;
  /** Populate only after verified paid/completed order and validated webhook. */
  ecommerce?: TGVerifiedEcommerce;
  orderId?: number;
  orderNumber?: string;
  totalAmount?: number;
  customerEmail?: string;
  customerName?: string;
  eventId?: number;
  tickets?: Array<{
    id: number;
    uuid: string;
    qrCode: string;
    ticketNumber: string;
    holderName?: string | null;
    holderEmail?: string | null;
    ticketTypeName?: string | null;
  }>;
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
