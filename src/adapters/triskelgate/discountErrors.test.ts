import { describe, expect, it } from 'vitest';
import es from '../../i18n/locales/es.json';
import en from '../../i18n/locales/en.json';
import { TriskelGateApiError } from './client';
import { classifyDiscountFailure, discountFailureMessageKey, type DiscountFailureReason } from './discountErrors';

const VALIDATE_URL = 'https://tg.test.local/api/discounts/validate';

// Cuerpos reales del backend: el 429 de rate limit trae solo `error`, sin `message`.
const RATE_LIMIT_BODY = '{"error":"Too many discount validation requests."}';

describe('classifyDiscountFailure (regresión: el 429 no es un código inválido)', () => {
  it('429 con body {"error": "..."} sin message es rate limit', () => {
    const err = new TriskelGateApiError(429, RATE_LIMIT_BODY, VALIDATE_URL);
    expect(classifyDiscountFailure({ status: err.status, body: err.body })).toBe('rate_limited');
  });

  it('código RATE_LIMITED en el cuerpo es rate limit, aunque el status no sea 429', () => {
    expect(classifyDiscountFailure({
      status: 400,
      body: '{"success":false,"error":"RATE_LIMITED","message":"Too many requests"}',
    })).toBe('rate_limited');
  });

  it('cuerpo ya parseado como objeto (no string) también se clasifica', () => {
    expect(classifyDiscountFailure({
      status: 429, body: { error: 'Too many discount validation requests.' },
    })).toBe('rate_limited');
    expect(classifyDiscountFailure({ body: { success: false, error: 'RATE_LIMITED' } }))
      .toBe('rate_limited');
  });

  it('SALE_ENDED en error es venta cerrada', () => {
    expect(classifyDiscountFailure({
      status: 400, body: '{"error":"SALE_ENDED","message":"Sale ended"}',
    })).toBe('sale_ended');
  });

  it('SALE_NOT_STARTED en error (objeto) es venta no iniciada', () => {
    expect(classifyDiscountFailure({ status: 400, body: { error: 'SALE_NOT_STARTED' } }))
      .toBe('sale_not_started');
  });

  it('200 con success:false y error SALE_ENDED también es venta cerrada', () => {
    expect(classifyDiscountFailure({ body: { success: false, error: 'SALE_ENDED' } }))
      .toBe('sale_ended');
  });

  it('un código de venta en la clave message también se reconoce', () => {
    expect(classifyDiscountFailure({ body: { success: false, message: 'SALE_NOT_STARTED' } }))
      .toBe('sale_not_started');
  });

  it('código de negocio desconocido en un 400 sigue siendo "invalid"', () => {
    expect(classifyDiscountFailure({
      status: 400, body: '{"error":"CODE_EXHAUSTED","message":"Quota exceeded"}',
    })).toBe('invalid');
    expect(classifyDiscountFailure({ status: 400, body: '{"error":"INVALID_CODE"}' }))
      .toBe('invalid');
  });

  it('4xx de negocio desconocidos (caducado, no válido para entrada/evento, cantidad) son "invalid"', () => {
    expect(classifyDiscountFailure({ status: 400, body: '{"error":"CODE_EXPIRED"}' })).toBe('invalid');
    expect(classifyDiscountFailure({ status: 422, body: '{"error":"INVALID_QUANTITY"}' })).toBe('invalid');
    expect(classifyDiscountFailure({ status: 400, body: '{"error":"CODE_NOT_VALID_FOR_TICKET"}' }))
      .toBe('invalid');
    expect(classifyDiscountFailure({ status: 404, body: '{"error":"CODE_NOT_VALID_FOR_EVENT"}' }))
      .toBe('invalid');
  });

  it('texto libre en error (no es un código) en un 400 es "invalid"', () => {
    expect(classifyDiscountFailure({ status: 400, body: { error: 'Something went wrong.' } }))
      .toBe('invalid');
  });

  it('200 con success:false y código desconocido es "invalid": la respuesta sí llegó', () => {
    expect(classifyDiscountFailure({ status: 200, body: { success: false, error: 'CODE_EXPIRED' } }))
      .toBe('invalid');
    expect(classifyDiscountFailure({ status: 200, body: { success: false } })).toBe('invalid');
  });
});

describe('classifyDiscountFailure (regresión: un fallo del servicio NUNCA es código inválido)', () => {
  it('rechazo de red (TypeError de fetch, sin status ni body) es "unavailable", no "invalid"', () => {
    const networkError: { status?: number; body?: string } = new TypeError('Failed to fetch');
    expect(classifyDiscountFailure({ status: networkError.status, body: networkError.body }))
      .toBe('unavailable');
    expect(classifyDiscountFailure({})).toBe('unavailable');
    expect(classifyDiscountFailure({ body: null })).toBe('unavailable');
  });

  it('HTTP 5xx es "unavailable", con cuerpo JSON sin código, HTML o vacío', () => {
    expect(classifyDiscountFailure({ status: 500, body: '{"error":"Internal error"}' })).toBe('unavailable');
    expect(classifyDiscountFailure({ status: 502, body: 'Bad Gateway <html>' })).toBe('unavailable');
    expect(classifyDiscountFailure({ status: 503, body: '' })).toBe('unavailable');
  });

  it('cuerpo no JSON es "unavailable" aunque el status sea 4xx (no es una respuesta de negocio)', () => {
    expect(classifyDiscountFailure({ status: 400, body: 'Bad Gateway <html>' })).toBe('unavailable');
    expect(classifyDiscountFailure({ status: 400, body: '' })).toBe('unavailable');
    expect(classifyDiscountFailure({ status: 404, body: 'Not Found' })).toBe('unavailable');
  });

  it('200 sin cuerpo utilizable es "unavailable": no es prueba de que el código sea inválido', () => {
    expect(classifyDiscountFailure({ status: 200, body: null })).toBe('unavailable');
  });

  it('un código de negocio explícito gana al status: 5xx con SALE_ENDED es venta cerrada', () => {
    expect(classifyDiscountFailure({ status: 500, body: '{"error":"SALE_ENDED"}' })).toBe('sale_ended');
  });

  it('error de TriskelGateApiError 5xx es "unavailable"', () => {
    const err = new TriskelGateApiError(503, 'Service Unavailable', VALIDATE_URL);
    expect(classifyDiscountFailure({ status: err.status, body: err.body })).toBe('unavailable');
  });
});

describe('discountFailureMessageKey', () => {
  // Lee una clave con puntos (p.ej. ticketModal.checkout.saleEnded) de un locale.
  const textAt = (locale: object, key: string): string =>
    key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown>)?.[part], locale) as string;

  it('mapea cada causa a su clave i18n bajo ticketModal.checkout', () => {
    expect(discountFailureMessageKey('rate_limited')).toBe('ticketModal.checkout.rateLimited');
    expect(discountFailureMessageKey('sale_ended')).toBe('ticketModal.checkout.saleEnded');
    expect(discountFailureMessageKey('sale_not_started')).toBe('ticketModal.checkout.saleNotStarted');
    expect(discountFailureMessageKey('invalid')).toBe('ticketModal.checkout.invalidDiscount');
    expect(discountFailureMessageKey('unavailable')).toBe('ticketModal.checkout.discountUnavailable');
  });

  it('cada clave existe en es y en con un texto que describe su causa', () => {
    const expectations: Record<DiscountFailureReason, { es: RegExp; en: RegExp }> = {
      rate_limited: { es: /espera/i, en: /wait/i },
      sale_ended: { es: /a la venta/i, en: /on sale/i },
      sale_not_started: { es: /aún no ha comenzado/i, en: /not started yet/i },
      invalid: { es: /no válido/i, en: /invalid/i },
      unavailable: { es: /no hemos podido comprobar/i, en: /couldn't check/i },
    };

    for (const [reason, rx] of Object.entries(expectations) as [DiscountFailureReason, { es: RegExp; en: RegExp }][]) {
      const key = discountFailureMessageKey(reason);
      expect(textAt(es, key), `es ${key}`).toMatch(rx.es);
      expect(textAt(en, key), `en ${key}`).toMatch(rx.en);
    }
  });

  it('el texto de rate limit nunca dice "código no válido"', () => {
    const key = discountFailureMessageKey('rate_limited');
    expect(textAt(es, key)).not.toMatch(/no válido/i);
    expect(textAt(en, key)).not.toMatch(/invalid/i);
  });

  it('el texto de "no se pudo comprobar" nunca dice "código no válido"', () => {
    const key = discountFailureMessageKey('unavailable');
    expect(textAt(es, key)).not.toMatch(/no válido/i);
    expect(textAt(en, key)).not.toMatch(/invalid/i);
  });
});
