import { describe, it, expect } from 'vitest';
import { mapTicketTypeToTicket, mapTicketTypes } from './mapTicket';

describe('mapTicketTypeToTicket', () => {
  const base = { id: '1', eventId: '1', name: 'General', price: 100 };

  it('accepts AED and preserves it', () => {
    const ticket = mapTicketTypeToTicket({ ...base, currency: 'AED' });
    expect(ticket.currency).toBe('AED');
  });

  it('normalizes lowercase currency codes', () => {
    const ticket = mapTicketTypeToTicket({ ...base, currency: 'aed' });
    expect(ticket.currency).toBe('AED');
  });

  it('keeps accepting EUR and USD', () => {
    expect(mapTicketTypeToTicket({ ...base, currency: 'EUR' }).currency).toBe('EUR');
    expect(mapTicketTypeToTicket({ ...base, currency: 'USD' }).currency).toBe('USD');
  });

  it('defaults to EUR when currency is missing', () => {
    const ticket = mapTicketTypeToTicket(base);
    expect(ticket.currency).toBe('EUR');
  });

  it('rejects an unknown currency (GBP)', () => {
    expect(() => mapTicketTypeToTicket({ ...base, currency: 'GBP' })).toThrow(
      'Unsupported currency: GBP',
    );
  });
});

describe('mapTicketTypes', () => {
  it('keeps AED tickets and skips unknown currencies', () => {
    const types = [
      { id: '1', eventId: '2', name: 'Dubai General', price: 500, currency: 'AED' },
      { id: '2', eventId: '2', name: 'Dubai VIP', price: 1500, currency: 'AED' },
      { id: '3', eventId: '1', name: 'Bad', price: 10, currency: 'GBP' },
    ];
    const mapped = mapTicketTypes(types);
    expect(mapped).toHaveLength(2);
    expect(mapped.every((t) => t.currency === 'AED')).toBe(true);
  });
});
