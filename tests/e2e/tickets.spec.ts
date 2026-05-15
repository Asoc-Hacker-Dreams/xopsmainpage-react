/**
 * E2E tests for BFF ticket API handlers.
 * These test the full flow: BFF handler → adapter → (mocked) TriskelGate API.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTickets, createCheckout, getOrder, validateTicket, ValidationError } from '../../src/api/tickets';

// Mock the client at module level
vi.mock('../../src/adapters/triskelgate/client', () => {
  const mockClient = {
    listEvents: vi.fn(),
    listTicketTypes: vi.fn(),
    createCheckout: vi.fn(),
    getOrder: vi.fn(),
    validateTicket: vi.fn(),
    circuitState: 'CLOSED',
  };
  return {
    TriskelGateClient: vi.fn(() => mockClient),
    TriskelGateApiError: class extends Error {
      status: number;
      body: string;
      url: string;
      constructor(s: number, b: string, u: string) {
        super(`TriskelGate ${s}`);
        this.status = s;
        this.body = b;
        this.url = u;
      }
    },
    getDefaultClient: () => mockClient,
    __mockClient: mockClient,
  };
});

// Access the mock
import { getDefaultClient } from '../../src/adapters/triskelgate/client';
const mockClient = getDefaultClient() as any;

describe('GET /api/tickets', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns mapped tickets for the first event', async () => {
    mockClient.listEvents.mockResolvedValueOnce([{ id: 'evt-1', name: 'XOps' }]);
    mockClient.listTicketTypes.mockResolvedValueOnce([
      { id: 'tt-1', eventId: 'evt-1', name: 'General', price: 99, currency: 'EUR', available: true },
      { id: 'tt-2', eventId: 'evt-1', name: 'VIP', price: 299, currency: 'EUR', available: true },
    ]);

    const tickets = await getTickets();
    expect(tickets).toHaveLength(2);
    expect(tickets[0]).toMatchObject({ id: 'tt-1', name: 'General', price: 99, currency: 'EUR' });
    expect(tickets[1]).toMatchObject({ id: 'tt-2', name: 'VIP', price: 299 });
  });

  it('returns empty array when no events', async () => {
    mockClient.listEvents.mockResolvedValueOnce([]);
    const tickets = await getTickets();
    expect(tickets).toEqual([]);
  });

  it('uses provided eventId', async () => {
    mockClient.listTicketTypes.mockResolvedValueOnce([]);
    await getTickets({ eventId: 'custom-evt' });
    expect(mockClient.listTicketTypes).toHaveBeenCalledWith('custom-evt');
    expect(mockClient.listEvents).not.toHaveBeenCalled();
  });
});

describe('POST /api/checkout', () => {
  beforeEach(() => vi.clearAllMocks());

  it('creates checkout and returns redirect URL', async () => {
    mockClient.createCheckout.mockResolvedValueOnce({
      redirectUrl: 'https://pay.example.com/session/123',
      checkoutId: 'chk-123',
    });

    const result = await createCheckout({
      eventId: 'evt-1',
      ticketTypeId: 'tt-1',
      quantity: 2,
      email: 'user@example.com',
    });

    expect(result.redirectUrl).toBe('https://pay.example.com/session/123');
    expect(result.checkoutId).toBe('chk-123');
  });

  it('rejects missing fields', async () => {
    await expect(
      createCheckout({ eventId: '', ticketTypeId: 'tt-1', quantity: 1, email: 'a@b.com' }),
    ).rejects.toThrow(ValidationError);
  });

  it('rejects invalid quantity', async () => {
    await expect(
      createCheckout({ eventId: 'e', ticketTypeId: 't', quantity: 0, email: 'a@b.com' }),
    ).rejects.toThrow(ValidationError);
  });
});

describe('GET /api/orders/:id', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns order status', async () => {
    mockClient.getOrder.mockResolvedValueOnce({
      id: 'ord-1',
      status: 'completed',
      tickets: [{ id: 't-1', ticketTypeId: 'tt-1', code: 'QR-ABC' }],
      total: 198,
      currency: 'EUR',
      createdAt: '2026-02-28T10:00:00Z',
    });

    const order = await getOrder('ord-1');
    expect(order.status).toBe('completed');
    expect(order.tickets).toHaveLength(1);
  });

  it('rejects empty orderId', async () => {
    await expect(getOrder('')).rejects.toThrow(ValidationError);
  });
});

describe('POST /api/validate', () => {
  beforeEach(() => vi.clearAllMocks());

  it('validates a valid ticket', async () => {
    mockClient.validateTicket.mockResolvedValueOnce({
      valid: true,
      ticketId: 't-1',
      holderName: 'John Doe',
      ticketType: 'General',
    });

    const result = await validateTicket({ ticketCode: 'QR-123', eventId: 'evt-1' });
    expect(result.valid).toBe(true);
    expect(result.holderName).toBe('John Doe');
  });

  it('rejects missing ticketCode', async () => {
    await expect(
      validateTicket({ ticketCode: '', eventId: 'evt-1' }),
    ).rejects.toThrow(ValidationError);
  });
});
