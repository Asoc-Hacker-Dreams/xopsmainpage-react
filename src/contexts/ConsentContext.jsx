import React, { createContext, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

export const CONSENT_CATEGORIES = Object.freeze({
  ESSENTIAL: 'essential',
  ANALYTICS: 'analytics',
});

export const CONSENT_STORAGE_KEY = 'xopsconf_consent_v4';
export const CONSENT_POLICY_VERSION = '2026-10-27';
export const CONSENT_EXPIRY_MONTHS = 12;
export const DEFAULT_CONSENT = Object.freeze({
  essential: true,
  analytics: false,
});

function sanitizeConsent(value) {
  return {
    essential: true,
    analytics: value?.analytics === true,
  };
}
function loadConsent() {
  const absent = { consent: { ...DEFAULT_CONSENT }, hasInteracted: false, showBanner: true };
  if (typeof window === 'undefined' || !window.localStorage) return absent;
  try {
    const stored = JSON.parse(window.localStorage.getItem(CONSENT_STORAGE_KEY) || 'null');
    if (!stored || stored.version !== CONSENT_POLICY_VERSION || !stored.timestamp) return absent;
    const date = new Date(stored.timestamp);
    if (!Number.isFinite(date.getTime()) || date.getTime() > Date.now()) return absent;
    const expires = new Date(date);
    expires.setMonth(expires.getMonth() + CONSENT_EXPIRY_MONTHS);
    if (Date.now() >= expires.getTime()) return absent;
    return { consent: sanitizeConsent(stored.consent), hasInteracted: true, showBanner: false };
  } catch {
    return absent;
  }
}

const ConsentContext = createContext(null);
export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) throw new Error('useConsent must be used within a ConsentProvider');
  return context;
}

export function ConsentProvider({ children }) {
  const [state, setState] = useState(loadConsent);

  const setDecision = (newConsent, method) => {
    const validated = sanitizeConsent(newConsent);
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
        consent: validated,
        timestamp: new Date().toISOString(),
        method, version: CONSENT_POLICY_VERSION,
      }));
    } catch { /* storage may be unavailable; session choice still takes effect */ }
    setState({ consent: validated, hasInteracted: true, showBanner: false });
  };

  const acceptAll = () => setDecision({ essential: true, analytics: true }, 'accept-all');
  const rejectAll = () => setDecision(DEFAULT_CONSENT, 'reject-all');
  const savePreferences = (newConsent) => setDecision(newConsent, 'custom');
  const updateCategory = (category, enabled) => {
    if (category === CONSENT_CATEGORIES.ESSENTIAL || !Object.values(CONSENT_CATEGORIES).includes(category)) return;
    setDecision({ ...state.consent, [category]: enabled }, 'custom');
  };
  const resetConsent = () => {
    try { window.localStorage.removeItem(CONSENT_STORAGE_KEY); } catch { /* ignore */ }
    setState({ consent: { ...DEFAULT_CONSENT }, hasInteracted: false, showBanner: true });
  };

  const value = useMemo(() => ({
    ...state, acceptAll, rejectAll, savePreferences, updateCategory, resetConsent,
    hasConsent: (category) => state.hasInteracted && state.consent[category] === true,
    isEssential: (category) => category === CONSENT_CATEGORIES.ESSENTIAL,
  }), [state]);
  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}
ConsentProvider.propTypes = { children: PropTypes.node.isRequired };
export default ConsentContext;
