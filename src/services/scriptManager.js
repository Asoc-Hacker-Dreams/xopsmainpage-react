// Consent-aware, single-source third-party script loader.
// NOTE: Google Analytics is NOT a necessary cookie and must never load pre-consent.
import { CONSENT_CATEGORIES } from '../contexts/ConsentContext';
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-0J9VPTTHQT';

function clearAnalyticsCookies() {
  if (typeof document === 'undefined') return;
  const host = window.location.hostname;
  const parts = host.split('.');
  const domains = ['', host, '.' + host, parts.length >= 2 ? '.' + parts.slice(-2).join('.') : ''];
  const cookies = document.cookie.split(';').map(s => s.split('=')[0].trim());
  for (const name of cookies) {
    if (!/^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name)) continue;
    for (const domain of domains) {
      const suffix = domain ? '; domain=' + domain : '';
      document.cookie = encodeURIComponent(name) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + suffix + '; SameSite=Lax';
    }
  }
}
class ScriptManager {
  constructor() {
    this.loadedScripts = new Set();
    this.pending = null;
    this.analyticsAllowed = false;
  }
  updateScripts(consent) {
    const allowed = consent?.[CONSENT_CATEGORIES.ANALYTICS] === true;
    this.analyticsAllowed = allowed;
    if (allowed) this.loadAnalytics();
    else this.removeScript('googleAnalytics');
  }
  loadScript(name, consent) {
    if (name === 'googleAnalytics' && consent?.analytics === true) {
      this.analyticsAllowed = true;
      this.loadAnalytics();
    }
  }
  loadAnalytics() {
    if (typeof document === 'undefined' || !this.analyticsAllowed || this.pending || this.loadedScripts.has('googleAnalytics')) return;
    const script = document.createElement('script');
    script.id = 'google-analytics';
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    this.pending = script;
    script.onload = () => {
      if (!this.analyticsAllowed || this.pending !== script) { script.remove(); return; }
      this.pending = null;
      this.loadedScripts.add('googleAnalytics');
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', GA_ID, {
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });
    };
    script.onerror = () => {
      if (this.pending === script) this.pending = null;
      script.remove();
    };
    document.head.appendChild(script);
  }
  removeScript(name) {
    if (name !== 'googleAnalytics' || typeof document === 'undefined') return;
    if (this.pending) {
      this.pending.onload = null;
      this.pending.onerror = null;
      this.pending.remove();
      this.pending = null;
    }
    document.getElementById('google-analytics')?.remove();
    this.loadedScripts.delete('googleAnalytics');
    try { if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'denied' }); } catch { /* ignore */ }
    delete window.gtag;
    delete window.dataLayer;
    clearAnalyticsCookies();
  }
  getEnabledScripts(consent) {
    return consent?.analytics ? ['googleAnalytics'] : [];
  }
}
export const scriptManager = new ScriptManager();
export default scriptManager;
