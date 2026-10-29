import { afterEach, describe, expect, it, vi } from 'vitest';
import { TriskelGateClient, TriskelGateApiError } from './client';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('TG-18 public Madrid promo-code checkout contract', () => {
  it('preserves literal + in a code and never computes the final amount in browser', async () => {
    const quote = {
      id: 8, code: 'X-OPS+SUMMIT', type: 'percentage', value: 100,
      currency: 'EUR', ticketTypeId: 5, quantity: 1,
      originalAmount: 200, discountAmount: 200, finalAmount: 0,
      originalTotalCents: 20000, discountCents: 20000, finalCents: 0,
    };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true, json: async () => ({ success: true, discount: quote }),
    });
    vi.stubGlobal('fetch', fetchMock);
    const client = new TriskelGateClient({ baseUrl: 'https://tg.test.local' });

    const result = await client.validateDiscount({
      code: 'X-OPS+SUMMIT', eventId: 1, ticketTypeId: 5, quantity: 1,
    });
    expect(result.discount?.finalAmount).toBe(0);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe('https://tg.test.local/api/discounts/validate');
    expect(JSON.parse(opts.body)).toEqual({
      code: 'X-OPS+SUMMIT', eventId: 1, ticketTypeId: 5, quantity: 1,
    });
  });

  it('checkout submits exact promo code to authoritative pricing service', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true, json: async () => ({
        success: true, sessionUrl: 'https://checkout.stripe.com/mock-session',
      }),
    });
    vi.stubGlobal('fetch', fetchMock);
    const client = new TriskelGateClient({ baseUrl: 'https://tg.test.local' });
    await client.createCheckout({
      eventId: 1, ticketTypeId: 3, quantity: 1,
      discountCode: 'X-OPS+CODELY', customerEmail: 'example@example.org',
      customerName: 'Test Buyer',
    });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).discountCode).toBe('X-OPS+CODELY');
    expect(fetchMock.mock.calls[0][0]).toBe('https://tg.test.local/api/payment/create-session');
  });

  it('surfaces an invalid-code backend response without silently charging regular price', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false, status: 400, text: async () => '{"error":"CODE_EXHAUSTED","message":"Quota exceeded"}',
    }));
    const client = new TriskelGateClient({ baseUrl: 'https://tg.test.local' });
    await expect(client.validateDiscount({
      code: 'X-OPS+CODELYTEAM', eventId: 1, ticketTypeId: 2, quantity: 1,
    })).rejects.toBeInstanceOf(TriskelGateApiError);
  });
});
