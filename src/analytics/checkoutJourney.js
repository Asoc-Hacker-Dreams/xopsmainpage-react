// Opt-in only, short-lived browser marker to distinguish a genuine Stripe
// cancellation return from a direct visit to the public /checkout/cancel route.
export const CHECKOUT_MARKER_KEY = 'xops_checkout_departure_v1';
const TTL_MS = 2 * 60 * 60 * 1000;
function getStorage() {
  try { return typeof window === 'undefined' ? null : window.sessionStorage; }
  catch { return null; }
}
export function rememberCheckoutDeparture(edition, itemId, analyticsConsented, storage = getStorage(), now = Date.now()) {
  if (!analyticsConsented || !['madrid', 'dubai'].includes(edition) ||
      !itemId || typeof itemId !== 'string') return false;
  try {
    storage?.setItem(CHECKOUT_MARKER_KEY, JSON.stringify({
      edition, itemId: itemId.slice(0, 100), startedAt: now,
    }));
    return Boolean(storage);
  } catch { return false; }
}
export function clearCheckoutDeparture(storage = getStorage()) {
  try { storage?.removeItem(CHECKOUT_MARKER_KEY); } catch { /* restricted storage */ }
}
export function takeCheckoutDeparture(storage = getStorage(), now = Date.now()) {
  try {
    const raw = storage?.getItem(CHECKOUT_MARKER_KEY);
    clearCheckoutDeparture(storage);
    const value = raw ? JSON.parse(raw) : null;
    if (!value || !['madrid', 'dubai'].includes(value.edition) ||
        !Number.isFinite(value.startedAt) || now - value.startedAt > TTL_MS ||
        now < value.startedAt) return null;
    return { edition: value.edition, itemId: value.itemId };
  } catch { return null; }
}
