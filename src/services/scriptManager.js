// Basic Consent Mode v2: no Google script, pings or conversion events before opt-in.
// Shared across the main site and the Madrid/Dubai subdomains.
import { CONSENT_CATEGORIES } from '../contexts/ConsentContext';
import { safeAnalyticsPageUrl } from '../analytics/attribution';
export const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-0J9VPTTHQT';
const CONFERENCE_HOSTS = ['xopsconference.com', 'madrid.xopsconference.com', 'dubai.xopsconference.com'];
const DENIED = Object.freeze({
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
});

function clearAnalyticsCookies() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const host = window.location.hostname;
  const domains = ['', host, '.' + host, '.xopsconference.com'];
  const cookies = document.cookie.split(';').map(c => c.split('=')[0].trim());
  for (const name of cookies) {
    if (!/^(_ga($|_)|_gid$|_gat($|_))/.test(name)) continue;
    for (const domain of new Set(domains)) {
      document.cookie = encodeURIComponent(name) +
        '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' +
        (domain ? '; domain=' + domain : '') + '; SameSite=Lax';
    }
  }
}

class ScriptManager {
  constructor() {
    this.analyticsAllowed = false;
    this.loadedScripts = new Set();
    this.pending = null;
  }
  updateScripts(consent) {
    this.analyticsAllowed = consent?.[CONSENT_CATEGORIES.ANALYTICS] === true;
    if (this.analyticsAllowed) this.loadAnalytics();
    else this.removeScript('googleAnalytics');
  }
  loadScript(name, consent) {
    if (name === 'googleAnalytics' && consent?.analytics === true) {
      this.analyticsAllowed = true;
      this.loadAnalytics();
    }
  }
  loadAnalytics() {
    if (typeof window === 'undefined' || typeof document === 'undefined' ||
        !this.analyticsAllowed || this.pending || this.loadedScripts.has('googleAnalytics')) return;
    const previousData = Array.isArray(window.dataLayer) ? window.dataLayer : [];
    window.dataLayer = previousData;
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    // Strictly set consent BEFORE any config or event.
    window.gtag('consent', 'default', DENIED);
    window.gtag('consent', 'update', { ...DENIED, analytics_storage: 'granted' });
    // Reuse a single GA4 web stream on the three hosts. Also configure the
    // same domains in GA4 Admin; do not include checkout.stripe.com as a domain.
    window.gtag('set', 'linker', { domains: CONFERENCE_HOSTS, accept_incoming: true });
    window.gtag('js', new Date());
    window.gtag('config', GA4_MEASUREMENT_ID, {
      send_page_view: false, // SPA page views are sanitised manually.
      page_location: safeAnalyticsPageUrl(window.location.href),
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });

    const script = document.createElement('script');
    script.id = 'google-analytics';
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4_MEASUREMENT_ID);
    this.pending = script;
    script.onload = () => {
      if (!this.analyticsAllowed || this.pending !== script) { script.remove(); return; }
      this.pending = null;
      this.loadedScripts.add('googleAnalytics');
    };
    script.onerror = () => {
      if (this.pending === script) this.pending = null;
      script.remove();
    };
    document.head.appendChild(script);
  }
  sendEvent(name, params = {}) {
    if (!this.analyticsAllowed || typeof window === 'undefined') return false;
    if (!window.gtag) this.loadAnalytics();
    if (!window.gtag) return false;
    window.gtag('event', name, params);
    return true;
  }
  sendEventBeforeLeaving(name, params = {}, timeoutMs = 800) {
    if (!this.analyticsAllowed || typeof window === 'undefined') return Promise.resolve(false);
    if (!window.gtag) this.loadAnalytics();
    if (!window.gtag) return Promise.resolve(false);
    return new Promise(resolve => {
      let completed = false;
      const done = value => {
        if (completed) return;
        completed = true;
        clearTimeout(timer);
        resolve(value);
      };
      const timer = setTimeout(() => done(false), timeoutMs + 50);
      window.gtag('event', name, {
        ...params, event_timeout: timeoutMs, event_callback: () => done(true),
      });
    });
  }
  getIdentifiers(timeoutMs = 450) {
    if (!this.analyticsAllowed || !this.loadedScripts.has('googleAnalytics') ||
        typeof window === 'undefined' || !window.gtag) return Promise.resolve({});
    const get = key => new Promise(resolve => {
      let completed = false;
      const timer = setTimeout(() => { completed = true; resolve(null); }, timeoutMs);
      try {
        window.gtag('get', GA4_MEASUREMENT_ID, key, value => {
          if (completed) return;
          completed = true; clearTimeout(timer); resolve(value);
        });
      } catch { clearTimeout(timer); resolve(null); }
    });
    return Promise.all([get('client_id'), get('session_id')]).then(([clientId, sessionId]) => {
      const context = {};
      if (typeof clientId === 'string' && /^\d+\.\d+$/.test(clientId)) context.gaClientId = clientId;
      if ((typeof sessionId === 'string' || typeof sessionId === 'number') &&
          /^\d+$/.test(String(sessionId))) context.gaSessionId = String(sessionId);
      return context;
    });
  }
  removeScript(name) {
    if (name !== 'googleAnalytics' || typeof document === 'undefined') return;
    if (typeof window !== 'undefined' && window.gtag) {
      try { window.gtag('consent', 'update', DENIED); } catch { /* ignore */ }
    }
    if (this.pending) {
      this.pending.onload = null;
      this.pending.onerror = null;
      this.pending.remove();
      this.pending = null;
    }
    document.getElementById('google-analytics')?.remove();
    this.loadedScripts.delete('googleAnalytics');
    if (typeof window !== 'undefined') {
      delete window.gtag;
      delete window.dataLayer;
    }
    clearAnalyticsCookies();
  }
  getEnabledScripts(consent) {
    return consent?.analytics ? ['googleAnalytics'] : [];
  }
}
export const scriptManager = new ScriptManager();
export default scriptManager;
