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
 *   - code_exhausted: CODE_EXHAUSTED; el código es correcto y ha alcanzado su límite
 *     de usos. Nunca es "código no válido".
 *   - invalid: el servicio rechazó el código porque NO EXISTE (INVALID_CODE), o un
 *     rechazo explícito (success:false) con un código de error desconocido pero con
 *     formato de código. Sólo estos dos casos pueden decir "código no válido".
 *   - unavailable: NO se pudo comprobar el código. Incluye red, timeout, 5xx, una
 *     respuesta que no es JSON utilizable, un 4xx de proxy/middleware (texto libre
 *     sin success:false), una respuesta de éxito que no cumple el contrato del quote,
 *     y los códigos que son un fallo de configuración o de precio, no del cupón
 *     (INVALID_DISCOUNT_CONFIG, INVALID_PRICE, INVALID_DISCOUNT_CURRENCY) y
 *     INVALID_QUANTITY (la cantidad va fijada a 1 en este flujo: si el backend la
 *     rechaza es un defecto de integración que el comprador no puede corregir).
 *     Nunca significa "código no válido".
 *
 * Contrato de rechazo: el backend responde `{success:false, error:<CODE>, message}`.
 * Sólo una respuesta que cumple ese contrato, o un código de la tabla
 * BUSINESS_CODE_REASONS, puede atribuirse al cupón. Cualquier otra cosa es una
 * respuesta que no sabemos interpretar y va a unavailable.
 *
 * Orden de reglas en `classifyDiscountFailure` (la primera que encaja gana):
 *   1. 429 o código RATE_LIMITED → rate_limited.
 *   2. sin status (no hubo respuesta: TypeError de red, timeout) → unavailable.
 *   3. status >= 500 → unavailable (una caída del servicio no prueba nada del cupón,
 *      aunque el cuerpo traiga un código de negocio).
 *   4. código de negocio conocido (tabla BUSINESS_CODE_REASONS) → su causa.
 *   5. cuerpo que no es una respuesta de negocio (HTML, vacío, null, array,
 *      objeto sin error/message/success) → unavailable, aunque el status sea 4xx.
 *   6. success:false con `error` con formato de código (desconocido para la tabla) → invalid.
 *   7. cualquier otro caso (incluido un 4xx con texto libre en error/message) → unavailable.
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
 *
 * Nota de tipos: este fichero es .ts (convención del repo para adaptadores) pero
 * no usa sintaxis de tipos, porque el ESLint del repo no tiene parser de
 * TypeScript. Los tipos van en JSDoc. En un .ts TypeScript NO comprueba esos tags:
 * son documentación. La garantía real es la validación en tiempo de ejecución y
 * sus tests.
 */

/**
 * Causa de fallo de un cupón (ver la cabecera del módulo).
 * @typedef {'rate_limited' | 'sale_ended' | 'sale_not_started' | 'code_expired' |
 *   'code_not_started' | 'code_not_for_ticket' | 'code_not_for_organizer' |
 *   'code_exhausted' | 'wrong_selection' | 'invalid' | 'unavailable'} DiscountFailureReason
 */

/**
 * Entrada de `classifyDiscountFailure`.
 * @typedef {Object} DiscountFailureInput
 * @property {number} [status] Status HTTP si hubo respuesta; undefined si no la hubo (red, timeout).
 * @property {unknown} [body] Cuerpo de la respuesta: string JSON u objeto ya parseado.
 */

/**
 * Lo que el comprador pidió validar; el quote debe coincidir con ello.
 * @typedef {Object} ExpectedDiscount
 * @property {string} code
 * @property {number | string} ticketTypeId
 * @property {number} quantity
 */

const ERROR_CODE = /^[A-Z][A-Z0-9_]*$/;

/**
 * Códigos de negocio del backend (todos los que puede devolver discountPricing.js).
 * Cada uno tiene su causa. Un código NO listado aquí sólo se considera rechazo del
 * cupón si el contrato lo marca (success:false con `error` con formato de código).
 * Es un Map (no un objeto) para no hacer acceso dinámico a propiedades con un código
 * que viene del servidor.
 * @type {Map<string, DiscountFailureReason>}
 */
const BUSINESS_CODE_REASONS = new Map([
  ['RATE_LIMITED', 'rate_limited'],
  ['SALE_ENDED', 'sale_ended'],
  ['SALE_NOT_STARTED', 'sale_not_started'],
  ['CODE_EXPIRED', 'code_expired'],
  ['CODE_NOT_STARTED', 'code_not_started'],
  ['CODE_NOT_VALID_FOR_TICKET', 'code_not_for_ticket'],
  ['CODE_NOT_VALID_FOR_EVENT', 'code_not_for_ticket'],
  ['CODE_NOT_VALID_FOR_ORGANIZER', 'code_not_for_organizer'],
  // El código es correcto, sólo agotó sus usos: nunca "código no válido".
  ['CODE_EXHAUSTED', 'code_exhausted'],
  ['INVALID_TICKET_TYPE', 'wrong_selection'],
  // El único código que dice que el cupón no existe.
  ['INVALID_CODE', 'invalid'],
  // La cantidad va fijada a 1: si el backend la rechaza es defecto de integración, no del cupón.
  ['INVALID_QUANTITY', 'unavailable'],
  // Fallos de configuración o de precio: el código es correcto, así que no se puede
  // afirmar que sea inválido. El comprador no puede corregirlos: no sabemos más.
  ['INVALID_DISCOUNT_CONFIG', 'unavailable'],
  ['INVALID_PRICE', 'unavailable'],
  ['INVALID_DISCOUNT_CURRENCY', 'unavailable'],
]);

/** Claves que identifican un cuerpo como respuesta de negocio de TriskelGate. */
const BUSINESS_KEYS = ['error', 'message', 'success'];

/** Medio céntimo: tolerancia sólo para la representación en coma flotante de los importes. */
const HALF_CENT = 0.005;

/**
 * Devuelve el cuerpo como objeto de negocio, o null. Acepta string JSON u objeto
 * ya parseado; rechaza arrays, primitivos y objetos sin claves de negocio.
 * @param {unknown} body
 * @returns {Record<string, unknown> | null}
 */
function parseBody(body) {
  let data = body;
  if (typeof body === 'string') {
    try {
      data = JSON.parse(body);
    } catch {
      return null;
    }
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
  const record = /** @type {Record<string, unknown>} */ (data);
  return BUSINESS_KEYS.some((key) => key in record) ? record : null;
}

/**
 * Código de error del backend (p.ej. SALE_ENDED), o null si el cuerpo no trae ninguno.
 * @param {Record<string, unknown>} data
 * @returns {string | null}
 */
function errorCode(data) {
  for (const field of [data.error, data.message]) {
    if (typeof field === 'string' && ERROR_CODE.test(field)) return field;
  }
  return null;
}

/**
 * Clasifica un fallo de validación según la tabla de reglas de la cabecera.
 * @param {DiscountFailureInput} input
 * @returns {DiscountFailureReason}
 */
export function classifyDiscountFailure(input) {
  const { status, body } = input;
  const data = parseBody(body);
  const code = data ? errorCode(data) : null;
  if (status === 429 || code === 'RATE_LIMITED') return 'rate_limited';
  // Un 5xx es indisponibilidad del SERVICIO, aunque el cuerpo traiga un código de
  // negocio: una caída del backend no prueba nada del cupón. Por eso el status
  // se mira ANTES que la tabla de códigos (si no, un 500 con CODE_EXPIRED se
  // presentaría como "código caducado").
  if (typeof status === 'number' && status >= 500) return 'unavailable';
  // Sin status HTTP sólo cuenta como rechazo de negocio si el backend marcó
  // `success:false` explícitamente (contrato de rechazo); si no, no hubo
  // respuesta y es indisponibilidad.
  if (typeof status !== 'number' && !(data && data.success === false)) return 'unavailable';
  const businessReason = code ? BUSINESS_CODE_REASONS.get(code) : undefined;
  if (businessReason) return businessReason;
  // Un rechazo de negocio siempre llega como respuesta JSON de negocio.
  if (data === null) return 'unavailable';
  // Rechazo del cupón según el contrato: success:false con un error con formato de código
  // (desconocido para la tabla). Un texto libre o un success:false sin código no prueba nada del cupón.
  if (data.success === false && typeof data.error === 'string' && ERROR_CODE.test(data.error)) {
    return 'invalid';
  }
  return 'unavailable';
}

/**
 * Número finito y no negativo: importes en mayores y `value` del descuento.
 * @param {unknown} value
 * @returns {boolean}
 */
function isAmount(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

/**
 * Céntimos: entero seguro no negativo.
 * @param {unknown} value
 * @returns {boolean}
 */
function isCents(value) {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

/**
 * Entero seguro positivo: ids, ticketTypeId y quantity.
 * @param {unknown} value
 * @returns {boolean}
 */
function isPositiveInteger(value) {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function isText(value) {
  return typeof value === 'string' && value.trim() !== '';
}

/**
 * ¿El quote cumple el contrato TGDiscountQuote completo y es el pedido?
 * Valida tipos de cada campo, que los importes en mayores sean los céntimos / 100
 * y que el total cuadre (final = original − descuento, en céntimos exactos).
 * @param {Record<string, unknown>} quote
 * @param {ExpectedDiscount} expected
 * @returns {boolean}
 */
function quoteMatchesContract(quote, expected) {
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
 * @param {unknown} result
 * @param {ExpectedDiscount} expected
 * @returns {DiscountFailureReason | null}
 */
export function discountResponseFailure(result, expected) {
  const data = parseBody(result);
  if (!data) return 'unavailable';
  // success:false es un rechazo explícito: se clasifica por su código de negocio.
  if (data.success === false) return classifyDiscountFailure({ status: 200, body: data });
  if (data.success !== true) return 'unavailable';
  const discount = data.discount;
  if (!discount || typeof discount !== 'object' || Array.isArray(discount)) return 'unavailable';
  // success:true con un quote incompleto, incoherente o que no es el pedido: fallo del servicio.
  const quote = /** @type {Record<string, unknown>} */ (discount);
  return quoteMatchesContract(quote, expected) ? null : 'unavailable';
}

/**
 * Clave i18n (bajo ticketModal.checkout) con el texto para cada causa.
 * @param {DiscountFailureReason} reason
 * @returns {string}
 */
export function discountFailureMessageKey(reason) {
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
    case 'code_exhausted':
      return 'ticketModal.checkout.codeExhausted';
    case 'wrong_selection':
      return 'ticketModal.checkout.wrongSelection';
    case 'invalid':
      return 'ticketModal.checkout.invalidDiscount';
    case 'unavailable':
      return 'ticketModal.checkout.discountUnavailable';
  }
}
