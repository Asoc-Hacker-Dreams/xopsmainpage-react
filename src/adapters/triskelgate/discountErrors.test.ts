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

  it('código realmente inválido sigue siendo "invalid"', () => {
    expect(classifyDiscountFailure({
      status: 400, body: '{"error":"CODE_EXHAUSTED","message":"Quota exceeded"}',
    })).toBe('invalid');
    expect(classifyDiscountFailure({ status: 400, body: '{"error":"INVALID_CODE"}' }))
      .toBe('invalid');
  });

  it('texto libre en error (no es un código) no se confunde con rate limit', () => {
    expect(classifyDiscountFailure({ status: 400, body: { error: 'Something went wrong.' } }))
      .toBe('invalid');
  });

  it('cuerpo no JSON, vacío o ausente cae en "invalid" sin lanzar', () => {
    expect(classifyDiscountFailure({ status: 400, body: 'Bad Gateway <html>' })).toBe('invalid');
    expect(classifyDiscountFailure({ status: 400, body: '' })).toBe('invalid');
    expect(classifyDiscountFailure({})).toBe('invalid');
    expect(classifyDiscountFailure({ body: null })).toBe('invalid');
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
  });

  it('cada clave existe en es y en con un texto que describe su causa', () => {
    const expectations: Record<DiscountFailureReason, { es: RegExp; en: RegExp }> = {
      rate_limited: { es: /espera/i, en: /wait/i },
      sale_ended: { es: /a la venta/i, en: /on sale/i },
      sale_not_started: { es: /aún no ha comenzado/i, en: /not started yet/i },
      invalid: { es: /no válido/i, en: /invalid/i },
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
});
