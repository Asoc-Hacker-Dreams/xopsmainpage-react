/**
 * Consent-gated campaign attribution. Stored only for this browser tab;
 * never copy buyer identity or third-party click IDs into GA4 / order metadata.
 *
 * Across sibling event subdomains the safe, allowlisted UTMs are propagated
 * on a deliberate link click only after analytics consent. Stripe itself is
 * never decorated. Attribution on an order requires backend persistence.
 */
export const UTM_KEYS = Object.freeze([
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_content', 'utm_term',
]);
export const ATTRIBUTION_KEY = 'xops_utm_attribution_v1';
export const ATTRIBUTION_VERSION = 1;
export const ATTRIBUTION_TTL_MS = 24 * 60 * 60 * 1000;

const HOSTS = new Set([
  'xopsconference.com',
  'www.xopsconference.com',
  'madrid.xopsconference.com',
  'dubai.xopsconference.com',
]);

export function sanitizeUtmValue(raw) {
  if (typeof raw !== 'string') return null;
  const value = raw.trim().slice(0, 100);
  // Avoid sending personal data, URLs, control characters or secrets
  // accidentally embedded into campaign strings by external links.
  if (!value || /[@?&#=%\\<>]/.test(value) || /:\/\//.test(value) ||
      /\d{8,}/.test(value) || !/^[\p{L}\p{N} _.,/+:\-]+$/u.test(value)) return null;
  return value;
}
export function parseUtm(search = '') {
  const params = new URLSearchParams(search);
  const touch = {};
  for (const key of UTM_KEYS) {
    const value = sanitizeUtmValue(params.get(key));
    if (value) touch[key] = value;
  }
  return Object.keys(touch).length ? touch : null;
}
function storageSafe() {
  try { return typeof window === 'undefined' ? null : window.sessionStorage; }
  catch { return null; }
}
export function clearAttribution(storage = storageSafe()) {
  try { storage?.removeItem(ATTRIBUTION_KEY); } catch { /* restricted storage */ }
}
export function readAttribution(storage = storageSafe(), now = Date.now()) {
  try {
    const raw = storage?.getItem(ATTRIBUTION_KEY);
    const value = raw ? JSON.parse(raw) : null;
    if (value?.version !== ATTRIBUTION_VERSION ||
        !Number.isFinite(value?.updatedAt) ||
        now - value.updatedAt > ATTRIBUTION_TTL_MS ||
        now < value.updatedAt ||
        !value?.firstTouch || !value?.lastTouch) {
      if (raw) clearAttribution(storage);
      return null;
    }
    const first = parseUtm(new URLSearchParams(value.firstTouch).toString());
    const last = parseUtm(new URLSearchParams(value.lastTouch).toString());
    return first && last ? {
      version: ATTRIBUTION_VERSION, firstTouch: first, lastTouch: last,
      firstCapturedAt: value.firstCapturedAt,
      updatedAt: value.updatedAt,
    } : null;
  } catch { return null; }
}
export function captureAttribution(search, consented, storage = storageSafe(), now = Date.now()) {
  if (!consented) return null;
  const latest = parseUtm(search);
  if (!latest) return readAttribution(storage, now);
  const existing = readAttribution(storage, now);
  const value = {
    version: ATTRIBUTION_VERSION,
    firstTouch: existing?.firstTouch ?? latest,
    lastTouch: latest,
    firstCapturedAt: existing?.firstCapturedAt ?? now,
    updatedAt: now,
  };
  try { storage?.setItem(ATTRIBUTION_KEY, JSON.stringify(value)); }
  catch { /* no persistent attribution when storage is denied */ }
  return value;
}
export function campaignEventParams(storage = storageSafe()) {
  const last = readAttribution(storage)?.lastTouch;
  if (!last) return {};
  // Short keys for registered GA4 event-scoped custom dimensions.
  return {
    ...(last.utm_source && { xops_utm_source: last.utm_source }),
    ...(last.utm_medium && { xops_utm_medium: last.utm_medium }),
    ...(last.utm_campaign && { xops_utm_campaign: last.utm_campaign }),
    ...(last.utm_id && { xops_utm_id: last.utm_id }),
  };
}
export function buildAttributionForCheckout(storage = storageSafe()) {
  const value = readAttribution(storage);
  if (!value) return null;
  return {
    version: value.version,
    firstTouch: value.firstTouch,
    lastTouch: value.lastTouch,
    firstCapturedAt: new Date(value.firstCapturedAt).toISOString(),
    lastCapturedAt: new Date(value.updatedAt).toISOString(),
  };
}
export function safeAnalyticsPageUrl(url) {
  const parsed = new URL(url, 'https://xopsconference.com');
  const query = new URLSearchParams();
  const safeUtms = parseUtm(parsed.search) || {};
  for (const key of UTM_KEYS) if (safeUtms[key]) query.set(key, safeUtms[key]);
  return parsed.origin + parsed.pathname + (query.size ? '?' + query.toString() : '');
}
export function decorateConferenceLink(href, origin, storage = storageSafe()) {
  if (typeof href !== 'string' || !href || !origin) return null;
  try {
    const url = new URL(href, origin);
    const current = new URL(origin);
    if (!['https:', 'http:'].includes(url.protocol) ||
        !HOSTS.has(url.hostname) || !HOSTS.has(current.hostname) ||
        url.origin === current.origin) return null;
    const latest = readAttribution(storage)?.lastTouch;
    if (!latest) return null;
    for (const key of UTM_KEYS) {
      if (latest[key] && !url.searchParams.has(key)) url.searchParams.set(key, latest[key]);
    }
    return url.href;
  } catch { return null; }
}
