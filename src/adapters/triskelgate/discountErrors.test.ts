import { describe, expect, it } from 'vitest';
import es from '../../i18n/locales/es.json';
import en from '../../i18n/locales/en.json';
import { TriskelGateApiError } from './client';
import {
  classifyDiscountFailure,
  discountFailureMessageKey,
  discountResponseFailure,
} from './discountErrors';

const VALIDATE_URL = 'https://tg.test.local/api/discounts/validate';

// Cuerpos reales del backend: el 429 de rate limit trae solo `error`, sin `message`.
const RATE_LIMIT_BODY = '{"error":"Too many discount validation requests."}';

const EXPECTED = { code: 'X-OPS', ticketTypeId: 1, quantity: 1 };

const quote = (overrides = {}) => ({
  id: 9,
  code: 'X-OPS',
  type: 'percentage',
  value: 10,
  currency: 'EUR',
  ticketTypeId: 1,
  quantity: 1,
  originalAmount: 100,
  discountAmount: 10,
  finalAmount: 90,
  originalTotalCents: 10000,
  discountCents: 1000,
  finalCents: 9000,
  ...overrides,
});

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

  it('CODE_EXPIRED es "code_expired" (no sirve reintentar)', () => {
    expect(classifyDiscountFailure({ status: 400, body: '{"error":"CODE_EXPIRED"}' }))
      .toBe('code_expired');
    expect(classifyDiscountFailure({ body: { success: false, error: 'CODE_EXPIRED' } }))
      .toBe('code_expired');
  });

  it('CODE_NOT_STARTED es "code_not_started" (el cupón aún no está vigente)', () => {
    expect(classifyDiscountFailure({ status: 400, body: '{"error":"CODE_NOT_STARTED"}' }))
      .toBe('code_not_started');
  });

  it('CODE_NOT_VALID_FOR_TICKET y CODE_NOT_VALID_FOR_EVENT son "code_not_for_ticket"', () => {
    expect(classifyDiscountFailure({ status: 400, body: '{"error":"CODE_NOT_VALID_FOR_TICKET"}' }))
      .toBe('code_not_for_ticket');
    expect(classifyDiscountFailure({ status: 404, body: '{"error":"CODE_NOT_VALID_FOR_EVENT"}' }))
      .toBe('code_not_for_ticket');
  });

  it('CODE_EXHAUSTED es "code_exhausted": el código es correcto, sólo ha agotado sus usos', () => {
    expect(classifyDiscountFailure({
      status: 400, body: '{"success":false,"error":"CODE_EXHAUSTED","message":"El código ha alcanzado su límite de usos"}',
    })).toBe('code_exhausted');
    expect(classifyDiscountFailure({ body: { success: false, error: 'CODE_EXHAUSTED' } }))
      .toBe('code_exhausted');
  });

  it('INVALID_CODE es "invalid": el único código que dice que el cupón no existe', () => {
    expect(classifyDiscountFailure({ status: 400, body: '{"error":"INVALID_CODE"}' }))
      .toBe('invalid');
  });

  it('INVALID_PRICE, INVALID_DISCOUNT_CONFIG e INVALID_DISCOUNT_CURRENCY son "unavailable": el código es correcto, falla otra cosa', () => {
    for (const code of ['INVALID_PRICE', 'INVALID_DISCOUNT_CONFIG', 'INVALID_DISCOUNT_CURRENCY']) {
      expect(classifyDiscountFailure({ status: 400, body: { success: false, error: code } }), code)
        .toBe('unavailable');
    }
  });

  // Tabla de todos los códigos que el backend puede devolver (repo hermano, discountPricing.js).
  // Cada uno debe caer en la causa que le corresponde; nunca en "invalid" salvo INVALID_CODE.
  const BACKEND_CODE_REASONS = {
    INVALID_CODE: 'invalid',
    INVALID_DISCOUNT_CONFIG: 'unavailable',
    CODE_EXHAUSTED: 'code_exhausted',
    INVALID_PRICE: 'unavailable',
    INVALID_QUANTITY: 'unavailable',
    INVALID_TICKET_TYPE: 'wrong_selection',
    SALE_NOT_STARTED: 'sale_not_started',
    SALE_ENDED: 'sale_ended',
    CODE_NOT_VALID_FOR_ORGANIZER: 'code_not_for_organizer',
    CODE_NOT_VALID_FOR_EVENT: 'code_not_for_ticket',
    CODE_NOT_STARTED: 'code_not_started',
    CODE_EXPIRED: 'code_expired',
    CODE_NOT_VALID_FOR_TICKET: 'code_not_for_ticket',
    INVALID_DISCOUNT_CURRENCY: 'unavailable',
  };

  it.each(Object.entries(BACKEND_CODE_REASONS))(
    'el código de negocio %s con success:false en un 400 es "%s"',
    (code, reason) => {
      expect(classifyDiscountFailure({
        status: 400, body: { success: false, error: code, message: 'texto del backend' },
      })).toBe(reason);
    },
  );

  it('INVALID_QUANTITY es "unavailable": la cantidad va fijada a 1, así que no es culpa del cupón', () => {
    expect(classifyDiscountFailure({
      status: 400, body: '{"success":false,"error":"INVALID_QUANTITY","message":"Cantidad de entradas no válida"}',
    })).toBe('unavailable');
    expect(classifyDiscountFailure({ status: 422, body: '{"error":"INVALID_QUANTITY"}' })).toBe('unavailable');
  });

  it('INVALID_TICKET_TYPE es "wrong_selection" (400 entrada no disponible y 404 selección inexistente)', () => {
    expect(classifyDiscountFailure({
      status: 400, body: '{"success":false,"error":"INVALID_TICKET_TYPE","message":"La entrada no está disponible para este evento"}',
    })).toBe('wrong_selection');
    expect(classifyDiscountFailure({ status: 404, body: '{"success":false,"error":"INVALID_TICKET_TYPE"}' }))
      .toBe('wrong_selection');
  });

  it('CODE_NOT_VALID_FOR_ORGANIZER es "code_not_for_organizer": el código existe, es de otro organizador', () => {
    expect(classifyDiscountFailure({
      status: 400, body: '{"success":false,"error":"CODE_NOT_VALID_FOR_ORGANIZER","message":"El código no corresponde al organizador"}',
    })).toBe('code_not_for_organizer');
    expect(classifyDiscountFailure({ body: { success: false, error: 'CODE_NOT_VALID_FOR_ORGANIZER' } }))
      .toBe('code_not_for_organizer');
  });

  it('texto libre en error (no es un código) en un 400 es "unavailable", nunca "invalid"', () => {
    expect(classifyDiscountFailure({ status: 400, body: { error: 'Something went wrong.' } }))
      .toBe('unavailable');
  });

  it('un 4xx con error o message en texto libre (proxy, middleware) es "unavailable": no sabemos nada del cupón', () => {
    expect(classifyDiscountFailure({ status: 400, body: '{"message":"proxy error"}' })).toBe('unavailable');
    expect(classifyDiscountFailure({ status: 400, body: '{"error":"proxy error"}' })).toBe('unavailable');
    expect(classifyDiscountFailure({ status: 403, body: { message: 'Forbidden by gateway' } })).toBe('unavailable');
  });

  it('un 4xx con success:false y un código desconocido con formato de código es "invalid": el servicio lo rechazó', () => {
    expect(classifyDiscountFailure({ status: 400, body: { success: false, error: 'SOME_NEW_CODE' } }))
      .toBe('invalid');
  });

  it('un 4xx con success:false sin código, o con texto libre en error, es "unavailable": no cumple el contrato', () => {
    expect(classifyDiscountFailure({ status: 400, body: { success: false } })).toBe('unavailable');
    expect(classifyDiscountFailure({ status: 400, body: { success: false, error: 'Something went wrong.' } }))
      .toBe('unavailable');
    // Sólo `error` es el código del contrato: un código en `message` no basta para un rechazo desconocido.
    expect(classifyDiscountFailure({ status: 400, body: { success: false, error: 'Oops', message: 'SOME_NEW_CODE' } }))
      .toBe('unavailable');
  });

  it('un código con formato pero sin success:false y no conocido es "unavailable"', () => {
    expect(classifyDiscountFailure({ status: 400, body: { error: 'SOME_NEW_CODE' } })).toBe('unavailable');
  });

  it('200 con success:false y CODE_EXHAUSTED es "code_exhausted", no "invalid"', () => {
    expect(classifyDiscountFailure({ status: 200, body: { success: false, error: 'CODE_EXHAUSTED' } }))
      .toBe('code_exhausted');
  });
});

describe('classifyDiscountFailure (regresión: un fallo del servicio NUNCA es código inválido)', () => {
  it('rechazo de red (TypeError de fetch, sin status ni body) es "unavailable", no "invalid"', () => {
    const networkError = new TypeError('Failed to fetch');
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

  it('4xx con cuerpo JSON pero sin forma de respuesta de negocio es "unavailable"', () => {
    // Un proxy o middleware malformado puede devolver `[]` o `{}`: no atribuirlo al cupón.
    expect(classifyDiscountFailure({ status: 400, body: '[]' })).toBe('unavailable');
    expect(classifyDiscountFailure({ status: 400, body: [] })).toBe('unavailable');
    expect(classifyDiscountFailure({ status: 400, body: '[{"error":"CODE_EXPIRED"}]' })).toBe('unavailable');
    expect(classifyDiscountFailure({ status: 400, body: '{}' })).toBe('unavailable');
    expect(classifyDiscountFailure({ status: 400, body: '{"foo":"bar"}' })).toBe('unavailable');
  });

  it('un 5xx es indisponibilidad del servicio aunque traiga un código de negocio', () => {
    // Una caída del backend no prueba nada del cupón: el status se mira ANTES que
    // la tabla de códigos. Si se invirtiera, un 500 con SALE_ENDED se mostraría
    // como "esta entrada no está a la venta" y con CODE_EXPIRED como "caducado".
    expect(classifyDiscountFailure({ status: 500, body: '{"error":"SALE_ENDED"}' })).toBe('unavailable');
    expect(classifyDiscountFailure({ status: 500, body: '{"error":"CODE_EXPIRED"}' })).toBe('unavailable');
    expect(classifyDiscountFailure({ status: 503, body: '{"error":"CODE_NOT_VALID_FOR_TICKET"}' })).toBe('unavailable');
    // El mismo código con un status de negocio sí es su causa.
    expect(classifyDiscountFailure({ status: 400, body: '{"error":"SALE_ENDED"}' })).toBe('sale_ended');
    expect(classifyDiscountFailure({ status: 400, body: '{"error":"CODE_EXPIRED"}' })).toBe('code_expired');
  });

  it('error de TriskelGateApiError 5xx es "unavailable"', () => {
    const err = new TriskelGateApiError(503, 'Service Unavailable', VALIDATE_URL);
    expect(classifyDiscountFailure({ status: err.status, body: err.body })).toBe('unavailable');
  });
});

describe('discountResponseFailure (regresión: success:true malformado NUNCA es código inválido)', () => {
  it('success:false sin código de error es "unavailable": sin código no hay rechazo que atribuir al cupón', () => {
    expect(discountResponseFailure({ success: false }, EXPECTED)).toBe('unavailable');
    expect(discountResponseFailure({ success: false, error: 'Something went wrong.' }, EXPECTED)).toBe('unavailable');
  });

  it('success:false con CODE_EXHAUSTED es "code_exhausted" (el código es correcto, sólo se agotó)', () => {
    expect(discountResponseFailure({ success: false, error: 'CODE_EXHAUSTED' }, EXPECTED)).toBe('code_exhausted');
  });

  it('success:false con código específico usa la causa concreta', () => {
    expect(discountResponseFailure({ success: false, error: 'CODE_EXPIRED' }, EXPECTED)).toBe('code_expired');
    expect(discountResponseFailure({ success: false, error: 'SALE_ENDED' }, EXPECTED)).toBe('sale_ended');
    expect(discountResponseFailure({ success: false, error: 'RATE_LIMITED' }, EXPECTED)).toBe('rate_limited');
  });

  it('{success:true} sin discount es "unavailable", nunca "invalid"', () => {
    expect(discountResponseFailure({ success: true }, EXPECTED)).toBe('unavailable');
  });

  it('{success:true, discount} con ticketTypeId distinto del seleccionado es "unavailable"', () => {
    expect(discountResponseFailure({ success: true, discount: quote({ ticketTypeId: 2 }) }, EXPECTED))
      .toBe('unavailable');
  });

  it('{success:true, discount} con code distinto o quantity distinta es "unavailable"', () => {
    expect(discountResponseFailure({ success: true, discount: quote({ code: 'OTRO' }) }, EXPECTED))
      .toBe('unavailable');
    expect(discountResponseFailure({ success: true, discount: quote({ quantity: 2 }) }, EXPECTED))
      .toBe('unavailable');
  });

  it('{success:true, discount} sin forma de objeto es "unavailable"', () => {
    expect(discountResponseFailure({ success: true, discount: null }, EXPECTED)).toBe('unavailable');
    expect(discountResponseFailure({ success: true, discount: 'X-OPS' }, EXPECTED)).toBe('unavailable');
  });

  it('respuesta sin success booleano o no JSON utilizable es "unavailable"', () => {
    expect(discountResponseFailure({ discount: quote() }, EXPECTED)).toBe('unavailable');
    expect(discountResponseFailure([], EXPECTED)).toBe('unavailable');
    expect(discountResponseFailure(null, EXPECTED)).toBe('unavailable');
    expect(discountResponseFailure(undefined, EXPECTED)).toBe('unavailable');
    expect(discountResponseFailure('<html>', EXPECTED)).toBe('unavailable');
  });

  it('un discount que encaja con el código, entrada y cantidad seleccionados es válido (null)', () => {
    expect(discountResponseFailure({ success: true, discount: quote() }, EXPECTED)).toBeNull();
  });
});

describe('discountResponseFailure: un success:true que no cumple el contrato del quote es "unavailable"', () => {
  const QUOTE_FIELDS = [
    'id', 'type', 'value', 'currency', 'originalAmount', 'discountAmount', 'finalAmount',
    'originalTotalCents', 'discountCents', 'finalCents',
  ];

  it('discount con solo code, ticketTypeId y quantity (sin importes) es "unavailable", no válido', () => {
    expect(discountResponseFailure({
      success: true, discount: { code: 'X-OPS', ticketTypeId: 1, quantity: 1 },
    }, EXPECTED)).toBe('unavailable');
  });

  it.each(QUOTE_FIELDS)('discount sin el campo %s es "unavailable"', (field) => {
    const incomplete = Object.fromEntries(Object.entries(quote()).filter(([key]) => key !== field));
    expect(discountResponseFailure({ success: true, discount: incomplete }, EXPECTED)).toBe('unavailable');
  });

  it('importes que no cuadran (final ≠ original − descuento) son "unavailable"', () => {
    expect(discountResponseFailure({ success: true, discount: quote({ finalAmount: 80 }) }, EXPECTED))
      .toBe('unavailable');
    expect(discountResponseFailure({ success: true, discount: quote({ finalCents: 8000 }) }, EXPECTED))
      .toBe('unavailable');
  });

  it('importes en mayores que no coinciden con sus céntimos son "unavailable"', () => {
    expect(discountResponseFailure({ success: true, discount: quote({ originalAmount: 101 }) }, EXPECTED))
      .toBe('unavailable');
    expect(discountResponseFailure({ success: true, discount: quote({ discountAmount: 9.99, finalAmount: 90.01 }) }, EXPECTED))
      .toBe('unavailable');
  });

  it('currency vacía, sólo espacios o no textual es "unavailable"', () => {
    expect(discountResponseFailure({ success: true, discount: quote({ currency: '' }) }, EXPECTED)).toBe('unavailable');
    expect(discountResponseFailure({ success: true, discount: quote({ currency: '   ' }) }, EXPECTED)).toBe('unavailable');
    expect(discountResponseFailure({ success: true, discount: quote({ currency: 978 }) }, EXPECTED)).toBe('unavailable');
  });

  it('importes NaN, Infinity o negativos son "unavailable"', () => {
    expect(discountResponseFailure({ success: true, discount: quote({ originalAmount: NaN }) }, EXPECTED))
      .toBe('unavailable');
    expect(discountResponseFailure({ success: true, discount: quote({ finalCents: Infinity }) }, EXPECTED))
      .toBe('unavailable');
    // Coherente en aritmética, pero un descuento negativo no es un precio válido.
    expect(discountResponseFailure({
      success: true,
      discount: quote({ discountAmount: -10, finalAmount: 110, discountCents: -1000, finalCents: 11000 }),
    }, EXPECTED)).toBe('unavailable');
  });

  it('importes como string o id no numérico son "unavailable"', () => {
    expect(discountResponseFailure({ success: true, discount: quote({ originalAmount: '100' }) }, EXPECTED))
      .toBe('unavailable');
    expect(discountResponseFailure({ success: true, discount: quote({ id: NaN }) }, EXPECTED)).toBe('unavailable');
  });

  it('un quote completo y coherente con decimales (redondeo de céntimos) sigue siendo válido', () => {
    expect(discountResponseFailure({
      success: true,
      discount: quote({
        originalAmount: 19.99, discountAmount: 3.33, finalAmount: 16.66,
        originalTotalCents: 1999, discountCents: 333, finalCents: 1666,
      }),
    }, EXPECTED)).toBeNull();
  });

  it('un quote de precio final 0 (gratis) completo y coherente sigue siendo válido', () => {
    expect(discountResponseFailure({
      success: true,
      discount: quote({
        type: 'percentage', value: 100, discountAmount: 100, finalAmount: 0,
        discountCents: 10000, finalCents: 0,
      }),
    }, EXPECTED)).toBeNull();
  });
});

describe('discountResponseFailure: la moneda debe ser utilizable por Intl.NumberFormat (TG-47 ronda 5)', () => {
  // Intl acepta sólo 3 letras ASCII: "NOPE", "EU" o "EUROS" lanzan RangeError en el render.
  it.each(['NOPE', 'EU', 'EUROS', 'EUR ', ' EUR', 'EÜR', 'E1R', 'US$', 'EU R'])(
    'moneda %j (no es un código de 3 letras) es "unavailable", nunca "invalid"',
    (currency) => {
      expect(discountResponseFailure({ success: true, discount: quote({ currency }) }, EXPECTED))
        .toBe('unavailable');
    },
  );

  it.each(['EUR', 'AED', 'XYZ', 'usd'])(
    'moneda %s (3 letras ASCII, que Intl acepta) se acepta aunque no sea del negocio',
    (currency) => {
      expect(discountResponseFailure({ success: true, discount: quote({ currency }) }, EXPECTED)).toBeNull();
    },
  );
});

describe('discountResponseFailure: el tipo del quote debe ser uno de los que produce el backend (TG-47 ronda 5)', () => {
  // Lista de src/routes/discounts.js (isIn) y de src/services/discountPricing.js.
  it.each(['nonsense', 'percent', 'Percentage', 'fixedd'])(
    'tipo %j no soportado es "unavailable"',
    (type) => {
      expect(discountResponseFailure({ success: true, discount: quote({ type }) }, EXPECTED)).toBe('unavailable');
    },
  );

  it.each(['percentage', 'fixed', 'target_price'])('tipo %s real se acepta', (type) => {
    expect(discountResponseFailure({ success: true, discount: quote({ type }) }, EXPECTED)).toBeNull();
  });
});

describe('discountFailureMessageKey', () => {
  // Lee una clave con puntos (p.ej. ticketModal.checkout.saleEnded) de un locale.
  // Las claves usadas aquí son todas ticketModal.checkout.<nombre>: se busca <nombre> en un Map.
  const textAt = (locale, key) =>
    new Map(Object.entries(locale.ticketModal.checkout)).get(key.replace(/^ticketModal\.checkout\./, ''));

  it('mapea cada causa a su clave i18n bajo ticketModal.checkout', () => {
    expect(discountFailureMessageKey('rate_limited')).toBe('ticketModal.checkout.rateLimited');
    expect(discountFailureMessageKey('sale_ended')).toBe('ticketModal.checkout.saleEnded');
    expect(discountFailureMessageKey('sale_not_started')).toBe('ticketModal.checkout.saleNotStarted');
    expect(discountFailureMessageKey('code_expired')).toBe('ticketModal.checkout.discountExpired');
    expect(discountFailureMessageKey('code_not_started')).toBe('ticketModal.checkout.discountNotStarted');
    expect(discountFailureMessageKey('code_not_for_ticket')).toBe('ticketModal.checkout.discountNotForTicket');
    expect(discountFailureMessageKey('code_not_for_organizer')).toBe('ticketModal.checkout.discountNotForOrganizer');
    expect(discountFailureMessageKey('code_exhausted')).toBe('ticketModal.checkout.codeExhausted');
    expect(discountFailureMessageKey('wrong_selection')).toBe('ticketModal.checkout.wrongSelection');
    expect(discountFailureMessageKey('invalid')).toBe('ticketModal.checkout.invalidDiscount');
    expect(discountFailureMessageKey('unavailable')).toBe('ticketModal.checkout.discountUnavailable');
  });

  it('cada causa tiene una clave propia (las causas concretas no se funden con "invalid")', () => {
    const reasons = [
      'rate_limited', 'sale_ended', 'sale_not_started', 'code_expired',
      'code_not_started', 'code_not_for_ticket', 'code_not_for_organizer', 'code_exhausted',
      'wrong_selection', 'invalid', 'unavailable',
    ];
    const keys = reasons.map(discountFailureMessageKey);
    expect(new Set(keys).size).toBe(reasons.length);
  });

  it('cada clave existe en es y en con un texto que describe su causa', () => {
    const expectations = {
      rate_limited: { es: /espera/i, en: /wait/i },
      sale_ended: { es: /a la venta/i, en: /on sale/i },
      sale_not_started: { es: /aún no ha comenzado/i, en: /not started yet/i },
      code_expired: { es: /ha caducado/i, en: /expired/i },
      code_not_started: { es: /aún no está vigente/i, en: /not active yet/i },
      code_not_for_ticket: { es: /no se aplica a esta entrada/i, en: /doesn't apply to this ticket/i },
      code_not_for_organizer: { es: /no es válido para este evento/i, en: /isn't valid for this event/i },
      code_exhausted: { es: /límite de usos/i, en: /usage limit/i },
      wrong_selection: { es: /no es válida para este evento\. Elige otra\./i, en: /isn't valid for this event\. Please choose another/i },
      invalid: { es: /^Código no válido\.$/, en: /^Invalid code\.$/ },
      unavailable: { es: /no hemos podido comprobar/i, en: /couldn't check/i },
    };

    for (const [reason, rx] of Object.entries(expectations)) {
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

  it('el texto de rate limit no promete una espera exacta: el backend bloquea 5 min (límite por IP) y 15 min (global)', () => {
    const key = discountFailureMessageKey('rate_limited');
    expect(textAt(es, key)).not.toMatch(/un minuto/i);
    expect(textAt(en, key)).not.toMatch(/a minute\b|one minute/i);
    expect(textAt(es, key)).toMatch(/minutos/i);
    expect(textAt(en, key)).toMatch(/few minutes/i);
  });

  it('el texto de "no se pudo comprobar" nunca dice "código no válido"', () => {
    const key = discountFailureMessageKey('unavailable');
    expect(textAt(es, key)).not.toMatch(/no válido/i);
    expect(textAt(en, key)).not.toMatch(/invalid/i);
  });

  it('los textos de caducado y no vigente no dicen "no válido" ni "sin disponibilidad"', () => {
    for (const reason of ['code_expired', 'code_not_started', 'code_not_for_ticket']) {
      const key = discountFailureMessageKey(reason);
      expect(textAt(es, key), `es ${key}`).not.toMatch(/sin disponibilidad/i);
      expect(textAt(en, key), `en ${key}`).not.toMatch(/unavailable/i);
    }
  });
});
