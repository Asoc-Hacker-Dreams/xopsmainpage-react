/**
 * Contract tests for TriskelGate adapter.
 * Validates that mapped responses conform to the ticket.v1 schema.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import ticketSchema from '../../src/contracts/ticket.v1.json';
import { mapTicketTypeToTicket, mapTicketTypes } from '../../src/adapters/triskelgate/mapTicket';
import { TriskelGateClient } from '../../src/adapters/triskelgate/client';
import { CircuitBreaker, CircuitBreakerError } from '../../src/adapters/triskelgate/circuitBreaker';
import type { TGTicketType } from '../../src/adapters/triskelgate/types';

// ── Schema validator ─────────────────────────────────────────

const ajv = new Ajv({ allErrors: true });
try {
  // ajv-formats may not be installed; skip if so
  if (addFormats) addFormats(ajv);
} catch {}
const validateTicket = ajv.compile(ticketSchema);

// ── Fixtures ─────────────────────────────────────────────────

const VALID_TICKET_TYPE: TGTicketType = {
  id: 'tt-001',
  eventId: 'evt-001',
  name: 'General Admission',
  description: 'Full access to all sessions',
  price: 199,
  currency: 'EUR',
  available: true,
  maxPerOrder: 5,
  features: ['All sessions', 'Lunch included', 'Swag bag'],
  purchaseUrl: 'https://tickets.xopsconference.com/checkout/tt-001',
};

const MINIMAL_TICKET_TYPE: TGTicketType = {
  id: 'tt-002',
  eventId: 'evt-001',
  name: 'VIP',
  price: 499,
  currency: 'USD',
  available: false,
};

// ── mapTicket tests ──────────────────────────────────────────

describe('mapTicketTypeToTicket', () => {
  it('maps a full ticket type to v1 schema', () => {
    const ticket = mapTicketTypeToTicket(VALID_TICKET_TYPE);
    expect(ticket.id).toBe('tt-001');
    expect(ticket.name).toBe('General Admission');
    expect(ticket.price).toBe(199);
    expect(ticket.currency).toBe('EUR');
    expect(ticket.maxQuantity).toBe(5);
    expect(ticket.features).toEqual(['All sessions', 'Lunch included', 'Swag bag']);
  });

  it('conforms to ticket.v1 JSON schema', () => {
    const ticket = mapTicketTypeToTicket(VALID_TICKET_TYPE);
    const valid = validateTicket(ticket);
    expect(valid).toBe(true);
    if (!valid) console.error(validateTicket.errors);
  });

  it('maps minimal ticket type', () => {
    const ticket = mapTicketTypeToTicket(MINIMAL_TICKET_TYPE);
    const valid = validateTicket(ticket);
    expect(valid).toBe(true);
    expect(ticket.currency).toBe('USD');
    expect(ticket.available).toBe(false);
  });

  it('rejects unsupported currency', () => {
    const bad = { ...VALID_TICKET_TYPE, currency: 'GBP' };
    expect(() => mapTicketTypeToTicket(bad)).toThrow('Unsupported currency');
  });

  it('rejects missing id', () => {
    const bad = { ...VALID_TICKET_TYPE, id: '' };
    expect(() => mapTicketTypeToTicket(bad)).toThrow('missing id or name');
  });
});

describe('mapTicketTypes (batch)', () => {
  it('filters out invalid entries without throwing', () => {
    const input: TGTicketType[] = [
      VALID_TICKET_TYPE,
      { ...VALID_TICKET_TYPE, id: '', name: '' }, // invalid
      MINIMAL_TICKET_TYPE,
    ];
    const result = mapTicketTypes(input);
    expect(result).toHaveLength(2);
  });

  it('all results conform to schema', () => {
    const result = mapTicketTypes([VALID_TICKET_TYPE, MINIMAL_TICKET_TYPE]);
    for (const ticket of result) {
      expect(validateTicket(ticket)).toBe(true);
    }
  });
});

// ── CircuitBreaker tests ─────────────────────────────────────

describe('CircuitBreaker', () => {
  it('allows calls in CLOSED state', async () => {
    const cb = new CircuitBreaker();
    const result = await cb.execute(async () => 42);
    expect(result).toBe(42);
    expect(cb.currentState).toBe('CLOSED');
  });

  it('opens after threshold failures', async () => {
    const cb = new CircuitBreaker({ failureThreshold: 3, resetTimeoutMs: 100 });
    for (let i = 0; i < 3; i++) {
      await cb.execute(async () => { throw new Error('fail'); }).catch(() => {});
    }
    expect(cb.currentState).toBe('OPEN');
    await expect(cb.execute(async () => 1)).rejects.toThrow(CircuitBreakerError);
  });

  it('transitions to HALF_OPEN after reset timeout', async () => {
    const cb = new CircuitBreaker({ failureThreshold: 1, resetTimeoutMs: 50 });
    await cb.execute(async () => { throw new Error('fail'); }).catch(() => {});
    expect(cb.currentState).toBe('OPEN');

    await new Promise((r) => setTimeout(r, 60));
    const result = await cb.execute(async () => 'recovered');
    expect(result).toBe('recovered');
    expect(cb.currentState).toBe('CLOSED');
  });
});

// ── Client tests (mocked fetch) ─────────────────────────────

describe('TriskelGateClient', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
  });

  function jsonResponse(data: unknown, status = 200) {
    return {
      ok: status >= 200 && status < 300,
      status,
      statusText: status === 200 ? 'OK' : 'Error',
      json: async () => data,
      text: async () => JSON.stringify(data),
    };
  }

  it('listEvents fetches /api/events', async () => {
    const events = [{ id: 'evt-1', name: 'XOps 2026' }];
    mockFetch.mockResolvedValueOnce(jsonResponse(events));

    const client = new TriskelGateClient({ baseUrl: 'https://test.local' });
    const result = await client.listEvents();

    expect(result).toEqual(events);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://test.local/api/events',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('listTicketTypes fetches /api/events/:id/ticket-types', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse([VALID_TICKET_TYPE]));

    const client = new TriskelGateClient({ baseUrl: 'https://test.local' });
    const result = await client.listTicketTypes('evt-001');

    expect(result).toHaveLength(1);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://test.local/api/events/evt-001/ticket-types',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('validateTicket posts to /api/validate', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ valid: true, ticketId: 't-1' }));

    const client = new TriskelGateClient({ baseUrl: 'https://test.local' });
    const result = await client.validateTicket({ ticketCode: 'QR123', eventId: 'evt-001' });

    expect(result.valid).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://test.local/api/validate',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('throws TriskelGateApiError on non-2xx', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ error: 'not found' }, 404));

    const client = new TriskelGateClient({ baseUrl: 'https://test.local' });
    await expect(client.listEvents()).rejects.toThrow('TriskelGate 404');
  });

  it('sends Authorization header when apiKey provided', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse([]));

    const client = new TriskelGateClient({ baseUrl: 'https://test.local', apiKey: 'sk-test' });
    await client.listEvents();

    const callHeaders = mockFetch.mock.calls[0][1].headers;
    expect(callHeaders['Authorization']).toBe('Bearer sk-test');
  });
});
