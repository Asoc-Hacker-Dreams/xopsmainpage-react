/**
 * Clasifica por qué falló una validación de cupón.
 *
 * El navegador NUNCA calcula el precio: esto sólo decide qué le decimos al
 * comprador. Cada causa tiene su propio mensaje y ninguna se inventa:
 *   - rate_limited: 429 o código RATE_LIMITED (demasiadas comprobaciones).
 *   - sale_ended / sale_not_started: la entrada no está a la venta ahora.
 *   - invalid: el servicio SÍ respondió y rechazó el código (4xx de negocio
 *     desconocido como CODE_EXPIRED, o 200 con success:false sin código conocido).
 *   - unavailable: NO se pudo comprobar el código (red, timeout, 5xx, o una
 *     respuesta que no es JSON utilizable). Nunca significa "código no válido".
 *
 * Orden de reglas (la primera que encaja gana):
 *   1. 429 o código RATE_LIMITED → rate_limited.
 *   2. código SALE_ENDED / SALE_NOT_STARTED → venta cerrada / no iniciada,
 *      con independencia del status (el código del backend es explícito).
 *   3. sin status (no hubo respuesta: TypeError de red, timeout) → unavailable.
 *   4. status >= 500 → unavailable.
 *   5. cuerpo que no es un objeto JSON (HTML, vacío, null) → unavailable,
 *      aunque el status sea 4xx: un rechazo de negocio siempre llega como JSON.
 *   6. status 2xx o 4xx con cuerpo JSON sin código conocido → invalid.
 *   7. cualquier otro caso → unavailable (no hay base para afirmar que el código sea inválido).
 *
 * El 429 real del backend trae sólo `{"error": "..."}` (sin `message`), así
 * que el código se busca tanto en `error` como en `message`, y el cuerpo puede
 * venir como string JSON o ya parseado.
 */

export type DiscountFailureReason = 'rate_limited' | 'sale_ended' | 'sale_not_started' | 'invalid' | 'unavailable';

export interface DiscountFailureInput {
  /** Status HTTP si hubo respuesta; undefined si no la hubo (red, timeout). */
  status?: number;
  body?: unknown;
}

const ERROR_CODE = /^[A-Z][A-Z0-9_]*$/;

function parseBody(body: unknown): Record<string, unknown> | null {
  let data: unknown = body;
  if (typeof body === 'string') {
    try {
      data = JSON.parse(body);
    } catch {
      return null;
    }
  }
  return data && typeof data === 'object' ? (data as Record<string, unknown>) : null;
}

/** Código de error del backend (p.ej. SALE_ENDED), o null si el cuerpo no trae ninguno. */
function errorCode(body: unknown): string | null {
  const data = parseBody(body);
  if (!data) return null;
  for (const field of [data.error, data.message]) {
    if (typeof field === 'string' && ERROR_CODE.test(field)) return field;
  }
  return null;
}

export function classifyDiscountFailure({ status, body }: DiscountFailureInput): DiscountFailureReason {
  const code = errorCode(body);
  if (status === 429 || code === 'RATE_LIMITED') return 'rate_limited';
  if (code === 'SALE_ENDED') return 'sale_ended';
  if (code === 'SALE_NOT_STARTED') return 'sale_not_started';
  // Sin status no hubo respuesta del servicio (red, timeout): no es culpa del cupón.
  if (typeof status !== 'number') return 'unavailable';
  if (status >= 500) return 'unavailable';
  // Un rechazo de negocio siempre llega como JSON; HTML o cuerpo vacío es un fallo intermedio.
  if (parseBody(body) === null) return 'unavailable';
  if ((status >= 200 && status < 300) || (status >= 400 && status < 500)) return 'invalid';
  return 'unavailable';
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
    case 'invalid':
      return 'ticketModal.checkout.invalidDiscount';
    case 'unavailable':
      return 'ticketModal.checkout.discountUnavailable';
  }
}
