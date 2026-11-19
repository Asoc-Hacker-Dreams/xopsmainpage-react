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
 *   - code_not_for_organizer: CODE_NOT_VALID_FOR_ORGANIZER; el código existe pero
 *     es de otro organizador, así que no vale para este evento.
 *   - wrong_selection: INVALID_TICKET_TYPE; la entrada elegida no es válida para
 *     este evento. Es un problema de la selección, no del cupón: elegir otra sí sirve.
 *   - invalid: el servicio SÍ respondió y rechazó el código sin causa concreta
 *     (p.ej. INVALID_CODE).
 *   - unavailable: NO se pudo comprobar el código (red, timeout, 5xx, una
 *     respuesta que no es JSON utilizable, o una respuesta de éxito que no cumple
 *     el contrato del quote). También INVALID_QUANTITY: la cantidad va fijada a 1
 *     en este flujo, así que si el backend la rechaza es un defecto de integración
 *     que el comprador no puede corregir. Nunca significa "código no válido".
 *
 * Orden de reglas en `classifyDiscountFailure` (la primera que encaja gana):
 *   1. 429 o código RATE_LIMITED → rate_limited.
 *   2. código de negocio conocido (tabla BUSINESS_CODE_REASONS) → su causa, con
 *      independencia del status (el código del backend es explícito).
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
 * success:true exige un quote COMPLETO (contrato TGDiscountQuote de types.ts),
 * coherente en importes y que sea el pedido. Si no, es una respuesta malformada
 * del servicio → unavailable, NUNCA "código no válido".
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
  | 'code_not_for_organizer'
  | 'wrong_selection'
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
  CODE_NOT_VALID_FOR_ORGANIZER: 'code_not_for_organizer',
  INVALID_TICKET_TYPE: 'wrong_selection',
  // La cantidad va fijada a 1: si el backend la rechaza es defecto de integración, no del cupón.
  INVALID_QUANTITY: 'unavailable',
};

/** Claves que identifican un cuerpo como respuesta de negocio de TriskelGate. */
const BUSINESS_KEYS = ['error', 'message', 'success'] as const;

/** Medio céntimo: tolerancia sólo para la representación en coma flotante de los importes. */
const HALF_CENT = 0.005;

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

/** Número finito y no negativo: importes en mayores y `value` del descuento. */
function isAmount(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

/** Céntimos: entero seguro no negativo. */
function isCents(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

/** Entero seguro positivo: ids, ticketTypeId y quantity. */
function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
}

function isText(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

/**
 * ¿El quote cumple el contrato TGDiscountQuote completo y es el pedido?
 * Valida tipos de cada campo, que los importes en mayores sean los céntimos / 100
 * y que el total cuadre (final = original − descuento, en céntimos exactos).
 */
function quoteMatchesContract(quote: Record<string, unknown>, expected: ExpectedDiscount): boolean {
  if (!isPositiveInteger(quote.id) || !isText(quote.type) || !isAmount(quote.value)) return false;
  if (quote.code !== expected.code || !isText(quote.currency)) return false;
  if (!isPositiveInteger(quote.ticketTypeId) || quote.ticketTypeId !== Number(expected.ticketTypeId)) return false;
  if (!isPositiveInteger(quote.quantity) || quote.quantity !== expected.quantity) return false;

  const { originalAmount, discountAmount, finalAmount } = quote;
  const { originalTotalCents, discountCents, finalCents } = quote;
  if (!isAmount(originalAmount) || !isAmount(discountAmount) || !isAmount(finalAmount)) return false;
  if (!isCents(originalTotalCents) || !isCents(discountCents) || !isCents(finalCents)) return false;

  // Céntimos exactos: final = original − descuento (los enteros no tienen tolerancia).
  if (finalCents !== originalTotalCents - discountCents) return false;
  // Los importes en mayores son esos mismos céntimos / 100 y cuadran entre sí.
  return Math.abs(originalAmount - originalTotalCents / 100) < HALF_CENT &&
    Math.abs(discountAmount - discountCents / 100) < HALF_CENT &&
    Math.abs(finalAmount - finalCents / 100) < HALF_CENT &&
    Math.abs(originalAmount - discountAmount - finalAmount) < HALF_CENT;
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
  // success:true con un quote incompleto, incoherente o que no es el pedido: fallo del servicio.
  return quoteMatchesContract(discount as Record<string, unknown>, expected) ? null : 'unavailable';
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
    case 'code_not_for_organizer':
      return 'ticketModal.checkout.discountNotForOrganizer';
    case 'wrong_selection':
      return 'ticketModal.checkout.wrongSelection';
    case 'invalid':
      return 'ticketModal.checkout.invalidDiscount';
    case 'unavailable':
      return 'ticketModal.checkout.discountUnavailable';
  }
}
