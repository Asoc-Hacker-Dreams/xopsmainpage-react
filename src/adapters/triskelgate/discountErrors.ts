/**
 * Clasifica por qué falló una validación de cupón.
 *
 * El navegador NUNCA calcula el precio: esto sólo decide qué le decimos al
 * comprador. Cada causa tiene su propio mensaje i18n y ninguna se inventa.
 * El `message` crudo del backend NUNCA se muestra (está en castellano y
 * rompería la UI en inglés).
 *   - rate_limited: 429 o código RATE_LIMITED (demasiadas comprobaciones).
 *   - sale_ended / sale_not_started: la entrada no está a la venta ahora.
 *   - code_expired: CODE_EXPIRED; reintentar no sirve.
 *   - code_not_started: CODE_NOT_STARTED; el cupón aún no está vigente.
 *   - code_not_for_ticket: CODE_NOT_VALID_FOR_TICKET o CODE_NOT_VALID_FOR_EVENT;
 *     probar con otra entrada sí puede servir.
 *   - invalid: el servicio SÍ respondió y rechazó el código sin causa concreta.
 *   - unavailable: NO se pudo comprobar el código (red, timeout, 5xx, o una
 *     respuesta que no es JSON utilizable). Nunca significa "código no válido".
 *
 * Orden de reglas en `classifyDiscountFailure` (la primera que encaja gana):
 *   1. 429 o código RATE_LIMITED → rate_limited.
 *   2. código de negocio conocido (SALE_*, CODE_*) → su causa, con independencia
 *      del status (el código del backend es explícito).
 *   3. sin status (no hubo respuesta: TypeError de red, timeout) → unavailable.
 *   4. status >= 500 → unavailable.
 *   5. cuerpo que no es una respuesta de negocio (HTML, vacío, null, array,
 *      objeto sin error/message/success) → unavailable, aunque el status sea 4xx:
 *      un rechazo de negocio siempre llega como objeto JSON con esas claves.
 *   6. status 2xx o 4xx con respuesta de negocio sin código conocido → invalid.
 *   7. cualquier otro caso → unavailable.
 *
 * `discountResponseFailure` aplica la misma filosofía a un 200 ya parseado:
 * success:false es un rechazo del cupón (se clasifica por su código);
 * success:true con un `discount` que no encaja con lo pedido es una respuesta
 * malformada del servicio → unavailable, NUNCA "código no válido".
 *
 * El 429 real del backend trae sólo `{"error": "..."}` (sin `message`), así
 * que el código se busca tanto en `error` como en `message`, y el cuerpo puede
 * venir como string JSON o ya parseado.
 */

export type DiscountFailureReason =
  | 'rate_limited'
  | 'sale_ended'
  | 'sale_not_started'
  | 'code_expired'
  | 'code_not_started'
  | 'code_not_for_ticket'
  | 'invalid'
  | 'unavailable';

export interface DiscountFailureInput {
  /** Status HTTP si hubo respuesta; undefined si no la hubo (red, timeout). */
  status?: number;
  body?: unknown;
}

export interface ExpectedDiscount {
  code: string;
  ticketTypeId: number | string;
  quantity: number;
}

const ERROR_CODE = /^[A-Z][A-Z0-9_]*$/;

/** Códigos de negocio del backend con causa propia. Cualquier otro es "invalid". */
const BUSINESS_CODE_REASONS: Record<string, DiscountFailureReason> = {
  RATE_LIMITED: 'rate_limited',
  SALE_ENDED: 'sale_ended',
  SALE_NOT_STARTED: 'sale_not_started',
  CODE_EXPIRED: 'code_expired',
  CODE_NOT_STARTED: 'code_not_started',
  CODE_NOT_VALID_FOR_TICKET: 'code_not_for_ticket',
  CODE_NOT_VALID_FOR_EVENT: 'code_not_for_ticket',
};

/** Claves que identifican un cuerpo como respuesta de negocio de TriskelGate. */
const BUSINESS_KEYS = ['error', 'message', 'success'] as const;

/**
 * Devuelve el cuerpo como objeto de negocio, o null. Acepta string JSON u objeto
 * ya parseado; rechaza arrays, primitivos y objetos sin claves de negocio.
 */
function parseBody(body: unknown): Record<string, unknown> | null {
  let data: unknown = body;
  if (typeof body === 'string') {
    try {
      data = JSON.parse(body);
    } catch {
      return null;
    }
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
  const record = data as Record<string, unknown>;
  return BUSINESS_KEYS.some((key) => key in record) ? record : null;
}

/** Código de error del backend (p.ej. SALE_ENDED), o null si el cuerpo no trae ninguno. */
function errorCode(data: Record<string, unknown>): string | null {
  for (const field of [data.error, data.message]) {
    if (typeof field === 'string' && ERROR_CODE.test(field)) return field;
  }
  return null;
}

export function classifyDiscountFailure({ status, body }: DiscountFailureInput): DiscountFailureReason {
  const data = parseBody(body);
  const code = data ? errorCode(data) : null;
  if (status === 429 || code === 'RATE_LIMITED') return 'rate_limited';
  if (code && code in BUSINESS_CODE_REASONS) return BUSINESS_CODE_REASONS[code];
  // Sin status no hubo respuesta del servicio (red, timeout): no es culpa del cupón.
  if (typeof status !== 'number') return 'unavailable';
  if (status >= 500) return 'unavailable';
  // Un rechazo de negocio siempre llega como respuesta JSON de negocio.
  if (data === null) return 'unavailable';
  if ((status >= 200 && status < 300) || (status >= 400 && status < 500)) return 'invalid';
  return 'unavailable';
}

/**
 * Evalúa la respuesta 2xx de POST /api/discounts/validate frente a lo pedido.
 * Devuelve null si el cupón es válido para ese código, entrada y cantidad;
 * si no, la causa para mostrar al comprador.
 */
export function discountResponseFailure(result: unknown, expected: ExpectedDiscount): DiscountFailureReason | null {
  const data = parseBody(result);
  if (!data) return 'unavailable';
  // success:false es un rechazo explícito: se clasifica por su código de negocio.
  if (data.success === false) return classifyDiscountFailure({ status: 200, body: data });
  if (data.success !== true) return 'unavailable';
  const discount = data.discount;
  if (!discount || typeof discount !== 'object' || Array.isArray(discount)) return 'unavailable';
  const quote = discount as Record<string, unknown>;
  const matches =
    quote.code === expected.code &&
    Number(quote.ticketTypeId) === Number(expected.ticketTypeId) &&
    Number(quote.quantity) === expected.quantity;
  // success:true con un discount que no es el pedido: fallo del servicio, no del cupón.
  return matches ? null : 'unavailable';
}

/** Clave i18n (bajo ticketModal.checkout) con el texto para cada causa. */
export function discountFailureMessageKey(reason: DiscountFailureReason): string {
  switch (reason) {
    case 'rate_limited':
      return 'ticketModal.checkout.rateLimited';
    case 'sale_ended':
      return 'ticketModal.checkout.saleEnded';
    case 'sale_not_started':
      return 'ticketModal.checkout.saleNotStarted';
    case 'code_expired':
      return 'ticketModal.checkout.discountExpired';
    case 'code_not_started':
      return 'ticketModal.checkout.discountNotStarted';
    case 'code_not_for_ticket':
      return 'ticketModal.checkout.discountNotForTicket';
    case 'invalid':
      return 'ticketModal.checkout.invalidDiscount';
    case 'unavailable':
      return 'ticketModal.checkout.discountUnavailable';
  }
}
