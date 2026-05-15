/**
 * Maps TriskelGate ticket types to the internal ticket.v1 schema.
 */

import type { TGTicketType } from './types';

/** Matches src/contracts/ticket.v1.json */
export interface TicketV1 {
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

const ALLOWED_CURRENCIES = new Set(['EUR', 'USD']);

/**
 * Convert a single TriskelGate ticket type to the v1 Ticket schema.
 * Throws if required fields are missing or currency is unsupported.
 */
export function mapTicketTypeToTicket(tt: TGTicketType): TicketV1 {
  if (!tt.id || !tt.name) {
    throw new Error(`Invalid ticket type: missing id or name`);
  }

  const currency = (tt.currency ?? 'EUR').toUpperCase();
  if (!ALLOWED_CURRENCIES.has(currency)) {
    throw new Error(`Unsupported currency: ${currency}`);
  }

  return {
    id: String(tt.id),
    name: tt.name,
    ...(tt.description != null && { description: tt.description }),
    price: Number(tt.price) || 0,
    currency: currency as 'EUR' | 'USD',
    ...(tt.available != null && { available: tt.available }),
    ...(tt.maxPerOrder != null && { maxQuantity: tt.maxPerOrder }),
    ...(tt.features?.length && { features: tt.features }),
    ...(tt.purchaseUrl && { purchaseUrl: tt.purchaseUrl }),
  };
}

/** Map an array, filtering out invalid entries and logging warnings. */
export function mapTicketTypes(types: TGTicketType[]): TicketV1[] {
  const results: TicketV1[] = [];
  for (const tt of types) {
    try {
      results.push(mapTicketTypeToTicket(tt));
    } catch (err) {
      console.warn(`[mapTicket] skipping ticket type ${tt?.id}:`, (err as Error).message);
    }
  }
  return results;
}
