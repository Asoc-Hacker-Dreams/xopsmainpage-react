/**
 * TG-48 — decide qué hace el front con la respuesta de `createCheckout`.
 *
 * Principio: la pregunta es "¿la compra se completó?", no "¿hay URL de Stripe?".
 *
 *  - `mode: 'free'` (cupón 100 %): el backend ya emitió el ticket y envió el
 *    email. La `sessionUrl` es NUESTRA successUrl (no hay Stripe). Es un éxito.
 *  - Pago normal: la `sessionUrl` debe ser de checkout.stripe.com (https).
 *  - Cualquier otra URL de redirección es un error: nunca se redirige a un host
 *    que venga del backend sin validar (riesgo de phishing si el backend o la
 *    respuesta se comprometen).
 *
 * Este módulo es puro (sin React, sin window): el origen de la página se pasa
 * como argumento. Se escribe en .ts pero sin sintaxis de tipos: el ESLint del
 * repo no tiene parser de TypeScript, así que los tipos van en JSDoc.
 */

/**
 * Hosts exactos de la plataforma X-Ops. Coincidencia por nombre completo, nunca
 * por sufijo ni prefijo. Además se acepta el origen de la página actual, que es
 * precisamente el origen de la successUrl que enviamos al backend (TicketModal).
 */
export const PLATFORM_HOSTS = Object.freeze([
  'xopsconference.com',
  'www.xopsconference.com',
  'madrid.xopsconference.com',
  'dubai.xopsconference.com',
]);

const STRIPE_CHECKOUT_RE = /^https:\/\/checkout\.stripe\.com\//;

/**
 * @typedef {{ ok: true, mode: 'free' | 'stripe', url: string }} CheckoutRedirect
 * @typedef {{ ok: false, message: string | null }} CheckoutFailure
 * @typedef {CheckoutRedirect | CheckoutFailure} CheckoutOutcome
 */

/**
 * @param {unknown} raw
 * @param {string} currentOrigin  origen de la página (= origen de nuestra successUrl)
 * @returns {boolean}
 */
function isAllowedFreeRedirect(raw, currentOrigin) {
  if (typeof raw !== 'string') return false;
  let url;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  // Mismo origen que la página que originó la successUrl (incluye http://localhost en dev).
  if (currentOrigin && currentOrigin !== 'null' && url.origin === currentOrigin) return true;
  return url.protocol === 'https:' && PLATFORM_HOSTS.includes(url.hostname);
}

/**
 * @param {any} data  respuesta de TriskelGate `createCheckout`
 * @param {string} currentOrigin  `window.location.origin` en el momento de comprar
 * @returns {CheckoutOutcome}
 */
export function resolveCheckoutOutcome(data, currentOrigin) {
  if (!data || !data.success) {
    // Fallo real: exponemos el mensaje del backend si existe; si no, el modal usa el genérico.
    const message = data?.message || data?.error;
    return { ok: false, message: typeof message === 'string' && message ? message : null };
  }

  const url = data.sessionUrl || data.redirectUrl;

  if (data.mode === 'free') {
    return isAllowedFreeRedirect(url, currentOrigin)
      ? { ok: true, mode: 'free', url: /** @type {string} */ (url) }
      : { ok: false, message: null };
  }

  if (typeof url === 'string' && STRIPE_CHECKOUT_RE.test(url)) {
    return { ok: true, mode: 'stripe', url };
  }
  return { ok: false, message: null };
}
