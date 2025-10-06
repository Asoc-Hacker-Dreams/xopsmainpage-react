import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Cookie consent categories
export const CONSENT_CATEGORIES = {
  ESSENTIAL: 'essential',
  ANALYTICS: 'analytics', 
  MARKETING: 'marketing'
};

// Default consent state (GDPR compliant - all denied except essential)
const DEFAULT_CONSENT = {
  [CONSENT_CATEGORIES.ESSENTIAL]: true,  // Always required
  [CONSENT_CATEGORIES.ANALYTICS]: false,
  [CONSENT_CATEGORIES.MARKETING]: false
};

const CONSENT_STORAGE_KEY = 'xops-cookie-consent';
const CONSENT_EXPIRY_MONTHS = 12;

const ConsentContext = createContext();

export const useConsent = () => {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
};

export const ConsentProvider = ({ children }) => {
  const [consent, setConsent] = useState(DEFAULT_CONSENT);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Load consent from localStorage on mount
  useEffect(() => {
    const loadStoredConsent = () => {
      try {
        const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
        if (stored) {
          const { consent: storedConsent, timestamp, version } = JSON.parse(stored);
          
          // Check if consent is still valid (not expired)
          const expiryDate = new Date(timestamp);
          expiryDate.setMonth(expiryDate.getMonth() + CONSENT_EXPIRY_MONTHS);
          
          if (new Date() < expiryDate && version === '1.0') {
            setConsent(storedConsent);
            setHasInteracted(true);
            setShowBanner(false);
            return;
          }
        }
      } catch (error) {
        console.warn('Error loading stored consent:', error);
      }
      
      // If no valid stored consent, show banner
      setShowBanner(true);
    };

    loadStoredConsent();
  }, []);

  // Save consent to localStorage
  const saveConsent = (newConsent) => {
    try {
      const consentData = {
        consent: newConsent,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
    } catch (error) {
      console.error('Error saving consent:', error);
    }
  };

  // Accept all cookies
  const acceptAll = () => {
    const newConsent = {
      [CONSENT_CATEGORIES.ESSENTIAL]: true,
      [CONSENT_CATEGORIES.ANALYTICS]: true,
      [CONSENT_CATEGORIES.MARKETING]: true
    };
    setConsent(newConsent);
    setHasInteracted(true);
    setShowBanner(false);
    saveConsent(newConsent);
  };

  // Reject all non-essential cookies
  const rejectAll = () => {
    const newConsent = DEFAULT_CONSENT;
    setConsent(newConsent);
    setHasInteracted(true);
    setShowBanner(false);
    saveConsent(newConsent);
  };

  // Save custom preferences
  const savePreferences = (newConsent) => {
    setConsent(newConsent);
    setHasInteracted(true);
    setShowBanner(false);
    saveConsent(newConsent);
  };

  // Update specific category
  const updateCategory = (category, enabled) => {
    if (category === CONSENT_CATEGORIES.ESSENTIAL) {
      return; // Essential cookies cannot be disabled
    }
    
    const newConsent = { ...consent, [category]: enabled };
    setConsent(newConsent);
    saveConsent(newConsent);
  };

  // Show preferences modal (used by footer link)
  const showPreferences = () => {
    // This will be handled by the modal component
    return true;
  };

  // Reset consent (for testing/debugging)
  const resetConsent = () => {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    setConsent(DEFAULT_CONSENT);
    setHasInteracted(false);
    setShowBanner(true);
  };

  const value = {
    consent,
    hasInteracted,
    showBanner,
    acceptAll,
    rejectAll,
    savePreferences,
    updateCategory,
    showPreferences,
    resetConsent,
    // Utility functions
    hasConsent: (category) => consent[category] === true,
    isEssential: (category) => category === CONSENT_CATEGORIES.ESSENTIAL
  };

  return (
    <ConsentContext.Provider value={value}>
      {children}
    </ConsentContext.Provider>
  );
};

ConsentProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ConsentContext;