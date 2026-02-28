/**
 * BFF API handlers for ticket operations.
 * These can be wired into any server framework (Express, Hono, Vercel, etc.).
 * Exported as pure async functions for flexibility.
 */

import { getDefaultClient } from '../adapters/triskelgate/client';
import { mapTicketTypes } from '../adapters/triskelgate/mapTicket';
import type { TicketV1 } from '../adapters/triskelgate/mapTicket';
import type { TGCheckoutPayload } from '../adapters/triskelgate/types';

// ── GET /api/tickets ────────────────────────────────────────

export interface GetTicketsParams {
  eventId?: string;
}

/**
 * GET /api/tickets
 * Returns Ticket[] (v1 schema) for the first active event, or a specific eventId.
 */
export async function getTickets(params: GetTicketsParams = {}): Promise<TicketV1[]> {
  const client = getDefaultClient();

  let eventId = params.eventId;
  if (!eventId) {
    const events = await client.listEvents();
    if (!events.length) return [];
    eventId = events[0].id;
  }

  const ticketTypes = await client.listTicketTypes(eventId);
  return mapTicketTypes(ticketTypes);
}

// ── POST /api/checkout ──────────────────────────────────────

export interface CheckoutRequest {
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  email: string;
}

export interface CheckoutResponse {
  redirectUrl: string;
  checkoutId: string;
}

/**
 * POST /api/checkout
 * Creates a checkout session and returns the redirect URL.
 */
export async function createCheckout(body: CheckoutRequest): Promise<CheckoutResponse> {
  if (!body.eventId || !body.ticketTypeId || !body.email) {
    throw new ValidationError('eventId, ticketTypeId, and email are required');
  }
  if (!body.quantity || body.quantity < 1) {
    throw new ValidationError('quantity must be >= 1');
  }

  const client = getDefaultClient();
  const payload: TGCheckoutPayload = {
    eventId: body.eventId,
    ticketTypeId: body.ticketTypeId,
    quantity: body.quantity,
    email: body.email,
  };

  const result = await client.createCheckout(payload);
  return {
    redirectUrl: result.redirectUrl,
    checkoutId: result.checkoutId,
  };
}

// ── GET /api/orders/:id ─────────────────────────────────────

export interface OrderResponse {
  id: string;
  status: string;
  tickets: Array<{ id: string; ticketTypeId: string; code: string }>;
  total: number;
  currency: string;
  createdAt: string;
}

/**
 * GET /api/orders/:id
 * Returns the current state of an order.
 */
export async function getOrder(orderId: string): Promise<OrderResponse> {
  if (!orderId) throw new ValidationError('orderId is required');

  const client = getDefaultClient();
  const order = await client.getOrder(orderId);
  return {
    id: order.id,
    status: order.status,
    tickets: order.tickets,
    total: order.total,
    currency: order.currency,
    createdAt: order.createdAt,
  };
}

// ── POST /api/validate ──────────────────────────────────────

export interface ValidateRequest {
  ticketCode: string;
  eventId: string;
}

export interface ValidateResponse {
  valid: boolean;
  ticketId?: string;
  holderName?: string;
  ticketType?: string;
  message?: string;
}

/**
 * POST /api/validate
 * Validates a ticket QR code.
 */
export async function validateTicket(body: ValidateRequest): Promise<ValidateResponse> {
  if (!body.ticketCode || !body.eventId) {
    throw new ValidationError('ticketCode and eventId are required');
  }

  const client = getDefaultClient();
  return client.validateTicket({
    ticketCode: body.ticketCode,
    eventId: body.eventId,
  });
}

// ── Errors ──────────────────────────────────────────────────

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
