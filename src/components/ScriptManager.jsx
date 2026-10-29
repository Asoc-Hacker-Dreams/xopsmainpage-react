import React, { useEffect } from 'react';
import { useConsent } from '../contexts/ConsentContext';
import scriptManager from '../services/scriptManager';

export default function ScriptManager() {
  const { consent, hasInteracted } = useConsent();
  useEffect(() => {
    scriptManager.updateScripts(hasInteracted ? consent : { essential: true, analytics: false });
  }, [consent, hasInteracted]);
  return null;
}
