import React, { useEffect, useRef } from 'react';
import { useConsent } from '../contexts/ConsentContext';
import scriptManager from '../services/scriptManager';

/**
 * Component that handles conditional loading of third-party scripts based on consent
 */
const ScriptManager = () => {
  const { consent, hasInteracted } = useConsent();
  const previousConsentRef = useRef({});

  useEffect(() => {
    // Only load scripts after user has interacted with consent banner
    if (hasInteracted && consent) {
      scriptManager.updateScripts(consent, previousConsentRef.current);
      previousConsentRef.current = { ...consent };
    }
  }, [consent, hasInteracted]);

  return null; // This component doesn't render anything
};

export default ScriptManager;