/**
 * Clasifica por qué falló una validación de cupón.
 *
 * El navegador NUNCA calcula el precio: esto sólo decide qué le decimos al
 * comprador. Tres causas se muestran distinto y ninguna se inventa:
 *   - rate_limited: 429 o código RATE_LIMITED (demasiadas comprobaciones).
 *   - sale_ended / sale_not_started: la entrada no está a la venta ahora.
 *   - invalid: cualquier otro fallo, tratado como código no válido.
 *
 * El 429 real del backend trae sólo `{"error": "..."}` (sin `message`), así
 * que el código se busca tanto en `error` como en `message`, y el cuerpo puede
 * venir como string JSON o ya parseado.
 */

export type DiscountFailureReason = 'rate_limited' | 'sale_ended' | 'sale_not_started' | 'invalid';

export interface DiscountFailureInput {
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
  return 'invalid';
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
  }
}
