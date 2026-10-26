import scriptManager from '../services/scriptManager';
import {
  campaignEventParams, safeAnalyticsPageUrl,
} from './attribution';

// GA4 deduplicates web-stream purchases with the same non-empty transaction_id.
// This browser ledger also prevents repeated dispatch from polling/remount/reload.
// Reliable revenue reconciliation still requires backend/Stripe webhooks.
export const PURCHASE_LEDGER_KEY = 'xops_ga4_purchase_v1';
const LEDGER_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_RECEIPTS = 150;
const PURCHASE_MODE = import.meta.env.VITE_GA4_PURCHASE_MODE || 'client';

function storageSafe() {
  try { return typeof window === 'undefined' ? null : window.localStorage; }
  catch { return null; }
}
function readLedger(storage = storageSafe(), now = Date.now()) {
  try {
    const value = JSON.parse(storage?.getItem(PURCHASE_LEDGER_KEY) || '{}');
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter(([key, time]) =>
      typeof key === 'string' && key.length <= 100 &&
      Number.isFinite(time) && time <= now && time > now - LEDGER_TTL_MS
    ).slice(-MAX_RECEIPTS));
  } catch { return {}; }
}
export function clearPurchaseLedger(storage = storageSafe()) {
  try { storage?.removeItem(PURCHASE_LEDGER_KEY); } catch { /* restricted storage */ }
}
function safeText(value, max = 100) {
  if (typeof value !== 'string') return '';
  const text = value.trim().slice(0, max);
  if (!text || /[<>\r\n]/.test(text) || /@/.test(text)) return '';
  return text;
}
const round2 = number => Math.round((number + Number.EPSILON) * 100) / 100;

export function purchaseFromVerifiedStatus(data) {
  // Never trust the Stripe return URL, localStorage, ticket prices or bare
  // presence of orderNumber as proof of a completed, settled order.
  if (data?.success !== true || !['completed', 'paid'].includes(data.status)) return null;
  const reference = safeText(data.orderNumber, 100);
  const ec = data.ecommerce;
  if (!reference || !ec || safeText(ec.transaction_id, 100) !== reference) return null;
  if (!/^[A-Z]{3}$/.test(ec.currency || '') || !Number.isFinite(ec.value) || ec.value < 0) return null;
  if (!Array.isArray(ec.items) || !ec.items.length || ec.items.length > 50) return null;

  const items = [];
  for (const item of ec.items) {
    const itemId = safeText(item.item_id, 100);
    const itemName = safeText(item.item_name, 100);
    if (!itemId || !itemName || !Number.isFinite(item.price) || item.price < 0 ||
        !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 1000) return null;
    const sanitized = {
      item_id: itemId, item_name: itemName,
      price: round2(item.price), quantity: item.quantity,
    };
    for (const key of ['item_category', 'item_variant', 'affiliation']) {
      const val = safeText(item[key], 100);
      if (val) sanitized[key] = val;
    }
    items.push(sanitized);
  }
  // Standard GA4 value is the sum of item price x quantity EXCLUDING tax/shipping.
  const computed = round2(items.reduce((total, item) => total + item.price * item.quantity, 0));
  if (Math.abs(computed - ec.value) > 0.02) return null;
  const result = {
    transaction_id: reference,
    value: round2(ec.value),
    currency: ec.currency,
    items,
  };
  if (Number.isFinite(ec.tax) && ec.tax >= 0) result.tax = round2(ec.tax);
  if (Number.isFinite(ec.shipping) && ec.shipping >= 0) result.shipping = round2(ec.shipping);
  const coupon = safeText(ec.coupon, 100);
  if (coupon) result.coupon = coupon;
  if (ec.edition === 'madrid' || ec.edition === 'dubai') result.xops_edition = ec.edition;
  return result;
}

export function trackGa4Event(eventName, parameters = {}) {
  return scriptManager.sendEvent(eventName, { ...campaignEventParams(), ...parameters });
}
export function trackPageView(url, title, referrer = '') {
  if (!scriptManager.analyticsAllowed) return false;
  const page_location = safeAnalyticsPageUrl(url);
  const parameters = {
    page_location,
    page_title: typeof title === 'string' ? title.slice(0, 140) : 'X-Ops Conference',
  };
  try {
    const ref = new URL(referrer);
    if (['https:', 'http:'].includes(ref.protocol)) parameters.page_referrer = ref.origin;
  } catch { /* no or malformed referrer */ }
  return scriptManager.sendEvent('page_view', { ...campaignEventParams(), ...parameters });
}
export function ticketGa4Item(event, ticket) {
  const item_id = safeText(String(ticket?.id || ticket?.tierCode || ''), 100);
  const item_name = safeText(ticket?.name, 100);
  if (!item_id || !item_name) return null;
  return {
    item_id,
    item_name,
    item_category: safeText(event?.name, 100) || 'X-Ops Conference',
    ...(safeText(ticket?.tierCode, 100) && { item_variant: ticket.tierCode }),
    quantity: 1,
  };
}
export function trackBeginCheckout(event, ticket, edition) {
  const item = ticketGa4Item(event, ticket);
  if (!item) return false;
  const currency = typeof ticket.currency === 'string' && /^[A-Z]{3}$/.test(ticket.currency)
    ? ticket.currency : edition === 'dubai' ? 'AED' : 'EUR';
  return trackGa4Event('begin_checkout', {
    currency, items: [item], xops_edition: edition,
  });
}
export async function trackCheckoutRedirect(event, ticket, edition) {
  const item = ticketGa4Item(event, ticket);
  if (!item) return false;
  return scriptManager.sendEventBeforeLeaving('checkout_redirect', {
    items: [item], xops_edition: edition, ...campaignEventParams(),
  }, 750);
}
export function trackCheckoutCancel(edition) {
  return trackGa4Event('checkout_cancel', {
    ...(edition === 'dubai' || edition === 'madrid' ? { xops_edition: edition } : {}),
  });
}
export function emitVerifiedPurchase(data, storage = storageSafe(), now = Date.now()) {
  if (PURCHASE_MODE !== 'client' || !scriptManager.analyticsAllowed) return false;
  const purchase = purchaseFromVerifiedStatus(data);
  if (!purchase) return false;
  const ledger = readLedger(storage, now);
  if (ledger[purchase.transaction_id]) return false;
  const accepted = scriptManager.sendEvent('purchase', {
    ...campaignEventParams(), ...purchase,
  });
  if (!accepted) return false;
  // Guard before marking another React effect/page load. GA4 will also dedupe
  // by transaction_id, even when another tab races this local ledger.
  try {
    ledger[purchase.transaction_id] = now;
    storage?.setItem(PURCHASE_LEDGER_KEY, JSON.stringify(ledger));
  } catch { /* storage unavailable: rely on GA4 transaction_id dedup */ }
  return true;
}
